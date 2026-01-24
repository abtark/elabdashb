"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FaSignOutAlt } from "react-icons/fa";

export default function Dashboard() {
  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-black text-white p-6 md:p-12">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-12 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10"
      >
        <div className="flex items-center gap-3">
            <Image src="https://iili.io/FC3KC6g.png" width={40} height={40} alt="Logo" />
            <span className="font-bold text-lg tracking-wide">Emanistation</span>
        </div>
        <Link href="/" className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/40 text-red-300 px-4 py-2 rounded-lg transition-all text-sm font-medium">
            <FaSignOutAlt /> Logout
        </Link>
      </motion.nav>

      <div className="max-w-6xl mx-auto">
        <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-light mb-2"
        >
            Welcome, <span className="font-bold text-blue-400">Admin</span>
        </motion.h1>
        <p className="text-white/50 mb-8">Here is your dashboard overview.</p>

        {/* Mock Grid for Dashboard UI */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item, index) => (
                <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="h-48 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors backdrop-blur-sm p-6 flex flex-col justify-between"
                >
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
                        {/* Mock Icon */}
                        <div className="w-4 h-4 bg-current rounded-sm" />
                    </div>
                    <div>
                        <h3 className="text-xl font-medium">Statistic {item}</h3>
                        <p className="text-white/30 text-sm">Update recently</p>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </main>
  );
}
