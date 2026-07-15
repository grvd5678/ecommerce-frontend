import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WishlistProvider, useWishlist } from './context/WishlistContext';
import { ThemeProvider } from './context/ThemeContext';
import { useCart } from './context/useCart';
import api from './utils/api';
import ErrorBoundary from './components/ErrorBoundary';
import SearchHeader from './components/SearchHeader';
import DarkModeToggle from './components/DarkModeToggle';
import Newsletter from './components/Newsletter';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import ProductListingPage from './pages/ProductListingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import AdminUsers from './pages/AdminUsers';

const Navbar = ({ searchQuery, setSearchQuery }) => {
  const { getCartCount } = useCart();
  const { user, logout } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <header className="bg-[#131921] text-white">
      {/* Top Bar: Logo, Search, Navigation */}
      <div className="flex items-center gap-4 px-4 py-2 justify-between">
        <Link to="/" className="text-2xl font-extrabold tracking-tight italic text-white border border-transparent hover:border-white p-1">ShopHub</Link>
        <div className="flex-grow mx-4">
            <SearchHeader />
        </div>
        <div className="flex items-center gap-4 text-sm shrink-0">
            <Link to="/profile" className="hover:border-white border border-transparent p-1">Hello, {user ? user.name : 'Sign in'}</Link>
            <Link to="/orders" className="hover:border-white border border-transparent p-1">Orders</Link>
            <Link to="/cart" className="hover:border-white border border-transparent p-1 text-lg font-bold">🛒 Cart ({getCartCount})</Link>
        </div>
      </div>
      {/* Category Bar */}
      <div className="bg-[#232f3e] text-white text-sm flex gap-6 px-4 py-2">
        {categories.map(cat => (
          <div key={cat._id} className="relative group">
            <Link to={`/category/${encodeURIComponent(cat.name)}`} className="hover:border-white border border-transparent p-1">
              {cat.name}
            </Link>
            {cat.subcategories && cat.subcategories.length > 0 && (
              <div className="absolute left-0 top-full bg-white text-slate-800 p-2 shadow-lg hidden group-hover:block w-40 z-50">
                {cat.subcategories.map(sub => (
                  <Link key={sub._id} to={`/category/${encodeURIComponent(cat.name)}/${encodeURIComponent(sub.name)}`} className="block p-1 hover:bg-slate-100">
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
};

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user?.role === 'admin' ? children : <Navigate to="/" />;
}

function AppContent({ searchQuery, setSearchQuery }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/category/:category" element={<ProductListingPage />} />
          <Route path="/category/:category/:subcategory" element={<ProductListingPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistory /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
        </Routes>
      </AnimatePresence>
      <Newsletter />
      <Chatbot />
    </div>
  );
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <AppContent searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
