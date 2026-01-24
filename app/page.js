'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate network delay for "butter smooth" feel
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === "admin@xmail.com" && password === "1234567890") {
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials. Please check your email or password.");
    }
    setIsLoading(false);
  };

  // Animation Variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } // iOS fluid easing
    },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.5 } }
  };

  if (isLoggedIn) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="min-h-screen flex flex-col items-center justify-center text-white"
      >
        <div className="glass-panel p-10 rounded-3xl text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Dashboard</h1>
          <p className="text-gray-300">Authentication Successful</p>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="mt-6 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full transition-all border border-white/10"
          >
            Log Out
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px]" />

      <AnimatePresence>
        <motion.div 
          className="w-full max-w-[750px] relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="glass-panel rounded-[40px] p-8 md:p-12 w-full overflow-hidden relative">
            
            {/* Logo Section */}
            <div className="flex flex-col items-center mb-10">
              <motion.img 
                src="https://iili.io/FC3KC6g.png" 
                alt="Logo" 
                className="h-20 mb-6 drop-shadow-lg"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
              />
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-white tracking-tight text-center"
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Log in to Emanistation
              </motion.h1>
            </div>

            {/* Form Section */}
            <form onSubmit={handleLogin} className="space-y-6 max-w-md mx-auto">
              
              {/* Email Input */}
              <motion.div 
                className="group relative"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300">
                  <i className="fa-solid fa-user"></i>
                </div>
                <input
                  type="email"
                  required
                  placeholder="Enter your Email"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-black/40 transition-all duration-300 ease-out"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>

              {/* Password Input */}
              <motion.div 
                className="group relative"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors duration-300">
                  <i className="fa-solid fa-key"></i>
                </div>
                <input
                  type="password"
                  required
                  placeholder="Enter your Password"
                  className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-black/40 transition-all duration-300 ease-out"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </motion.div>

              {/* Error Message */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-lg hover:shadow-white/20 transition-all duration-300 mt-4 relative overflow-hidden"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <i className="fa-solid fa-circle-notch fa-spin"></i> Processing...
                  </span>
                ) : (
                  "Login"
                )}
              </motion.button>

              {/* Footer Links */}
              <motion.div 
                className="flex flex-col items-center gap-3 text-sm text-gray-400 mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex gap-1">
                  <span>New?</span>
                  <a href="#" className="text-white hover:underline decoration-white/50 underline-offset-4 transition-all">
                    Create an account
                  </a>
                </div>
                <a href="#" className="hover:text-white transition-colors">
                  Forgot Password?
                </a>
              </motion.div>

            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
