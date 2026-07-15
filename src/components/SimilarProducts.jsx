import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from './ProductCard';

const SimilarProducts = ({ productId }) => {
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/products/${productId}/similar`)
      .then(({ data }) => setSimilar(data))
      .catch(() => setSimilar([]))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading || similar.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {similar.map(product => (
          <ProductCard key={product._id} product={{ ...product, id: product._id }} />
        ))}
      </div>
    </div>
  );
};

export default SimilarProducts;
