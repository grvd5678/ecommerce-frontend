import { motion } from 'framer-motion';
import { useWishlist } from '../context/WishlistContext';

const WishlistButton = ({ product }) => {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  const handleClick = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`text-2xl ${inWishlist ? 'text-red-500' : 'text-slate-300'}`}
    >
      {inWishlist ? '❤️' : '🤍'}
    </motion.button>
  );
};

export default WishlistButton;
