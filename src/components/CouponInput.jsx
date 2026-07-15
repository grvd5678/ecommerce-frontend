import { useState } from 'react';
import { applyCoupon } from '../utils/couponLogic';
import { motion } from 'framer-motion';

const LABELS = {
  haveCoupon: 'Have a coupon?',
  placeholder: 'Enter coupon code',
  apply: 'Apply',
  applied: '✓ Applied',
  hint: 'Try: SAVE10, SAVE20, FLAT50',
};

const CouponInput = ({ total, onApplyCoupon }) => {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState('');
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    const result = applyCoupon(code, total);
    setMessage(result.message);
    if (result.valid) {
      onApplyCoupon(result.discount);
      setApplied(true);
    }
  };

  return (
    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
      <label className="block text-sm font-medium text-slate-700 mb-2">{LABELS.haveCoupon}</label>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={LABELS.placeholder}
          disabled={applied}
          className="flex-1 p-2 border border-slate-200 rounded-lg disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-500 focus:ring-2 focus:ring-slate-900 focus:border-transparent"
        />
        <motion.button
          onClick={handleApply}
          disabled={applied || !code}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            applied 
              ? 'bg-emerald-600 text-white cursor-not-allowed' 
              : code
              ? 'bg-slate-900 text-white hover:bg-slate-800'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
          whileTap={{ scale: (applied || !code) ? 1 : 0.95 }}
        >
          {applied ? LABELS.applied : LABELS.apply}
        </motion.button>
      </div>
      {message && (
        <motion.p 
          className={`text-sm mt-2 ${message.includes('Invalid') || message.includes('Minimum') ? 'text-red-600' : 'text-emerald-600'}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.p>
      )}
      {!applied && <p className="text-xs text-slate-500 mt-2">{LABELS.hint}</p>}
    </div>
  );
};

export default CouponInput;
