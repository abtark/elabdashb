"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaKey, FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Image from "next/image";

// --- CUSTOM HEXAGON PARTICLES COMPONENT ---
const HexagonParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles: any[] = [];

    const createHexagon = (x: number, y: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        ctx.lineTo(
          x + r * Math.cos((Math.PI / 3) * i),
          y + r * Math.sin((Math.PI / 3) * i)
        );
      }
      ctx.closePath();
    };

    class Particle {
      x: number; y: number; vx: number; vy: number; size: number; color: string;
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 20 + 10;
        this.color = `rgba(100, 100, 100, ${Math.random() * 0.1})`;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -50) this.x = width + 50;
        if (this.x > width + 50) this.x = -50;
        if (this.y < -50) this.y = height + 50;
        if (this.y > height + 50) this.y = -50;
      }
      draw() {
        if(!ctx) return;
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 1;
        createHexagon(this.x, this.y, this.size);
        ctx.stroke();
      }
    }

    const init = () => {
      particles = [];
      for (let i = 0; i < 60; i++) particles.push(new Particle());
    };

    const animate = () => {
      if(!ctx) return;
      ctx.clearRect(0, 0, width, height);
      
      // Draw Connections
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100,100,100,${0.1 - dist/1500})`;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 bg-gray-50 dark:bg-[#050505]" />;
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
    <main className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 select-none">
      
      {/* Hexagon Particles Background */}
      <HexagonParticles />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
        className="w-full max-w-[750px] max-h-[95vh] flex flex-col items-center justify-center relative z-10"
      >
        {/* Glass Container */}
        <div className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-2xl rounded-3xl p-8 md:p-12 overflow-y-auto">
          
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
