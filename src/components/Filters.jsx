import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../utils/api';

const Filters = ({ filters, setFilters, sortBy, setSortBy }) => {
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get('/products/categories');
        
        // Flatten hierarchy to simple list of names for the filter
        const flatCategories = [];
        data.forEach(parent => {
          flatCategories.push(parent.name);
          parent.subcategories.forEach(sub => flatCategories.push(sub.name));
        });
        
        setCategories(['All', ...flatCategories]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <motion.div 
      className="bg-white p-2 rounded shadow-sm border border-slate-200 mb-4 flex flex-wrap gap-2 items-center text-sm"
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="font-bold text-slate-900 mx-2">Filters:</h2>
      
      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
        className="p-1 border border-slate-300 rounded bg-white"
      >
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <div className="flex gap-1 items-center">
        <input
          type="number"
          placeholder="Min"
          value={filters.minPrice}
          onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          className="w-16 p-1 border border-slate-300 rounded"
        />
        <span>-</span>
        <input
          type="number"
          placeholder="Max"
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          className="w-16 p-1 border border-slate-300 rounded"
        />
      </div>

      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="p-1 border border-slate-300 rounded bg-white"
      >
        <option value="">Sort By</option>
        <option value="price-low">Price: Low to High</option>
        <option value="price-high">Price: High to Low</option>
        <option value="rating">Rating</option>
      </select>

      <button
        onClick={() => setFilters({ category: 'All', minPrice: '', maxPrice: '', minRating: '' })}
        className="text-cyan-700 hover:underline ml-auto mr-2"
      >
        Clear
      </button>
    </motion.div>
  );
};

export default Filters;
