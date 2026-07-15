import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/useCart';

const LABELS = {
  fullName: 'Full Name',
  email: 'Email',
  phone: 'Phone',
  address: 'Address',
  cardNumber: 'Card Number',
  orderConfirmed: 'Order Confirmed!',
  placeOrder: 'Place Order',
  nameRequired: 'Name is required',
  emailRequired: 'Email is required',
  emailInvalid: 'Invalid email',
  phoneRequired: 'Phone is required',
  phoneInvalid: 'Invalid phone number',
  addressRequired: 'Address is required',
  cardRequired: 'Card number is required',
  cardInvalid: 'Invalid card number',
};

const CheckoutForm = ({ total }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const onSubmit = () => {
    setShowSuccess(true);
    clearCart();
    setTimeout(() => navigate('/'), 2500);
  };

  return (
    <>
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl text-center shadow-xl border border-slate-200"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <motion.div
                className="text-6xl mb-4"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                ✓
              </motion.div>
              <motion.h2
                className="text-2xl font-bold text-slate-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {LABELS.orderConfirmed}
              </motion.h2>
              <motion.p
                className="text-slate-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Total: ₹{total.toFixed(2)}
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{LABELS.fullName}</label>
          <input
            {...register('name', { required: LABELS.nameRequired })}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{LABELS.email}</label>
          <input
            type="email"
            {...register('email', {
              required: LABELS.emailRequired,
              pattern: { value: /^\S+@\S+$/i, message: LABELS.emailInvalid }
            })}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900"
          />
          {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{LABELS.phone}</label>
          <input
            {...register('phone', {
              required: LABELS.phoneRequired,
              pattern: { value: /^[0-9]{10}$/, message: LABELS.phoneInvalid }
            })}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900"
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{LABELS.address}</label>
          <textarea
            {...register('address', { required: LABELS.addressRequired })}
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900"
            rows="3"
          />
          {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">{LABELS.cardNumber}</label>
          <input
            {...register('card', {
              required: LABELS.cardRequired,
              pattern: { value: /^[0-9]{16}$/, message: LABELS.cardInvalid }
            })}
            placeholder="****************"
            className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white text-slate-900"
          />
          {errors.card && <p className="text-red-600 text-sm mt-1">{errors.card.message}</p>}
        </div>

        <motion.button
          type="submit"
          className="w-full bg-slate-900 text-white py-3 rounded-xl hover:bg-slate-800 font-medium transition-all duration-200"
          whileTap={{ scale: 0.98 }}
        >
          {LABELS.placeOrder} - ₹{total.toFixed(2)}
        </motion.button>
      </form>
    </>
  );
};

export default CheckoutForm;
