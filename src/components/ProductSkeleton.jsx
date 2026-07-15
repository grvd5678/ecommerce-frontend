import { motion } from 'framer-motion';

const ProductSkeleton = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm overflow-hidden flex flex-col h-full">
      <motion.div 
        className="h-56 bg-slate-200"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <div className="p-4 flex-1 flex flex-col">
        <motion.div 
          className="h-6 bg-slate-200 rounded mb-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.1 }}
        />
        <motion.div 
          className="h-4 bg-slate-200 rounded w-3/4 mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
        />
        <motion.div 
          className="h-8 bg-slate-200 rounded w-1/2 mt-auto"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
        />
      </div>
      <motion.div 
        className="h-12 bg-slate-200 m-4 rounded-xl"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
      />
    </div>
  );
};

export default ProductSkeleton;
