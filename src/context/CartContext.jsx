import { useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import api from '../utils/api';
import { cartReducer } from '../utils/cartReducer';
import Toast from '../components/Toast';
import { CartContext } from './CartContextDefinition';
import getSocket from '../utils/socket';

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], () => {
    const localData = localStorage.getItem('cart');
    return localData ? JSON.parse(localData) : [];
  });
  
  const [toast, setToast] = useState(null);
  const [quickBuyItem, setQuickBuyItem] = useState(null);

  // Group Shopping Real-time State
  const [groupRoomId, setGroupRoomId] = useState(() => localStorage.getItem('group_cart_room') || null);
  const [groupMemberCount, setGroupMemberCount] = useState(1);
  const [groupNotice, setGroupNotice] = useState(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Connect to Collaborative WebSocket Room when active
  useEffect(() => {
    if (!groupRoomId) return;

    const socket = getSocket();
    socket.connect();

    const storedUser = localStorage.getItem('user');
    const userName = storedUser ? JSON.parse(storedUser)?.name : 'Shopper';

    socket.emit('join-cart-room', {
      roomId: groupRoomId,
      user: userName,
    });

    socket.on('cart-state-synced', ({ cart: remoteCart, memberCount }) => {
      if (remoteCart && remoteCart.length > 0) {
        dispatch({ type: 'SET_CART', payload: remoteCart });
      }
      setGroupMemberCount(memberCount);
    });

    socket.on('member-joined', ({ user, memberCount }) => {
      setGroupMemberCount(memberCount);
      setToast(`👥 ${user} joined the group cart!`);
    });

    socket.on('member-left', ({ user, memberCount }) => {
      setGroupMemberCount(memberCount);
      setToast(`👋 ${user} left the group cart.`);
    });

    socket.on('cart-updated-by-peer', ({ cart: remoteCart, action, item, user }) => {
      dispatch({ type: 'SET_CART', payload: remoteCart });
      const actionName =
        action === 'add'
          ? `added "${item?.name || 'item'}"`
          : action === 'remove'
          ? `removed an item`
          : `updated quantities`;
      setToast(`🛒 ${user} ${actionName}`);
    });

    return () => {
      socket.off('cart-state-synced');
      socket.off('member-joined');
      socket.off('member-left');
      socket.off('cart-updated-by-peer');
    };
  }, [groupRoomId]);

  // Group Cart Actions
  const startGroupCart = useCallback((roomId) => {
    const id = roomId || Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroupRoomId(id);
    localStorage.setItem('group_cart_room', id);
    setToast(`🎉 Group Cart created! Room Code: ${id}`);
    return id;
  }, []);

  const leaveGroupCart = useCallback(() => {
    const socket = getSocket();
    socket.disconnect();
    setGroupRoomId(null);
    setGroupMemberCount(1);
    localStorage.removeItem('group_cart_room');
    setToast('Left group cart session');
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
    if (groupRoomId) {
      const socket = getSocket();
      socket.emit('sync-cart-action', {
        roomId: groupRoomId,
        cart: [],
        action: 'clear',
      });
    }
  }, [groupRoomId]);

  const addToCart = useCallback(async (product) => {
    try {
      await api.post('/cart', { productId: product.id || product._id, quantity: 1 });
      dispatch({ type: 'ADD_TO_CART', payload: product });
      setToast('Item added to cart!');

      if (groupRoomId) {
        const socket = getSocket();
        // Compute optimistic updated cart
        const existing = cart.find(i => (i.id || i._id) === (product.id || product._id));
        const updatedCart = existing
          ? cart.map(i => (i.id || i._id) === (product.id || product._id) ? { ...i, quantity: i.quantity + 1 } : i)
          : [...cart, { ...product, quantity: 1 }];

        socket.emit('sync-cart-action', {
          roomId: groupRoomId,
          cart: updatedCart,
          action: 'add',
          item: product,
        });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  }, [cart, groupRoomId]);

  const removeFromCart = useCallback((id) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: id });
    setToast('Item removed from cart');

    if (groupRoomId) {
      const socket = getSocket();
      const updatedCart = cart.filter(i => (i.id || i._id) !== id);
      socket.emit('sync-cart-action', {
        roomId: groupRoomId,
        cart: updatedCart,
        action: 'remove',
      });
    }
  }, [cart, groupRoomId]);

  const updateQuantity = useCallback((id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });

      if (groupRoomId) {
        const socket = getSocket();
        const updatedCart = cart.map(i => (i.id || i._id) === id ? { ...i, quantity } : i);
        socket.emit('sync-cart-action', {
          roomId: groupRoomId,
          cart: updatedCart,
          action: 'update-qty',
        });
      }
    }
  }, [cart, groupRoomId, removeFromCart]);

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
        items,
        groupRoomId,
        groupMemberCount,
        startGroupCart,
        leaveGroupCart,
      }}
    >
      {children}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </CartContext.Provider>
  );
};
