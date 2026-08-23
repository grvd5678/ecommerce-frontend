import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowUpRight,
  RefreshCw,
  Layers,
  ChevronRight
} from 'lucide-react';

const STATUS_COLORS = {
  delivered: '#10B981', // green-500
  processing: '#3B82F6', // blue-500
  pending: '#F59E0B', // amber-500
  shipped: '#8B5CF6', // purple-500
  cancelled: '#EF4444' // red-500
};

const CATEGORY_COLORS = ['#3B82F6', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B', '#6366F1'];

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState(30);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = async (days = timeRange) => {
    try {
      setRefreshing(true);
      const res = await api.get(`/admin/analytics?days=${days}`);
      setData(res.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAnalytics(timeRange);
    }
  }, [user, timeRange]);

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg border border-red-100">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            !
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Access Denied</h1>
          <p className="text-gray-600 mt-2">You need administrator privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    averageOrderValue: 0
  };

  const statCards = [
    {
      label: 'Total Revenue',
      value: `₹${(kpis.totalRevenue || 0).toLocaleString('en-IN')}`,
      subtext: 'Net revenue from orders',
      icon: DollarSign,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50 text-emerald-600 border-emerald-200'
    },
    {
      label: 'Total Orders',
      value: (kpis.totalOrders || 0).toLocaleString('en-IN'),
      subtext: 'Lifetime orders placed',
      icon: ShoppingCart,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      label: 'Avg Order Value (AOV)',
      value: `₹${(kpis.averageOrderValue || 0).toLocaleString('en-IN')}`,
      subtext: 'Average spend per order',
      icon: TrendingUp,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    },
    {
      label: 'Active Users',
      value: (kpis.totalUsers || 0).toLocaleString('en-IN'),
      subtext: 'Registered accounts',
      icon: Users,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ];

  const quickActions = [
    {
      label: 'Manage Products',
      desc: `${kpis.totalProducts} active items in store`,
      path: '/admin/products',
      icon: Package,
      badge: `${kpis.totalProducts} Items`
    },
    {
      label: 'Manage Orders',
      desc: `${kpis.totalOrders} total customer orders`,
      path: '/admin/orders',
      icon: ShoppingCart,
      badge: `${kpis.totalOrders} Orders`
    },
    {
      label: 'Manage Users',
      desc: `${kpis.totalUsers} registered customers`,
      path: '/admin/users',
      icon: Users,
      badge: `${kpis.totalUsers} Users`
    }
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-xs">
          <p className="font-semibold text-slate-300 mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="flex items-center gap-2" style={{ color: entry.color }}>
              <span>{entry.name}:</span>
              <span className="font-bold">
                {entry.name.includes('Revenue') || entry.name.includes('Sales') ? `₹${entry.value.toLocaleString('en-IN')}` : entry.value}
              </span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="container mx-auto px-4 py-8 max-w-7xl"
    >
      {/* Header with Title & Range Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Analytics</h1>
            <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Live BI
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Real-time business performance, revenue trends, and inventory health.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-3">
          <div className="inline-flex bg-gray-100 dark:bg-slate-800 p-1 rounded-xl border border-gray-200 dark:border-slate-700 text-xs font-medium">
            {[
              { label: '7 Days', value: 7 },
              { label: '30 Days', value: 30 },
              { label: '90 Days', value: 90 },
              { label: 'All Time', value: 365 }
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  timeRange === option.value
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchAnalytics(timeRange)}
            disabled={refreshing}
            className="p-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 transition-all disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  {card.label}
                </span>
                {loading ? (
                  <div className="h-7 w-28 bg-gray-200 dark:bg-slate-800 rounded animate-pulse my-1.5" />
                ) : (
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white my-1">{card.value}</h3>
                )}
                <span className="text-xs text-gray-400 dark:text-gray-500">{card.subtext}</span>
              </div>
              <div className={`p-3.5 rounded-2xl ${card.lightColor} border`}>
                <Icon className="w-6 h-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row 1: Revenue Timeline & Order Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales & Revenue Trend (2 Cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue & Sales Trends</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Daily gross revenue and order frequency</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Revenue (₹)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" /> Orders
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : data?.salesOverTime?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.salesOverTime} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis
                    dataKey="date"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#4F46E5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <TrendingUp className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No sales records in this time range.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Distribution (1 Col) */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Order Status</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Fulfillment lifecycle breakdown</p>
          </div>

          <div className="h-56 w-full my-auto">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : data?.orderStatusBreakdown?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.orderStatusBreakdown}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={4}
                  >
                    {data.orderStatusBreakdown.map((entry) => (
                      <Cell
                        key={`cell-${entry.status}`}
                        fill={STATUS_COLORS[entry.status.toLowerCase()] || '#94A3B8'}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                No order status data available.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs">
            {data?.orderStatusBreakdown?.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[item.status.toLowerCase()] || '#94A3B8' }}
                />
                <span className="capitalize text-gray-600 dark:text-gray-400">{item.status}:</span>
                <span className="font-bold text-gray-900 dark:text-white">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2: Top Selling Products & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top 5 Products Bar Chart */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Top 5 Best-Selling Products</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Ranked by units sold</p>
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : data?.topProducts?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.topProducts} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={120}
                    tickFormatter={(name) => (name.length > 18 ? `${name.substring(0, 18)}...` : name)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="unitsSold" name="Units Sold" fill="#6366F1" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Package className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No sales data yet for product ranking.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Inventory Breakdown */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Category Distribution</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Inventory catalog breakdown by department</p>
          </div>

          <div className="h-64 w-full">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                <RefreshCw className="w-6 h-6 animate-spin" />
              </div>
            ) : data?.categoryStats?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" name="Products" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                    {data.categoryStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Layers className="w-8 h-8 mb-2 opacity-40" />
                <p className="text-sm">No category distribution data.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Navigation */}
      <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
        Admin Controls & Management
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <motion.div
              key={action.label}
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 cursor-pointer hover:border-indigo-200 dark:hover:border-indigo-900/60 hover:shadow-md transition-all group"
              onClick={() => navigate(action.path)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300">
                  {action.badge}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {action.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{action.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;

