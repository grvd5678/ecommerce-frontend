import { useCart } from '../context/useCart';
import { motion } from 'framer-motion';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  const product = item;
  const canIncrease = item.quantity < product.stock;

  return (
    <div className="flex items-center gap-4 bg-white/80 backdrop-blur-lg p-4 rounded-xl shadow-sm border border-slate-200/60">
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-lg bg-slate-50"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900">{item.name}</h3>
        <p className="text-sm text-slate-600">{item.category}</p>
        <p className="text-lg font-bold text-slate-900 mt-1">₹{item.price}</p>
        {item.quantity >= product.stock && (
          <p className="text-xs text-red-600 mt-1">Max stock reached</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        <motion.button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity === 1}
          className={`px-3 py-1 rounded-lg font-medium ${
            item.quantity === 1
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
          whileTap={{ scale: item.quantity === 1 ? 1 : 0.9 }}
        >
          -
        </motion.button>
        <span className="px-4 py-1 bg-slate-50 rounded-lg font-semibold text-slate-900">{item.quantity}</span>
        <motion.button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          disabled={!canIncrease}
          className={`px-3 py-1 rounded-lg font-medium ${
            canIncrease 
              ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          whileTap={{ scale: canIncrease ? 0.9 : 1 }}
        >
          +
        </motion.button>
      </div>
      <div className="text-right">
        <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toFixed(2)}</p>
        <motion.button
          onClick={() => removeFromCart(item.id)}
          className="text-red-600 text-sm hover:text-red-700 mt-2 font-medium"
          whileTap={{ scale: 0.95 }}
        >
          Remove
        </motion.button>
      </div>
    </div>
  );
};

export default CartItem;
