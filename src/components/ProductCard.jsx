import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Eye } from "lucide-react";
import { useCart } from "../context/useCart";
import { getImageUrl } from "../utils/imageUtils";

const ProductCard = memo(({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const productId = product.id || product._id;
  const rating = product.averageRating || 4.5;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full overflow-hidden relative"
    >
      {/* Product Image Area with Hover Zoom & Quick View Badge */}
      <div
        className="relative h-52 bg-slate-50/50 overflow-hidden cursor-pointer flex items-center justify-center p-3"
        onClick={() => navigate(`/product/${productId}`)}
      >
        <img
          src={getImageUrl(product.image)}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/product_placeholder.jpg";
          }}
        />

        {/* Rating Floating Pill */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center gap-1 border border-slate-100">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(rating).toFixed(1)}</span>
        </div>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${productId}`);
            }}
            className="bg-white/95 backdrop-blur-md text-slate-900 font-semibold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5 hover:bg-white hover:scale-105 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-amber-500" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <h3
            className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 cursor-pointer"
            onClick={() => navigate(`/product/${productId}`)}
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Price</span>
            <div className="text-lg font-black text-slate-900 tracking-tight">
              ₹{(product.basePrice || product.price || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <button
            onClick={() => addToCart({ ...product, id: productId, price: product.basePrice || product.price })}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs px-3.5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center gap-1.5 active:scale-95"
            title="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;
