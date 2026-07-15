import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <motion.button
      onClick={toggleDarkMode}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="text-2xl"
    >
      {darkMode ? '🌙' : '☀️'}
    </motion.button>
  );
};

export default DarkModeToggle;
