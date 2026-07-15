import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSlider = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-slate-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center p-8 text-center"
          style={{ backgroundImage: `url(${slides[current].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
        >
          <div className="bg-white/80 backdrop-blur-md p-8 rounded-2xl">
            <h2 className="text-4xl font-bold text-slate-900 mb-2">{slides[current].title}</h2>
            <p className="text-lg text-slate-700">{slides[current].subtitle}</p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition">
        ❮
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/50 p-2 rounded-full hover:bg-white transition">
        ❯
      </button>
    </div>
  );
};

export default HeroSlider;
