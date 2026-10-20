import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, MicOff, Search, Loader2 } from 'lucide-react';
import api from '../utils/api';
import useVoiceCommand from '../hooks/useVoiceCommand';

const SearchHeader = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [category, setCategory] = useState('All');
  const [voiceNotice, setVoiceNotice] = useState('');
  const navigate = useNavigate();

  // Voice Command Intent Handler
  const handleVoiceCommand = useCallback((phrase) => {
    if (!phrase || !phrase.trim()) return;

    const lower = phrase.toLowerCase().trim();
    setQuery(phrase);

    // Intent 1: Direct Page Navigation
    if (lower.includes('go to cart') || lower.includes('open cart') || lower.includes('view cart')) {
      speak('Opening your cart');
      navigate('/cart');
      return;
    }
    if (lower.includes('go to profile') || lower.includes('open profile') || lower.includes('my account')) {
      speak('Opening your profile');
      navigate('/profile');
      return;
    }
    if (lower.includes('order history') || lower.includes('my orders') || lower.includes('track order')) {
      speak('Opening your orders');
      navigate('/orders');
      return;
    }
    if (lower.includes('go home') || lower.includes('open home') || lower === 'home') {
      speak('Going to home page');
      navigate('/');
      return;
    }
    if (lower.includes('admin') || lower.includes('dashboard')) {
      speak('Opening Admin Dashboard');
      navigate('/admin');
      return;
    }

    // Intent 2: Category Filter Voice Command
    // e.g. "show electronics", "find headphones", "search for shoes"
    let cleanSearch = phrase
      .replace(/^(show me|search for|find me|look for|search|show|get me)\s+/i, '')
      .trim();

    setVoiceNotice(`Searching for "${cleanSearch}"...`);
    speak(`Searching for ${cleanSearch}`);

    setTimeout(() => {
      setVoiceNotice('');
      navigate(`/?search=${encodeURIComponent(cleanSearch)}`);
    }, 600);
  }, [navigate]);

  const { isListening, isSupported, toggleListening, speak, transcript } = useVoiceCommand({
    onCommand: handleVoiceCommand,
  });

  useEffect(() => {
    if (transcript && isListening) {
      setQuery(transcript);
    }
  }, [transcript, isListening]);

  // Live autocomplete search
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?search=${encodeURIComponent(query)}&limit=5`);
        setSuggestions(data.products || []);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const executeSearch = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    setSuggestions([]);
    navigate(`/?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="flex w-full items-center bg-[#131921] p-2 relative">
      {/* Category Dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="bg-gray-200 text-slate-800 text-sm font-medium px-3 py-2 rounded-l-md border-r border-gray-300 h-10 outline-none hover:bg-gray-300 transition-colors cursor-pointer hidden sm:block"
      >
        <option>All</option>
        <option>Electronics</option>
        <option>Fashion</option>
        <option>Home</option>
        <option>Sports</option>
        <option>Accessories</option>
      </select>

      {/* Search Input Box */}
      <form onSubmit={executeSearch} className="flex flex-grow relative items-center h-10">
        <input
          className={`w-full h-full px-3 text-slate-900 outline-none text-sm border-2 transition-all ${
            isListening
              ? 'border-red-500 bg-red-50/20 placeholder-red-400 animate-pulse'
              : 'border-transparent focus:border-amber-400'
          } rounded-l-md sm:rounded-l-none`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            isListening
              ? '🎙️ Listening... (Say: "Show laptops" or "Go to cart")'
              : 'Search ShopHub or speak a voice command...'
          }
        />

        {/* Microphone Voice Button */}
        {isSupported && (
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Click to stop listening' : 'Click to speak (Voice Commerce)'}
            className={`absolute right-2 p-1.5 rounded-full transition-all flex items-center justify-center ${
              isListening
                ? 'bg-red-500 text-white animate-bounce shadow-md'
                : 'text-slate-500 hover:text-amber-500 hover:bg-slate-100'
            }`}
          >
            {isListening ? <Mic className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
          </button>
        )}
      </form>

      {/* Search Submit Button */}
      <button
        onClick={executeSearch}
        className="bg-amber-500 hover:bg-amber-600 px-5 h-10 rounded-r-md text-slate-900 flex items-center justify-center transition-colors shadow-sm"
        title="Search"
      >
        <Search className="w-5 h-5 font-bold" />
      </button>

      {/* Voice Visual Feedback Notice */}
      {voiceNotice && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-400 px-4 py-1.5 rounded-full shadow-2xl text-xs font-semibold z-50 flex items-center gap-2 border border-amber-500/30 animate-fade-in">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* Autocomplete Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-slate-200 rounded-b-md z-50 shadow-2xl text-black overflow-hidden max-h-80 overflow-y-auto">
          {suggestions.map((s) => (
            <div
              key={s._id}
              className="flex items-center gap-3 p-3 hover:bg-amber-50 cursor-pointer border-b border-slate-100 transition-colors"
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                navigate(`/product/${s._id}`);
              }}
            >
              {s.image && (
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-10 h-10 object-contain rounded bg-slate-50 p-1 border"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm truncate">{s.name}</p>
                <p className="text-xs text-amber-600 font-bold">${s.price}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHeader;
