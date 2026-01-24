"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Key, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (email === "admin@xmail.com" && password === "1234567890") {
        router.push("/dashboard");
      } else {
        alert("Invalid credentials");
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
      {/* Moving Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-[90%] max-w-[450px] glass-panel rounded-3xl p-8 relative z-10 flex flex-col items-center"
      >
        <Image src="https://iili.io/FC3KC6g.png" alt="Logo" width={150} height={150} className="mb-6 drop-shadow-2xl" />
        <h1 className="text-2xl font-bold text-white mb-2">Log in to EntryLab</h1>
        <p className="text-white/60 text-sm mb-8">Access your workspace</p>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3 text-white/50 w-5 h-5" />
            <input 
              type="email" 
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <div className="relative">
            <Key className="absolute left-3 top-3 text-white/50 w-5 h-5" />
            <input 
              type="password" 
              placeholder="Enter your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
