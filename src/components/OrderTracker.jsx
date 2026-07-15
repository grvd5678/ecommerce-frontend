import { motion } from 'framer-motion';

const OrderTracker = ({ status }) => {
  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStep = steps.indexOf(status);

  if (status === 'cancelled') {
    return <div className="text-red-600 font-medium bg-red-50 p-2 rounded">Order Cancelled</div>;
  }

  return (
    <div className="w-full py-4">
      <div className="flex justify-between mb-2">
        {steps.map((step, idx) => (
          <span key={step} className={`text-xs capitalize font-medium ${idx <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
            {step}
          </span>
        ))}
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden flex">
        {steps.map((step, idx) => (
          <motion.div
            key={step}
            className={`h-full ${idx <= currentStep ? 'bg-blue-600' : ''}`}
            initial={{ width: 0 }}
            animate={{ width: idx <= currentStep ? '25%' : 0 }}
          />
        ))}
      </div>
    </div>
  );
};

export default OrderTracker;
