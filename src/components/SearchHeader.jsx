import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const SearchHeader = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length < 2) return setSuggestions([]);
    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/products?search=${query}&limit=5`);
        setSuggestions(data.products);
      } catch (error) {
        console.error('Search error:', error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="flex w-full items-center bg-[#131921] p-2 relative">
      <select className="bg-gray-200 p-2 rounded-l-md border-r h-full">
        <option>All</option>
      </select>
      <input 
        className="flex-grow p-2 outline-none h-full border-2 border-transparent focus:border-orange-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search ShopHub..."
      />
      <button className="bg-orange-400 p-2 rounded-r-md px-4 h-full text-white font-bold">🔍</button>
      
      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute top-full left-0 bg-white w-full border z-50 shadow-lg text-black">
          {suggestions.map(s => (
            <div 
              key={s._id} 
              className="p-3 hover:bg-gray-100 cursor-pointer border-b" 
              onClick={() => {
                setQuery('');
                setSuggestions([]);
                navigate(`/product/${s._id}`);
              }}
            >
              {s.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchHeader;
