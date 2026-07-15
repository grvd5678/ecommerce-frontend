import { useCart } from '../context/useCart';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  
  const cartItem = cart.find(item => item.id === product.id);
  const inStock = !cartItem || cartItem.quantity < product.stock;

  return (
    <motion.div 
      className="bg-linear-to-br from-slate-100 to-slate-50 p-px rounded-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col h-full transition-all duration-300 border border-slate-200/50">
        <div className="h-56 overflow-hidden relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          {product.stock < 5 && (
            <span className="absolute top-2 right-2 bg-slate-900 text-white text-xs px-3 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1">
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-lg font-semibold text-slate-900">{product.name}</h3>
            <p className="text-sm text-slate-600 mt-1 h-10 line-clamp-2">{product.description}</p>
            <div className="flex items-center mt-2">
              <span className="text-amber-500">★</span>
              <span className="text-sm text-slate-600 ml-1">{product.rating}</span>
              <span className="text-xs text-slate-500 ml-2">({product.category})</span>
            </div>
            <div className="mt-auto pt-4">
              <span className="text-3xl font-bold text-slate-900">₹{product.price}</span>
            </div>
          </div>
          <motion.button
            onClick={() => addToCart({ ...product, id: product._id })}
            disabled={!inStock}
            className={`w-full px-4 py-3 rounded-xl transition-all duration-300 whitespace-nowrap font-medium ${
              inStock 
                ? 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            whileTap={{ scale: inStock ? 0.98 : 1 }}
          >
            {inStock ? 'Add to Cart' : 'Out of Stock'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
