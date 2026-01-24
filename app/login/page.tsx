'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaUser, FaKey } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#050505]">
      
      {/* Background Ambient Animation */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
         <motion.div 
           animate={{ x: [0, 100, 0], y: [0, -50, 0], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 10, repeat: Infinity }}
           className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600 rounded-full blur-[120px] opacity-30" 
         />
         <motion.div 
           animate={{ x: [0, -100, 0], y: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
           transition={{ duration: 12, repeat: Infinity }}
           className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600 rounded-full blur-[120px] opacity-30" 
         />
      </div>

      {/* Main Login Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[750px] max-h-[95vh] p-8 md:p-12 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl flex flex-col items-center justify-center"
      >
        
        {/* Logo */}
        <div className="mb-8">
            <Image 
                src="https://iili.io/FC3KC6g.png" 
                alt="Logo" 
                width={80} 
                height={80} 
                className="drop-shadow-lg"
            />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center tracking-wide">
          Log in to Emanistation
        </h1>

        <form className="w-full max-w-md flex flex-col gap-6">
          
          {/* Email Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <FaUser />
            </div>
            <input 
              type="email" 
              placeholder="Enter your Email"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all duration-300"
            />
          </div>

          {/* Password Input */}
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors">
              <FaKey />
            </div>
            <input 
              type="password" 
              placeholder="Enter your Password"
              className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:bg-black/40 transition-all duration-300"
            />
          </div>

          {/* Login Button */}
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-500/20 transition-all mt-2"
          >
            Log In
          </motion.button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-3 text-sm text-gray-300">
          <p>
            New? <Link href="/signup" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">Create an account.</Link>
          </p>
          <Link href="/forgot-password" className="text-gray-400 hover:text-white transition-colors">
            Forget password
          </Link>
        </div>

      </motion.div>
    </div>
  );
}
