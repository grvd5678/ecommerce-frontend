import { motion } from 'framer-motion';

const ReviewSummary = ({ reviews = [] }) => {
  const totalReviews = reviews.length;
  const ratingCounts = [5, 4, 3, 2, 1].map(star => 
    reviews.filter(r => Math.round(r.rating) === star).length
  );

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
      {ratingCounts.map((count, index) => {
        const star = 5 - index;
        const percentage = totalReviews ? (count / totalReviews) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-3 mb-2">
            <span className="text-sm font-medium w-8">{star} ★</span>
            <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                className="h-full bg-yellow-400"
              />
            </div>
            <span className="text-xs text-slate-500 w-12 text-right">{count}</span>
          </div>
        );
      })}
    </div>
  );
};

export default ReviewSummary;
