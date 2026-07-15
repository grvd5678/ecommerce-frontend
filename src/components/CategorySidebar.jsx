import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';

const CategorySidebar = () => {
  const [counts, setCounts] = useState([]);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { data } = await api.get('/products/categories/counts');
        setCounts(data);
      } catch (error) {
        console.error('Failed to fetch category counts:', error);
      }
    };
    fetchCounts();
  }, []);

  return (
    <aside className="w-64 p-4 bg-white shadow-sm border-r h-full">
      <h3 className="font-bold mb-4 text-lg">Shop by Category</h3>
      <div className="space-y-2">
        {counts.map(cat => {
          const catInfo = cat.catInfo[0];
          if (!catInfo) return null;
          
          // Need to fetch parent name, for now we will just use the name for simplicity, 
          // but true hierarchical routing requires parent name.
          return (
            <Link 
              key={cat._id} 
              to={`/category/${catInfo.name.toLowerCase()}`}
              className="flex justify-between py-2 px-2 hover:bg-gray-100 rounded"
            >
              <span>{catInfo.name}</span>
              <span className="bg-gray-200 text-xs px-2 py-1 rounded-full">{cat.count}</span>
            </Link>
          )
        })}
      </div>
    </aside>
  );
};

export default CategorySidebar;
