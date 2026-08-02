import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import ReviewSummary from '../components/ReviewSummary';
import api from '../utils/api';
import { getImageUrl } from '../utils/imageUtils';
import { useCart } from '../context/useCart';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get(`/products/${id}`);
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found or error occurred.</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <motion.div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden">
            <img 
              src={getImageUrl(product.image)} 
              alt={product.name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/product_placeholder.jpg";
              }}
            />
          </motion.div>
        </div>

        {/* Right: Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-slate-900">{product.name}</h1>
          <p className="text-2xl font-semibold text-slate-900">₹{product.basePrice}</p>
          <p className="text-slate-600">{product.description}</p>
          
          <button 
            onClick={() => addToCart({ ...product, id: product._id })}
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700"
          >
            Add to Cart
          </button>
        </div>
      </div>

      <ReviewSummary reviews={product.reviews || []} />
    </div>
  );
};

export default ProductDetails;
