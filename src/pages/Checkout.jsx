import { useState } from 'react';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const LABELS = {
  billingInfo: 'Billing Information',
  paymentMethod: 'Payment Method',
  address: 'Address',
  fullName: 'Full Name',
  email: 'Email',
  phone: 'Phone',
};

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { items, getCartTotal, getTax, getShipping, getGrandTotal, clearCart, clearQuickBuyItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [form, setForm] = useState({ name: '', email: user?.email || '', phone: '', address: '' });

  if (items.length === 0 && !showSuccess) return <Navigate to="/" />;
  if (!user) return <Navigate to="/login" />;

  const subtotal = getCartTotal;
  const tax = getTax;
  const shipping = getShipping;
  const total = getGrandTotal;

  const buildOrderPayload = (extra = {}) => ({
    items: items.map(item => ({
      product: item._id || item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),
    shippingAddress: { name: form.name, email: form.email, phone: form.phone, address: form.address },
    subtotal, tax, shipping, total,
    ...extra
  });

  const handleSuccess = () => {
    clearCart();
    clearQuickBuyItem();
    setShowSuccess(true);
    setTimeout(() => navigate('/orders'), 2500);
  };

  const handleCOD = async () => {
    await api.post('/orders', buildOrderPayload({ paymentMethod: 'cod', paymentStatus: 'pending' }));
    handleSuccess();
  };

  const handleRazorpay = async () => {
    const loaded = await loadRazorpayScript();
    if (!loaded) { setError('Failed to load Razorpay. Check your connection.'); return; }

    const { data } = await api.post('/payment/create-order', { amount: total });

    return new Promise((resolve, reject) => {
      const options = {
        key: RAZORPAY_KEY,
        amount: data.amount,
        currency: data.currency,
        name: 'ShopHub',
        description: 'Order Payment',
        order_id: data.orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#0f172a' },
        handler: async (response) => {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });
            await api.post('/orders', buildOrderPayload({
              paymentMethod: 'razorpay',
              paymentStatus: 'paid',
              stripePaymentIntentId: response.razorpay_payment_id
            }));
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: { ondismiss: () => reject(new Error('Payment cancelled')) }
      };
      new window.Razorpay(options).open();
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (paymentMethod === 'cod') await handleCOD();
      else await handleRazorpay().then(handleSuccess);
    } catch (err) {
      if (err.message !== 'Payment cancelled')
        setError(err.response?.data?.message || err.message || 'Order failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div {...pageTransition}>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl text-center shadow-xl"
              initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-6xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Confirmed!</h2>
              <p className="text-slate-600">Total: ₹{total.toFixed(2)}</p>
              <p className="text-slate-400 text-sm mt-2">Redirecting to your orders...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">Checkout</h1>
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Billing Form */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-4">{LABELS.billingInfo}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name', label: LABELS.fullName, type: 'text' },
                { key: 'email', label: LABELS.email, type: 'email' },
                { key: 'phone', label: LABELS.phone, type: 'text' },
              ].map(({ key, label, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    required
                  />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{LABELS.address}</label>
                <textarea
                  value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows="3"
                  required
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{LABELS.paymentMethod}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'cod', label: '💵 Cash on Delivery' },
                    { value: 'razorpay', label: '💳 Pay Online', disabled: !RAZORPAY_KEY }
                  ].map(({ value, label, disabled }) => (
                    <button
                      key={value}
                      type="button"
                      disabled={disabled}
                      onClick={() => setPaymentMethod(value)}
                      className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                        paymentMethod === value
                          ? 'border-slate-900 bg-slate-900 text-white'
                          : 'border-slate-200 text-slate-700 hover:border-slate-400'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {label}
                      {disabled && <span className="block text-xs opacity-70">Not configured</span>}
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'razorpay' && (
                <p className="text-xs text-slate-500 bg-blue-50 p-3 rounded-lg">
                  🔒 You'll be redirected to Razorpay's secure payment page. Supports UPI, Cards, NetBanking & Wallets.
                </p>
              )}

              <motion.button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 font-medium disabled:opacity-50"
                whileTap={{ scale: 0.98 }}
              >
                {loading
                  ? (paymentMethod === 'razorpay' ? 'Opening Payment...' : 'Placing Order...')
                  : `${paymentMethod === 'razorpay' ? 'Pay' : 'Place Order'} - ₹${total.toFixed(2)}`}
              </motion.button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-slate-700">{item.name} x {item.quantity}</span>
                  <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-3">
              <div className="flex justify-between text-slate-700"><span>Item Total:</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-700"><span>Shipping:</span><span>₹{shipping.toFixed(2)}</span></div>
              <div className="flex justify-between text-slate-700"><span>Tax (5%):</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="border-t pt-3 flex justify-between font-bold text-xl">
                <span>Grand Total:</span><span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout;
