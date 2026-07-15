import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import Filters from '../components/Filters';
import api from '../utils/api';
import AmazonGrid from '../components/homepage/AmazonGrid';
import HeroSlider from '../components/homepage/HeroSlider';

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3 }
};

const Home = ({ searchQuery }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: 'All', minPrice: '', maxPrice: '', minRating: '' });
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  
  const productSectionRef = useRef(null);

  const scrollToProducts = () => {
    productSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCategorySelect = (cat) => {
    setFilters(prev => ({ ...prev, category: cat }));
    scrollToProducts();
  };

  const fetchProducts = async (pageToFetch = 1, append = false) => {
    if (pageToFetch === 1) setLoading(true);
    try {
      const params = { page: pageToFetch, limit: 18 };
      if (searchQuery) params.search = searchQuery;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      if (sortBy) params.sort = sortBy;

      const { data } = await api.get('/products', { params });
      
      setProducts(prev => append ? [...prev, ...data.products] : data.products);
      setHasMore(data.pagination.hasNext);
      setPage(data.pagination.currentPage);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    const debounce = setTimeout(() => fetchProducts(1, false), 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, filters, sortBy]);

  const sampleGridData = [
    { title: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03', link: '/products?category=Electronics' },
    { title: 'Fashion', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b', link: '/products?category=Fashion' },
    { title: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a', link: '/products?category=Home & Kitchen' },
    { title: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80', link: '/products?category=Sports' },
    { title: 'Accessories', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62', link: '/products?category=Accessories' },
  ];

  const heroSlides = [
    { title: 'Starting ₹99', subtitle: 'Bestselling mobile accessories', image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd' },
    { title: 'Deals on Fashion', subtitle: 'Up to 50% off on trends', image: 'https://images.unsplash.com/photo-1445205170430-ef55475f4d89' },
  ];

  // Helper to ensure 4 cards for grid
  const getGridCards = (mainIdx) => {
    return [sampleGridData[mainIdx], sampleGridData[mainIdx], sampleGridData[mainIdx], sampleGridData[mainIdx]];
  };

  return (
    <motion.div {...pageTransition}>
      <div className="container mx-auto px-4 py-4">
        {/* Amazon-style Hero Slider */}
        <div className="mb-8">
          <HeroSlider slides={heroSlides} />
        </div>
        
        {/* Grid Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <AmazonGrid title="Shop by Category" cards={sampleGridData} onCategorySelect={handleCategorySelect} />
          <AmazonGrid title="Electronics" cards={getGridCards(0)} onCategorySelect={handleCategorySelect} category="Electronics" />
          <AmazonGrid title="Fashion Trends" cards={getGridCards(1)} onCategorySelect={handleCategorySelect} category="Fashion" />
          <AmazonGrid title="Home & Kitchen & Sports" cards={[sampleGridData[2], sampleGridData[3], sampleGridData[2], sampleGridData[3]]} onCategorySelect={handleCategorySelect} />
        </div>

        {/* Original Product View */}
        <div ref={productSectionRef}>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">All Products</h2>
          
          <Filters filters={filters} setFilters={setFilters} sortBy={sortBy} setSortBy={setSortBy} />
        </div>

        <div className="lg:col-span-3">
          {!loading && (
            <motion.p className="text-slate-600 mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Showing {products.length} products
            </motion.p>
          )}
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            {loading ? (
              Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (
              products.map((product) => (
                <ProductCard key={product._id} product={{ ...product, id: product._id }} />
              ))
            )}
          </motion.div>
          
          {hasMore && (
            <div className="text-center mt-8">
              <button 
                onClick={() => fetchProducts(page + 1, true)}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition"
              >
                Load More
              </button>
            </div>
          )}
          
          {!loading && products.length === 0 && (
            <motion.div className="text-center py-16" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-slate-400 text-xl mb-2">😕 No products found</p>
              <p className="text-slate-500">Try adjusting your filters</p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Home;
