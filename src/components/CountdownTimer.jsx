import { useState, useEffect } from 'react';

const CountdownTimer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(new Date(endTime) - new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(new Date(endTime) - new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  if (timeLeft <= 0) return <span>Sale Ended</span>;

  const hours = Math.floor(timeLeft / (1000 * 60 * 60));
  const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
  const seconds = Math.floor((timeLeft / 1000) % 60);

  return (
    <span className="font-mono bg-red-100 text-red-800 px-2 py-1 rounded">
      {hours}h {minutes}m {seconds}s
    </span>
  );
};

export default CountdownTimer;
