import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AutocompleteSearch = ({ searchQuery, setSearchQuery }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const { data } = await api.get(`/products?search=${searchQuery}&limit=5`);
        setSuggestions(data.products);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
      }
    };

    const handler = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const handleSelect = (product) => {
    setSearchQuery(product.name);
    setShowSuggestions(false);
    navigate(`/product/${product._id}`);
  };

  return (
    <div className="relative" ref={searchRef}>
      <input
        type="text"
        className="w-full p-2 text-black rounded"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute bg-white text-black w-full mt-1 rounded shadow-lg z-50">
          {suggestions.map((p) => (
            <li
              key={p._id}
              className="p-2 hover:bg-slate-100 cursor-pointer"
              onClick={() => handleSelect(p)}
            >
              {p.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;
