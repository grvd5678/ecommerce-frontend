import { useEffect } from 'react';
import { motion } from 'framer-motion';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <motion.div 
      className="fixed top-20 right-4 bg-slate-900 text-white px-6 py-3 rounded-xl shadow-lg z-50 border border-slate-700"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <div className="flex items-center gap-2">
        <motion.span 
          className="text-xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
        >
          ✓
        </motion.span>
        <span className="font-medium">{message}</span>
      </div>
    </motion.div>
  );
};

export default Toast;
