"use client";

import { useState, useEffect } from "react";
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
  // State to prevent hydration mismatch and flash
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 1. Check if already logged in
    const isAuth = localStorage.getItem("isAuthenticated");
    if (isAuth === "true") {
      router.push("/dashboard");
    } else {
      setIsChecking(false); // Allow login form to show
    }

    // 2. Protection Listeners
    const handleContext = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "F12" ||
        (e.ctrlKey && e.shiftKey && e.key === "I") ||
        (e.ctrlKey && e.key === "u")
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("contextmenu", handleContext);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("contextmenu", handleContext);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    // Mock Authentication Logic
    setTimeout(() => {
      if (email === "admin@xmail.com" && password === "1234567890") {
        // Set Auth Token
        localStorage.setItem("isAuthenticated", "true");
        router.push("/dashboard");
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1500);
  };

  // If we are checking auth state, render nothing or a spinner
  if (isChecking) return null;

  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-50 dark:bg-[#050505] transition-colors duration-500 select-none">
      
      {/* Background Image with Slow Rotation (Waving Effect) */}
      <motion.div 
        className="absolute inset-[-50%] z-0 pointer-events-none" 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 200, ease: "linear" }}
      >
        <Image 
          src="https://iili.io/fQF3kJI.jpg" 
          alt="Background" 
          fill 
          className="object-cover opacity-30 dark:opacity-20 blur-sm scale-150"
          priority
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-[420px] max-h-[90vh] flex flex-col items-center justify-center relative z-10"
      >
        {/* Glass Container */}
        <div className="w-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl rounded-3xl p-8 overflow-y-auto">
          
          {/* Logo Section */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="flex justify-center mb-4 pointer-events-none"
          >
            <div className="relative w-40 h-40 drop-shadow-2xl">
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
            className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-1 tracking-wide"
          >
            Log in to EntryLab
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-600 dark:text-white/60 text-center mb-6 text-sm"
          >
            Welcome back, please enter your details.
          </motion.p>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 w-full">
            
            {/* Email Input */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-white/50 group-focus-within:text-blue-500 dark:group-focus-within:text-white transition-colors">
                <FaUser />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-3.5 transition-all duration-300 outline-none shadow-sm"
                placeholder="Enter your Email"
              />
            </motion.div>

            {/* Password Input */}
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 dark:text-white/50 group-focus-within:text-blue-500 dark:group-focus-within:text-white transition-colors">
                <FaKey />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-3.5 transition-all duration-300 outline-none shadow-sm"
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
                  className="text-red-500 dark:text-red-400 text-xs text-center font-medium"
                >
                  <span>Invalid credentials.</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
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
            className="mt-6 text-center text-xs text-gray-500 dark:text-white/60"
          >
            New? <span className="text-blue-600 dark:text-white font-semibold cursor-pointer hover:underline">Create an account.</span>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
