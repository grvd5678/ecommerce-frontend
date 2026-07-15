import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const LABELS = {
  name: 'Name',
  email: 'Email',
  password: 'Password',
  enterOtp: 'Enter OTP',
  namePlaceholder: 'Your full name',
  emailPlaceholder: 'your@email.com',
  passwordPlaceholder: 'Min 6 characters',
  otpPlaceholder: '------',
};

const Register = () => {
  const [step, setStep] = useState(1); // 1 = register form, 2 = OTP form
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(120); // 2 minutes
  const { register, verifyOTP, resendOTP } = useAuth();
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (step !== 2) return;
    if (timer === 0) return;
    const interval = setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return setError('All fields are required');
    setLoading(true);
    setError('');
    try {
      await register(name, email, password);
      setStep(2);
      setTimer(120);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter OTP');
    setLoading(true);
    setError('');
    try {
      await verifyOTP(email, otp);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    try {
      await resendOTP(email);
      setTimer(120);
      setOtp('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">

        {step === 1 ? (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Create Account</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">{LABELS.name}</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={LABELS.namePlaceholder}
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-2">{LABELS.email}</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={LABELS.emailPlaceholder}
                />
              </div>
              <div>
                <label className="block text-slate-700 mb-2">{LABELS.password}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder={LABELS.passwordPlaceholder}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Sending OTP...' : 'Register'}
              </button>
            </form>
            <p className="mt-4 text-center text-slate-600">
              Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Verify Email</h2>
            <p className="text-slate-500 mb-6">
              We sent a 6-digit OTP to <strong>{email}</strong>
            </p>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleVerifyOTP} className="space-y-4">
              <div>
                <label className="block text-slate-700 mb-2">{LABELS.enterOtp}</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="w-full px-4 py-3 border rounded-lg text-center text-2xl tracking-widest focus:ring-2 focus:ring-blue-500"
                  placeholder={LABELS.otpPlaceholder}
                />
              </div>

              {/* Timer */}
              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-slate-500 text-sm">
                    OTP expires in <span className="font-bold text-blue-600">{formatTime(timer)}</span>
                  </p>
                ) : (
                  <p className="text-red-500 text-sm">OTP expired</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || timer === 0}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={handleResendOTP}
                disabled={timer > 0}
                className="text-blue-600 hover:underline disabled:text-slate-400 disabled:no-underline text-sm"
              >
                {timer > 0 ? `Resend OTP in ${formatTime(timer)}` : 'Resend OTP'}
              </button>
            </div>

            <button
              onClick={() => { setStep(1); setError(''); }}
              className="mt-3 w-full text-slate-500 text-sm hover:underline"
            >
              ← Back to Register
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Register;
