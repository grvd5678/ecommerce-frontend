import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { Sparkles, Plus, Edit2, Trash2, Package, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const emptyForm = { name: '', description: '', price: '', category: 'Electronics', image: '', stock: '' };

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (user?.role !== 'admin') return;

    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          api.get('/products?limit=100'),
          api.get('/products/categories')
        ]);
        setProducts(productsRes.data.products || []);
        setCategories(categoriesRes.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleGenerateAIDescription = async () => {
    if (!formData.name.trim()) {
      toast.info('Please enter a product name first.');
      return;
    }
    setGeneratingAI(true);
    try {
      const res = await api.post('/products/generate-description', {
        name: formData.name,
        category: formData.category
      });
      if (res.data?.description) {
        setFormData((prev) => ({ ...prev, description: res.data.description }));
        toast.success('✨ AI Description generated!');
      }
    } catch (err) {
      console.error('AI Description error:', err);
      toast.error('Failed to generate description with AI');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      if (editingProduct) {
        const { data } = await api.put(`/products/${editingProduct._id}`, payload);
        setProducts(products.map((p) => (p._id === editingProduct._id ? data : p)));
        toast.success('Product updated successfully!');
      } else {
        const { data } = await api.post('/products', payload);
        setProducts([...products, data]);
        toast.success('Product added successfully!');
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save product:', error);
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      stock: product.stock.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingProduct(null);
    setShowModal(false);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      </div>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package className="w-8 h-8 text-indigo-600" />
            Product Management
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Create, update, and manage your e-commerce catalog with AI copy generation.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData(emptyForm);
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl font-medium shadow-sm transition-all text-sm"
        >
          <Plus className="w-4 h-4" /> Add New Product
        </button>
      </div>

      {/* Search and Filters bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-gray-900 dark:text-white"
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
          Showing {filteredProducts.length} of {products.length} products
        </span>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-800">
              <thead className="bg-gray-50 dark:bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-800">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          className="h-12 w-12 rounded-xl object-cover border border-gray-100 dark:border-slate-800 bg-gray-50"
                          src={product.image}
                          alt=""
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200';
                          }}
                        />
                        <div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-1">
                            {product.name}
                          </div>
                          <p className="text-xs text-gray-400 line-clamp-1 max-w-sm">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      ₹{product.price?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          product.stock > 5
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400'
                            : product.stock > 0
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400'
                            : 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400'
                        }`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="p-1.5 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-colors"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Delete Product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal for Add / Edit Product with AI Description Generator */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-gray-100 dark:border-slate-800 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-slate-800 mb-5">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-indigo-600" />
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Product Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Wireless Noise-Canceling Over-Ear Headphones"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Category & Price */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    >
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="e.g. 2999"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Stock & Image URL */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 25"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>
                </div>

                {/* Description with AI Generator */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                      Product Description *
                    </label>
                    <button
                      type="button"
                      onClick={handleGenerateAIDescription}
                      disabled={generatingAI || !formData.name}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-800/60 disabled:opacity-40 transition-all shadow-sm"
                    >
                      {generatingAI ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                          <span>Generating copy...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                          <span>✨ Generate with AI</span>
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows="4"
                    placeholder="Enter product description or click '✨ Generate with AI'..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-sm bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>

                {/* Modal Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm disabled:opacity-50 transition-all"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {saving ? 'Saving...' : editingProduct ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;

