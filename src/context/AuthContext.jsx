import { createContext, useState, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();
// Hardcode the production URL to ensure Auth requests work
const API = 'https://ecommerce-api-tio6.onrender.com/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading] = useState(false);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const register = async (name, email, password) => {
    const { data } = await axios.post(`${API}/auth/register`, { name, email, password });
    return data;
  };

  const verifyOTP = async (email, otp) => {
    const { data } = await axios.post(`${API}/auth/verify-otp`, { email, otp });
    setUser(data);
    localStorage.setItem('user', JSON.stringify(data));
    return data;
  };

  const resendOTP = async (email) => {
    const { data } = await axios.post(`${API}/auth/resend-otp`, { email });
    return data;
  };

  const forgotPassword = async (email) => {
    const { data } = await axios.post(`${API}/auth/forgot-password`, { email });
    return data;
  };

  const resetPassword = async (email, otp, newPassword) => {
    const { data } = await axios.post(`${API}/auth/reset-password`, { email, otp, newPassword });
    return data;
  };

  const changePassword = async (currentPassword, newPassword) => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    const { data } = await axios.put(`${API}/auth/change-password`, { currentPassword, newPassword }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, verifyOTP, resendOTP, forgotPassword, resetPassword, changePassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export { AuthContext };
