'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Artificial delay to show smooth animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === "admin@xmail.com" && password === "1234567890") {
      setIsLoggedIn(true);
    } else {
      setError("Invalid credentials provided.");
    }
    setIsLoading(false);
  };

  // --- Success View ---
  if (isLoggedIn) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="glass-container p-12 rounded-3xl text-center max-w-lg w-full">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
          <p className="text-gray-400 mb-8">Access granted to Emanistation Dashboard.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  // --- Login View ---
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Login Container */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="glass-container w-full rounded-[30px] p-8 md:p-12 relative overflow-hidden"
        style={{ maxWidth: '750px', maxHeight: '95vh' }}
      >
        
        <div className="flex flex-col items-center justify-center space-y-8">
          
          {/* LOGO - Fixed Sizing */}
          <div className="text-center">
            <motion.img 
              src="https://iili.io/FC3KC6g.png" 
              alt="Emanistation Logo"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="h-16 md:h-20 w-auto object-contain mx-auto mb-6" 
            />
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl md:text-3xl font-bold text-white"
            >
              Log in to Emanistation
            </motion.h1>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="w-full max-w-md space-y-5">
            
            {/* Email Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative group"
            >
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors">
                <i className="fa-solid fa-user text-lg"></i>
              </div>
              <input 
                type="email" 
                placeholder="Enter your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-14 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-black/40 transition-all"
                required
              />
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-white transition-colors">
                <i className="fa-solid fa-key text-lg"></i>
              </div>
              <input 
                type="password" 
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-14 pr-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-black/40 transition-all"
                required
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-red-500/10 border border-red-500/20 text-red-200 text-sm py-3 px-4 rounded-lg text-center">
                    <i className="fa-solid fa-circle-exclamation mr-2"></i>
                    {error}
                  </div>
                  
                  {/* Forgot Password Link appears if error exists */}
                  <div className="text-center mt-2">
                    <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                      Forgot Password?
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl shadow-lg hover:shadow-white/20 transition-all duration-300 mt-2"
            >
              {isLoading ? (
                <i className="fa-solid fa-circle-notch fa-spin"></i>
              ) : (
                "Login"
              )}
            </motion.button>

            {/* New Account Link */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center pt-2"
            >
              <span className="text-gray-400">New? </span>
              <a href="#" className="text-white font-medium hover:underline underline-offset-4 decoration-blue-400">
                Create an account.
              </a>
            </motion.div>

          </form>
        </div>
      </motion.div>
    </main>
  );
}
