'use client';

import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FaRocket, FaChartLine, FaShieldAlt, FaArrowRight } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500 selection:text-white overflow-hidden">
      
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md border-b border-white/5 bg-black/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Image src="https://iili.io/FC3KC6g.png" alt="Logo" width={40} height={40} />
            <span className="font-bold text-xl tracking-tight">Emanistation</span>
          </div>
          <div className="flex gap-4">
             <Link href="/login">
                <button className="px-6 py-2 rounded-full border border-white/20 hover:bg-white/10 transition-all text-sm">
                  Log In
                </button>
             </Link>
             <button className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all text-sm hidden md:block">
               Get Started
             </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
        {/* Background Gradients */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-[130px] opacity-20 -z-10 pointer-events-none" />

        <motion.div 
          style={{ opacity, scale }}
          className="max-w-5xl mx-auto text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm text-blue-300"
          >
            v2.0 is now live — Experience the future
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
          >
            The Dashboard for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Modern Creators</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Seamlessly manage your workflow with a fully fluid, glass-morphic interface designed for the next generation of web apps.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <Link href="/login">
                <button className="px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Launch Dashboard <FaArrowRight size={14} />
                </button>
            </Link>
            <button className="px-8 py-4 rounded-full border border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 text-lg transition-all">
              View Documentation
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid (Glass Cards) */}
      <section className="py-24 px-6 relative">
         <div className="max-w-7xl mx-auto">
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {/* Card 1 */}
              <motion.div variants={fadeInUp} className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-white/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-6">
                  <FaRocket size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
                <p className="text-gray-400">Powered by Next.js and optimized for speed. Transitions are butter smooth.</p>
              </motion.div>

              {/* Card 2 */}
              <motion.div variants={fadeInUp} className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-white/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                  <FaChartLine size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Real-time Analytics</h3>
                <p className="text-gray-400">Visualize your data with beautiful, responsive charts that update instantly.</p>
              </motion.div>

              {/* Card 3 */}
              <motion.div variants={fadeInUp} className="p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg hover:border-white/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-6">
                  <FaShieldAlt size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">Secure by Default</h3>
                <p className="text-gray-400">Enterprise grade security built-in with Auth0 authentication support.</p>
              </motion.div>
            </motion.div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 Emanistation. All rights reserved.</p>
      </footer>
    </main>
  );
}
