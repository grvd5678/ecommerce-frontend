import { useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import api from '../utils/api';
import { cartReducer } from '../utils/cartReducer';
import Toast from '../components/Toast';
import { CartContext } from './CartContextDefinition';

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });
  
  const [toast, setToast] = useState(null);
  const [quickBuyItem, setQuickBuyItem] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const addToCart = useCallback(async (product) => {
    try {
      await api.post('/cart', { productId: product.id, quantity: 1 });
      // After success, we might need to refresh cart state from API.
      // For now, let's dispatch local update to keep UI responsive.
      dispatch({ type: 'ADD_TO_CART', payload: product });
      setToast('Item added to cart!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      // Toast handled by api interceptor
    }
  }, []);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    setToast('Item removed from cart');
  }, []);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
    }
  }, [removeFromCart]);

  const items = useMemo(() => {
    return quickBuyItem ? [quickBuyItem] : cart;
  }, [quickBuyItem, cart]);

  const getCartTotal = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const getCartCount = useMemo(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const getTax = useMemo(() => getCartTotal * 0.05, [getCartTotal]);
  const getShipping = useMemo(() => (items.length > 0 ? 40 : 0), [items.length]);
  const getGrandTotal = useMemo(() => getCartTotal + getTax + getShipping, [getCartTotal, getTax, getShipping]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        getTax,
        getShipping,
        getGrandTotal,
        quickBuyItem,
        setQuickBuyItem,
        clearQuickBuyItem: () => setQuickBuyItem(null),
        items
      }}
    >
      {children}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </CartContext.Provider>
  );
};
