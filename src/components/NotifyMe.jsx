import { useState } from 'react';
import api from '../utils/api';

const NotifyMe = ({ productId }) => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/engagement/notify/${productId}`, { email });
      setStatus('Subscribed successfully!');
    } catch {
      setStatus('Failed to subscribe.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border rounded-lg bg-yellow-50">
      <p className="font-semibold text-yellow-800 mb-2">Get notified when back in stock</p>
      <input 
        type="email" value={email} onChange={e => setEmail(e.target.value)} 
        placeholder="Enter your email" required className="p-2 border rounded w-full mb-2"
      />
      <button type="submit" className="bg-yellow-600 text-white px-4 py-2 rounded">Notify Me</button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </form>
  );
};

export default NotifyMe;
