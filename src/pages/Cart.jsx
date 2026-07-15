import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/useCart';
import CartItem from '../components/CartItem';
import CouponInput from '../components/CouponInput';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const Cart = () => {
  const { cart, getCartTotal, getTax, getShipping, getGrandTotal } = useCart();
  const [discount, setDiscount] = useState(0);

  const subtotal = getCartTotal;
  const tax = getTax;
  const shipping = getShipping;
  const total = getGrandTotal - discount;
  const canCheckout = cart.length > 0 && total > 0;

  if (cart.length === 0) {
    return (
      <motion.div {...pageTransition}>
        <div className="min-h-[70vh] flex items-center justify-center px-4">
          <motion.div 
            className="max-w-md w-full"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-12 border border-slate-200/60 text-center">
              <motion.div 
                className="text-7xl mb-6"
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
              >
                🛒
              </motion.div>
              <motion.h2 
                className="text-3xl font-bold text-slate-900 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Your cart is empty
              </motion.h2>
              <motion.p 
                className="text-slate-600 mb-8 text-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Looks like you haven't added anything yet
              </motion.p>
              <motion.div 
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link 
                  to="/" 
                  className="inline-block bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Start Shopping
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div {...pageTransition}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <CartItem item={item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="lg:col-span-1">
            <motion.div 
              className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-sm sticky top-4 border border-slate-200/60"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-4 text-slate-900">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-slate-700">
                  <span>Item Total:</span>
                  <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Shipping:</span>
                  <span className="font-medium">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Tax (5%):</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <AnimatePresence>
                  {discount > 0 && (
                    <motion.div 
                      className="flex justify-between text-emerald-600 font-semibold"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <span>Discount:</span>
                      <motion.span
                        initial={{ scale: 1.5, y: -10 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring" }}
                      >
                        -₹{discount.toFixed(2)}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
                <div className="border-t border-slate-200 pt-3 flex justify-between font-bold text-xl">
                  <span className="text-slate-900">Grand Total:</span>
                  <motion.span 
                    className="text-slate-900"
                    key={total}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    ₹{total.toFixed(2)}
                  </motion.span>
                </div>
              </div>

              <CouponInput total={subtotal} onApplyCoupon={setDiscount} />

              <motion.div whileTap={{ scale: canCheckout ? 0.98 : 1 }}>
                {canCheckout ? (
                  <Link
                    to="/checkout"
                    className="block w-full bg-slate-900 text-white text-center py-3 rounded-xl hover:bg-slate-800 font-medium mt-4 transition-all duration-200"
                  >
                    Proceed to Checkout
                  </Link>
                ) : (
                  <button
                    disabled
                    className="block w-full bg-slate-200 text-slate-400 text-center py-3 rounded-xl font-medium mt-4 cursor-not-allowed"
                  >
                    Cart is Empty
                  </button>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
