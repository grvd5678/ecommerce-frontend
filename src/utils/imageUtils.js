import { baseURL } from './api';

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/product_placeholder.jpg";
  
  // If it's already an absolute URL (starts with http), return it
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  // Otherwise, assume it's a relative path from the backend
  // Ensure we don't have double slashes
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${baseURL}${cleanPath}`;
};
