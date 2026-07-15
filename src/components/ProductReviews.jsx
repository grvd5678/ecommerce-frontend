import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import StarRating from './StarRating';
import api from '../utils/api';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '', images: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await api.get(`/reviews/${productId}`);
        setReviews(data);
      } catch {
        setError('Failed to load reviews.');
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetchReviews();
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post(`/reviews/${productId}`, newReview);
      setReviews([data, ...reviews]);
      setNewReview({ rating: 5, comment: '', images: [] });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  const handleToggleHelpful = async (reviewId) => {
    try {
      const { data } = await api.put(`/reviews/${reviewId}/helpful`);
      setReviews(prev => prev.map(r => r._id === reviewId ? { ...r, helpfulCount: data.helpfulCount } : r));
    } catch (err) {
      console.error('Failed to toggle helpful status:', err);
    }
  };

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4 text-slate-900">Customer Reviews</h3>

      <form onSubmit={handleSubmit} className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        {/* ... (form fields) */}
        <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
            rows="3"
            placeholder="Write your review..."
            required
        />
        <button type="submit" className="mt-4 bg-slate-900 text-white px-6 py-2 rounded-full">Submit Review</button>
      </form>

      {loading ? (
        <p className="text-gray-500">Loading reviews...</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="p-4 border rounded-lg bg-white">
              <div className="flex justify-between">
                <p className="font-semibold">{review.user?.name}</p>
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-2 text-gray-700">{review.comment}</p>
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {review.images.map((img, i) => <img key={i} src={img} alt="review" className="w-16 h-16 rounded object-cover" />)}
                </div>
              )}
              <button 
                onClick={() => handleToggleHelpful(review._id)}
                className="mt-2 text-sm text-blue-600 hover:underline"
              >
                Helpful ({review.helpfulCount})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductReviews;
