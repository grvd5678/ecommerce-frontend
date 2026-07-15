import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (query.length > 1) {
      const delayDebounceFn = setTimeout(() => {
        api.get(`/products?search=${query}&limit=5`)
          .then(({ data }) => {
            setSuggestions(data.products);
            setShowDropdown(true);
          })
          .catch(() => {
            setSuggestions([]);
            setShowDropdown(false);
          });
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/?search=${query}`);
      setShowDropdown(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <form onSubmit={handleSearch} className="flex">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search products..."
          className="w-full px-4 py-2 border border-slate-300 rounded-l-lg focus:outline-none"
        />
        <button type="submit" className="px-4 py-2 bg-yellow-500 text-slate-900 font-bold rounded-r-lg hover:bg-yellow-600">
          Search
        </button>
      </form>
      
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-slate-300 rounded-b-lg shadow-lg z-50">
          {suggestions.map(product => (
            <div 
              key={product._id} 
              className="flex items-center gap-3 p-2 hover:bg-slate-100 cursor-pointer text-sm"
              onClick={() => {
                navigate(`/product/${product._id}`);
                setShowDropdown(false);
                setQuery('');
              }}
            >
              <img src={product.image} alt={product.name} className="w-8 h-8 object-contain" />
              <span className="font-medium truncate">{product.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
