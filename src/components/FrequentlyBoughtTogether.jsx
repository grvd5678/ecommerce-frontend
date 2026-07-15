import { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductCard from './ProductCard';

const FrequentlyBoughtTogether = ({ productId }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get(`/engagement/recommendations/${productId}`)
      .then(({ data }) => setProducts(data))
      .catch(() => setProducts([]));
  }, [productId]);

  if (products.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p._id} product={{ ...p, id: p._id }} />)}
      </div>
    </div>
  );
};

export default FrequentlyBoughtTogether;
