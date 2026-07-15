export const filterProducts = (products, filters) => {
  let filtered = [...products];

  // Filter by category
  if (filters.category && filters.category !== 'All') {
    filtered = filtered.filter(p => p.category === filters.category);
  }

  // Filter by price range
  if (filters.minPrice) {
    filtered = filtered.filter(p => p.price >= filters.minPrice);
  }
  if (filters.maxPrice) {
    filtered = filtered.filter(p => p.price <= filters.maxPrice);
  }

  // Filter by rating
  if (filters.minRating) {
    filtered = filtered.filter(p => p.rating >= filters.minRating);
  }

  return filtered;
};

export const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price-low':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-high':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
};
