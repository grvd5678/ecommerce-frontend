import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/useCart";
import { getImageUrl } from "../utils/imageUtils";

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  return (
    <motion.div className="bg-white border border-slate-200 p-3 flex flex-col h-full hover:shadow-md transition-shadow duration-200">
      <div
        className="block h-40 overflow-hidden mb-2 cursor-pointer"
        onClick={() => navigate(`/product/${product.id}`)}
      >
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/product_placeholder.jpg";
          }}
        />
      </div>
      <div className="grow">
        <h3
          className="text-xs text-slate-800 font-medium mb-1 truncate cursor-pointer hover:text-cyan-700"
          onClick={() => navigate(`/product/${product.id}`)}
        >
          {product.name}
        </h3>
        <p className="text-[10px] text-slate-500 mb-2 truncate">
          {product.description}
        </p>
        <div className="text-md font-bold text-slate-900 mb-2">
          ₹{product.basePrice}
        </div>
      </div>
      <button
        onClick={() => addToCart({ ...product, id: product._id })}
        className="w-full bg-yellow-400 hover:bg-yellow-500 text-slate-900 text-xs font-bold py-1.5 rounded-sm transition"
      >
        Add to Cart
      </button>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
