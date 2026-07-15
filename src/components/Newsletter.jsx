import { useState } from 'react';
import { motion } from 'framer-motion';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <div className="bg-[#232F3E] text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2 text-[#FEBD69]">Subscribe to Our Newsletter</h2>
        <p className="mb-6 text-gray-300">Get the latest deals and updates!</p>
        
        {subscribed ? (
          <motion.p
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-xl font-semibold text-[#FF9900]"
          >
            ✅ Thanks for subscribing!
          </motion.p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded text-[#131921] focus:outline-none focus:ring-2 focus:ring-[#FF9900]"
              required
            />
            <button
              type="submit"
              className="bg-[#FF9900] hover:bg-[#e88a00] text-[#131921] px-6 py-2 rounded font-semibold transition"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Newsletter;
