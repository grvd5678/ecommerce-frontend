import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role !== 'admin') return;
    const fetchStats = async () => {
      try {
        const [productsRes, ordersRes, usersRes] = await Promise.all([
          api.get('/products?limit=1'),
          api.get('/orders/admin/all'),
          api.get('/admin/users')
        ]);
        const orders = ordersRes.data;
        const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
        setStats({
          totalProducts: productsRes.data.pagination?.totalProducts || 0,
          totalOrders: orders.length,
          totalUsers: usersRes.data.length,
          totalRevenue
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p className="text-gray-600 mt-2">You don't have admin privileges.</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Products', value: stats.totalProducts, color: 'text-blue-600' },
    { label: 'Total Orders', value: stats.totalOrders, color: 'text-green-600' },
    { label: 'Total Users', value: stats.totalUsers, color: 'text-purple-600' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue.toFixed(2)}`, color: 'text-orange-600' }
  ];

  const quickActions = [
    { label: 'Manage Products', desc: 'Add, edit, or remove products', path: '/admin/products' },
    { label: 'Manage Orders', desc: 'View and update order status', path: '/admin/orders' },
    { label: 'Manage Users', desc: 'View and manage user accounts', path: '/admin/users' }
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
            {loading ? (
              <div className="h-8 bg-slate-200 rounded animate-pulse mt-2" />
            ) : (
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <motion.div
            key={action.label}
            whileHover={{ scale: 1.02 }}
            className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
            onClick={() => navigate(action.path)}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.label}</h3>
            <p className="text-gray-600">{action.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;
