"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaKey, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FloatingShapes = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const colors = [
    "bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-orange-500", "bg-cyan-500", "bg-green-500"
  ];

  const shapes = Array.from({ length: 15 }).map((_, i) => ({
    id: i,
    size: Math.random() * 100 + 50, 
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 5
  }));

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gray-100 dark:bg-[#050505]">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full opacity-30 dark:opacity-20 blur-xl ${shape.color}`}
          initial={{ 
            width: shape.size, 
            height: shape.size, 
            x: `${shape.x}vw`, 
            y: `${shape.y}vh` 
          }}
          animate={{ 
            x: [`${shape.x}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${shape.y}vh`, `${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear",
            delay: shape.delay
          }}
        />
      ))}
    </div>
  );
};

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
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 select-none">
      
      <FloatingShapes />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-[750px] max-h-[95vh] flex flex-col items-center justify-center relative z-10"
      >
        <div className="w-full bg-white/10 dark:bg-white/5 backdrop-blur-3xl border border-white/20 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl p-8 md:p-12 overflow-y-auto">
          
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

          <form onSubmit={handleLogin} className="space-y-6 w-full max-w-md mx-auto">
            
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 dark:text-white/50 group-focus-within:text-blue-500 dark:group-focus-within:text-white transition-colors">
                <FaUser />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-white/40 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-4 transition-all duration-300 outline-none shadow-sm backdrop-blur-sm"
                placeholder="Enter your Email"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-600 dark:text-white/50 group-focus-within:text-blue-500 dark:group-focus-within:text-white transition-colors">
                <FaKey />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/40 dark:bg-black/20 border border-gray-300 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-4 transition-all duration-300 outline-none shadow-sm backdrop-blur-sm"
                placeholder="Enter your Password"
              />
            </motion.div>

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

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-8 text-center text-sm text-gray-600 dark:text-white/60"
          >
            New? <span className="text-blue-600 dark:text-white font-semibold cursor-pointer hover:underline">Create an account.</span>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
