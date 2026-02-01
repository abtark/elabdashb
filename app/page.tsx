"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaKey, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

const FloatingShapes = () => {
  const [shapes, setShapes] = useState<any[]>([]);

  useEffect(() => {
    const colors = [
      "bg-blue-400/30 dark:bg-blue-600/10", 
      "bg-purple-400/30 dark:bg-purple-600/10", 
      "bg-pink-400/30 dark:bg-pink-600/10", 
      "bg-orange-400/30 dark:bg-orange-600/10", 
      "bg-emerald-400/30 dark:bg-emerald-600/10"
    ];

    const generatedShapes = Array.from({ length: 8 }).map((_, i) => {
      const isBig = i === 0; 
      const size = isBig ? Math.random() * 200 + 300 : Math.random() * 100 + 50; 
      
      return {
        id: i,
        size: size,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: Math.random() * 60 + 40, 
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 10
      };
    });
    setShapes(generatedShapes);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gray-100 dark:bg-[#050505]">
      {shapes.map((shape) => (
        <motion.div
          key={shape.id}
          className={`absolute rounded-full blur-3xl ${shape.color}`}
          initial={{ 
            width: shape.size, 
            height: shape.size, 
            x: `${shape.x}vw`, 
            y: `${shape.y}vh` 
          }}
          animate={{ 
            x: [`${shape.x}vw`, `${Math.random() * 100}vw`, `${Math.random() * 100}vw`],
            y: [`${shape.y}vh`, `${Math.random() * 100}vh`, `${Math.random() * 100}vh`],
            scale: [1, 1.2, 0.9, 1],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: shape.duration,
            repeat: Infinity,
            repeatType: "mirror",
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

  useEffect(() => {
    const handleContext = (e: Event) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
        e.preventDefault();
      }
    };
    window.addEventListener('contextmenu', handleContext);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('contextmenu', handleContext);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring", stiffness: 100, damping: 20 }}
        className="w-full max-w-[420px] max-h-[90vh] flex flex-col items-center justify-center relative z-10"
      >
        <div className="w-full bg-white/20 dark:bg-white/5 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] rounded-3xl p-8 overflow-y-auto">
          
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
                draggable={false}
              />
            </div>
          </motion.div>

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

          <form onSubmit={handleLogin} className="space-y-4 w-full">
            
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
                className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-3.5 transition-all duration-300 outline-none shadow-sm backdrop-blur-sm"
                placeholder="Enter your Email"
              />
            </motion.div>

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
                className="w-full bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-white/30 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent block w-full pl-10 p-3.5 transition-all duration-300 outline-none shadow-sm backdrop-blur-sm"
                placeholder="Enter your Password"
              />
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-red-500 dark:text-red-400 text-xs text-center font-medium"
                >
                  Invalid credentials.
                </motion.div>
              )}
            </AnimatePresence>

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

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 text-center text-xs text-gray-500 dark:text-white/50"
          >
            New? <span className="text-blue-600 dark:text-white font-semibold cursor-pointer hover:underline">Create an account.</span>
          </motion.div>

        </div>
      </motion.div>
    </main>
  );
}
