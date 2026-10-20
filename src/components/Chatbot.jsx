import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Send, Volume2, Bot, X } from 'lucide-react';
import api from '../utils/api';
import useVoiceCommand from '../hooks/useVoiceCommand';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! I am your AI Shopping Assistant. You can chat with me or click the 🎙️ mic button to speak hands-free!',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const sendQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;

    const userMessage = { role: 'user', text: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat', { message: queryText });
      const botReply = data.response || "I couldn't find an answer to that.";
      setMessages((prev) => [...prev, { role: 'bot', text: botReply }]);

      // Voice output response
      if (autoSpeak && speak) {
        speak(botReply);
      }
    } catch (error) {
      const errText = 'Sorry, I am having trouble connecting right now.';
      setMessages((prev) => [...prev, { role: 'bot', text: errText }]);
      if (autoSpeak && speak) speak(errText);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCommand = useCallback((phrase) => {
    if (phrase && phrase.trim()) {
      sendQuery(phrase);
    }
  }, [autoSpeak]);

  const { isListening, isSupported, toggleListening, speak, transcript } = useVoiceCommand({
    onCommand: handleVoiceCommand,
  });

  useEffect(() => {
    if (transcript && isListening) {
      setInput(transcript);
    }
  }, [transcript, isListening]);

  const handleSend = (e) => {
    e.preventDefault();
    sendQuery(input);
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 bg-slate-900 text-amber-400 p-4 rounded-full shadow-2xl z-50 text-2xl flex items-center justify-center border-2 border-amber-400/40 hover:bg-slate-800 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        title="AI Shopping Assistant"
      >
        {isOpen ? <X className="w-6 h-6 text-white" /> : <Bot className="w-6 h-6" />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden flex flex-col h-[520px]"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            {/* Header */}
            <div className="bg-slate-900 text-white p-4 font-bold flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <span>ShopHub AI Assistant</span>
              </div>
              <button
                type="button"
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={`p-1.5 rounded-full transition-colors ${
                  autoSpeak ? 'text-amber-400 bg-slate-800' : 'text-slate-500'
                }`}
                title={autoSpeak ? 'Voice response enabled' : 'Voice response muted'}
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50 text-sm">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-amber-500 text-slate-950 font-medium ml-auto rounded-tr-none shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none shadow-sm'
                  }`}
                >
                  {m.text}
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2 text-xs text-slate-500 p-2 bg-white rounded-xl w-fit border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Thinking with Gemini AI...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form with Voice Button */}
            <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className={`flex-1 p-2.5 text-sm border rounded-xl outline-none transition-all ${
                  isListening
                    ? 'border-red-500 bg-red-50/30 placeholder-red-400 animate-pulse'
                    : 'border-slate-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500'
                }`}
                placeholder={isListening ? '🎙️ Listening to your voice...' : 'Ask about products, orders...'}
              />

              {isSupported && (
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`p-2.5 rounded-xl transition-all ${
                    isListening
                      ? 'bg-red-500 text-white animate-bounce shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700'
                  }`}
                  title={isListening ? 'Stop listening' : 'Speak to AI'}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>
              )}

              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-slate-950 p-2.5 rounded-xl font-bold transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;
