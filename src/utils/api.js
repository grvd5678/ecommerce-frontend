import axios from 'axios';
import { toast } from 'react-toastify';

// Force production URL
export const baseURL = 'https://ecommerce-api-tio6.onrender.com/api';

const api = axios.create({
  baseURL: baseURL
});

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log('API interceptor error:', error);
    const message = error.response?.data?.message || 'Something went wrong';
    toast.error(message);
    return Promise.reject(error);
  }
);

export default api;
