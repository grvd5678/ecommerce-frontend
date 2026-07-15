import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const getStatusColor = (status) => {
  const colors = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const ALLOWED_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const ORDER_ID_REGEX = /^[a-f0-9]{24}$/i;

const buildOrderStatusUrl = (orderId) => {
  if (!ORDER_ID_REGEX.test(orderId)) throw new Error('Invalid order ID format');
  return `/orders/${encodeURIComponent(orderId)}/status`;
};

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    api.get('/orders/admin/all')
      .then(({ data }) => setOrders(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!ALLOWED_STATUSES.includes(newStatus)) {
      console.error('Invalid status value');
      return;
    }
    try {
      const url = buildOrderStatusUrl(orderId);
      await api.put(url, { status: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (user?.role !== 'admin') return <div className="text-center py-8">Access Denied</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Manage Orders</h1>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-16 bg-slate-200 rounded" />)}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    #{order._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{order.user?.name}</div>
                    <div className="text-sm text-gray-500">{order.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {order.items.map((item, i) => (
                      <div key={i}>{item.name} x{item.quantity}</div>
                    ))}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>₹{order.total?.toFixed(2)}</div>
                    <div className="text-xs text-gray-500">
                      {order.paymentMethod === 'razorpay' ? '💳 Online' : '💵 COD'}
                      {' · '}
                      <span className={order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'}>
                        {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-8 text-gray-500">No orders found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
