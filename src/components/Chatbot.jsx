import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: 'bot', text: 'Hi! How can I help you with our products today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { message: input });
      setMessages(prev => [...prev, { role: 'bot', text: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I am having trouble connecting right now.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 bg-slate-900 text-white p-4 rounded-full shadow-lg z-50 text-2xl"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '💬'}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            <div className="bg-slate-900 text-white p-4 font-bold">Chat Assistant</div>
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={`p-3 rounded-lg ${m.role === 'user' ? 'bg-slate-200 self-end ml-auto' : 'bg-slate-100'}`}>
                  {m.text}
                </div>
              ))}
              {loading && <div className="text-sm text-slate-500">Typing...</div>}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-4 border-t">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-2 border rounded-lg"
                placeholder="Ask something..."
              />
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
