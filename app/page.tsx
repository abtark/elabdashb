"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaKey, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Mock Authentication Logic
    setTimeout(() => {
      if (email === "admin@xmail.com" && password === "1234567890") {
        router.push("/dashboard");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1500); 
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-500 select-none">
      {/* Updated Background Image */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://cdn.pixabay.com/photo/2022/07/26/05/28/circles-7345110_1280.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-30 dark:opacity-20 blur-sm"
          priority
        />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-[750px] max-h-[95vh] flex flex-col items-center justify-center relative z-10"
      >
        {/* Glass Container */}
        <div className="w-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 overflow-y-auto">
          
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-10"
          >
            <div className="relative w-52 h-52 md:w-72 md:h-72 drop-shadow-2xl">
              <Image 
                src="https://iili.io/FC3KC6g.png" 
                alt="EntryLab Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-2 tracking-wide"
          >
            Log in to EntryLab
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-white/60 text-center mb-10 text-sm md:text-base"
          >
            Welcome back, please enter your details.
          </motion.p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md mx-auto">
            
            {/* Email Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/50 group-focus-within:text-blue-500 dark:group-focus-within:text-white transition-colors">
                <FaUser />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-4 transition-all duration-300 outline-none shadow-sm"
                placeholder="Enter your Email"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-white/50 group-focus-within:text-blue-500 dark:group-focus-within:text-white transition-colors">
                <FaKey />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-4 transition-all duration-300 outline-none shadow-sm"
                placeholder="Enter your Password"
              />
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 dark:text-red-400 text-sm text-center flex flex-col gap-1"
                >
                  <span>Invalid credentials.</span>
                  <button type="button" className="underline hover:text-red-600 dark:hover:text-red-300 transition-colors">
                    Forget password?
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              type="submit"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In <FaArrowRight className="text-sm" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-sm text-gray-500 dark:text-white/60"
          >
            New? <span className="text-blue-600 dark:text-white font-semibold cursor-pointer hover:underline">Create an account.</span>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
