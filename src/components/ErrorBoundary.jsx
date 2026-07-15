import { Component } from 'react';
import { motion } from 'framer-motion';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
    this.handleReload = this.handleReload.bind(this);
  }

  handleReload() {
    window.location.reload();
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
          <motion.div
            className="max-w-md w-full bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm p-12 border border-slate-200/60 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⚠️
            </motion.div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-slate-600 mb-8">
              We're sorry for the inconvenience. Please refresh the page to continue.
            </p>
            <motion.button
              onClick={this.handleReload}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl hover:bg-slate-800 font-medium transition-all duration-200"
              whileTap={{ scale: 0.98 }}
            >
              Refresh Page
            </motion.button>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
