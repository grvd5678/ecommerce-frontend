import { useParams, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import CategorySidebar from '../components/CategorySidebar';

const ProductListingPage = () => {
  const { category, subcategory } = useParams();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams(location.search);
        const searchQuery = queryParams.get('search');
        
        let url = '/products?';
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        if (category) url += `category=${encodeURIComponent(category)}&`;
        if (subcategory) url += `subcategory=${encodeURIComponent(subcategory)}&`;
        
        console.log('Fetching from URL:', url);
        const { data } = await api.get(url);
        console.log('Received data:', data);
        setProducts(data.products);
      } catch (error) {
        console.error('Failed to fetch filtered products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [category, subcategory, location.search]);

  return (
    <div className="container mx-auto px-4 py-8 flex">
      <CategorySidebar />
      <div className="flex-grow ml-6">
        <h1 className="text-2xl font-bold mb-6 capitalize">{subcategory || category || 'Products'}</h1>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <ProductSkeleton key={i} />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(p => <ProductCard key={p._id} product={{...p, id: p._id}} />)}
          </div>
        ) : (
          <p>No products found in this category.</p>
        )}
      </div>
    </div>
  );
};

export default ProductListingPage;
