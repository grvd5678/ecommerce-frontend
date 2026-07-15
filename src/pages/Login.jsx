import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [step, setStep] = useState('login'); // login | forgot | otp | reset
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState('');
  const [timer, setTimer] = useState(0);

  const { login, forgotPassword, resetPassword } = useAuth();
  const navigate = useNavigate();

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startTimer = () => {
    setTimer(120);
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  // Step 1: Login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return setError('All fields are required');
    setLoading(true); setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Send OTP for forgot password
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!email) return setError('Please enter your email');
    setLoading(true); setError('');
    try {
      await forgotPassword(email);
      setMessage('OTP sent to your email');
      setStep('otp');
      startTimer();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter OTP');
    if (!newPassword || !confirmPassword) return setError('Please fill all fields');
    if (newPassword !== confirmPassword) return setError('Passwords do not match');
    if (newPassword.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      await resetPassword(email, otp, newPassword);
      setMessage('Password reset successful! Please login.');
      setStep('login');
      setOtp(''); setNewPassword(''); setConfirmPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        {/* LOGIN STEP */}
        {step === 'login' && (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Login</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Email</label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-2">Password</label>
                <input
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="••••••"
                />
              </div>
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setStep('forgot'); setError(''); setMessage(''); }}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>
            <p className="mt-4 text-center text-slate-600">
              Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
            </p>
          </>
        )}

        {/* FORGOT PASSWORD - ENTER EMAIL */}
        {step === 'forgot' && (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Forgot Password</h2>
            <p className="text-slate-500 mb-6 text-sm">Enter your email to receive an OTP</p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Email</label>
                <input
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="your@email.com"
                />
              </div>
              <button
                type="submit" disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>
            </form>
            <button onClick={() => { setStep('login'); setError(''); }} className="mt-4 w-full text-slate-500 text-sm hover:underline">
              ← Back to Login
            </button>
          </>
        )}

        {/* OTP + NEW PASSWORD */}
        {step === 'otp' && (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Reset Password</h2>
            <p className="text-slate-500 mb-6 text-sm">OTP sent to <strong>{email}</strong></p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {message && <p className="text-green-500 mb-4">{message}</p>}
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">Enter OTP</label>
                <input
                  type="text" value={otp} maxLength={6}
                  onChange={e => setOtp(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="------"
                />
                <div className="text-center mt-2">
                  {timer > 0 ? (
                    <p className="text-slate-500 text-sm">OTP expires in <span className="font-bold text-blue-600">{formatTime(timer)}</span></p>
                  ) : (
                    <button type="button" onClick={handleForgotPassword} className="text-blue-600 text-sm hover:underline">
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-slate-700 mb-2">New Password</label>
                <input
                  type="password" value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Min 6 characters"
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-2">Confirm New Password</label>
                <input
                  type="password" value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Re-enter new password"
                />
              </div>
              <button
                type="submit" disabled={loading || timer === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>
            <button onClick={() => { setStep('login'); setError(''); }} className="mt-4 w-full text-slate-500 text-sm hover:underline">
              ← Back to Login
            </button>
          </>
        )}

      </div>
    </motion.div>
  );
};

export default Login;
