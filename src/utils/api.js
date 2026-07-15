import axios from 'axios';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000') + '/api'
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
