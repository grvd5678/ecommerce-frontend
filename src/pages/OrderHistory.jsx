import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import api from '../utils/api';
import OrderTracker from '../components/OrderTracker';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchOrders();
  }, [user]);

  if (!user) return <Navigate to="/login" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <h1 className="text-4xl font-bold text-slate-900 mb-8">Order History</h1>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse h-32" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📦</p>
          <p className="text-slate-400 text-xl">No orders yet</p>
          <p className="text-slate-500 text-sm mt-2">Start shopping to see your orders here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white p-6 rounded-lg shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">#{order._id.slice(-8).toUpperCase()}</h3>
                  <p className="text-slate-500 text-sm">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <OrderTracker status={order.status} />

              <div className="border-t pt-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between mb-2 text-sm">
                    <span className="text-slate-700">{item.name} x{item.quantity}</span>
                    <span className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t">
                  <span>Total</span>
                  <span>₹{order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-3 text-sm text-slate-500 space-y-1">
                <p>📍 {order.shippingAddress?.address}, {order.shippingAddress?.name}</p>
                <p>
                  {order.paymentMethod === 'razorpay' ? '💳 Online (Razorpay)' : '💵 Cash on Delivery'}
                  {' · '}
                  <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                    {order.paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrderHistory;
