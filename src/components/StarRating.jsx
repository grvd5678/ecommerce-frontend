const StarRating = ({ rating, size = 'text-base' }) => {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);

  return (
    <div className={`flex gap-1 ${size}`}>
      {stars.map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-slate-300'}>
          ⭐
        </span>
      ))}
    </div>
  );
};

export default StarRating;
