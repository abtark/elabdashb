"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { 
  CheckSquare, Table, Clock, Zap, Coffee, Sun, Moon 
} from "lucide-react";

// Import separate components
import Sidebar from "./components/Sidebar";
import NewTaskApp from "./components/NewTaskApp";
import EntriesApp from "./components/EntriesApp";
import TrackerApp from "./components/TrackerApp";
import UpdatesApp from "./components/UpdatesApp";
import SnacksApp from "./components/SnacksApp";

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [activeApp, setActiveApp] = useState<string | null>('newtask');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  // Menu Configuration with Colors
  const menuItems = [
    { id: 'newtask', icon: CheckSquare, label: 'NewTask Updates', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { id: 'entries', icon: Table, label: 'Daily Entry Counts', color: 'text-green-500', bgColor: 'bg-green-500' },
    { id: 'tracker', icon: Clock, label: 'Tracker', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { id: 'updates', icon: Zap, label: 'Updates', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    { id: 'snacks', icon: Coffee, label: 'Food & Beverage', color: 'text-pink-500', bgColor: 'bg-pink-500' },
  ];

  const handleClose = () => { setActiveApp(null); };

  if (!isClient) return null;

  return (
    <>
      <style jsx global>{`
        .no-spinner::-webkit-inner-spin-button, 
        .no-spinner::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
          margin: 0; 
        }
        .no-spinner { -moz-appearance: textfield; }
        
        /* Custom Scrollbar for inner content */
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,100,100,0.3); border-radius: 10px; }
      `}</style>

      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-200 dark:bg-[#050505] transition-colors duration-500 font-ubuntu">
        
        {/* Background Blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-[20%] w-96 h-96 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-[100px] animate-blob" />
          <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        </div>

        {/* Main Glass Container */}
        <motion.div 
          layout
          className="relative z-10 w-full max-w-[950px] h-[95vh] max-h-[850px] bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl"
        >
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-4 pb-0 shrink-0 select-none">
            <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white opacity-90 ml-2">
               {activeApp ? menuItems.find(i => i.id === activeApp)?.label : "Dashboard"}
            </h1>
            <div className="flex items-center gap-6">
               <div className="relative w-20 h-20 drop-shadow-2xl">
                  <Image src="https://iili.io/FC3KC6g.png" alt="Logo" fill className="object-contain" />
               </div>
               <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/40 transition-colors text-gray-800 dark:text-white">
                 {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden relative">
            {/* Sidebar Component */}
            <Sidebar menuItems={menuItems} activeApp={activeApp} setActiveApp={setActiveApp} />

            {/* App Content Area */}
            <div className="flex-1 relative overflow-hidden bg-white/20 dark:bg-transparent backdrop-blur-sm">
              <AnimatePresence mode="wait">
                {activeApp ? (
                  <motion.div 
                    key={activeApp}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                    className="h-full w-full flex flex-col p-6 pt-6"
                  >
                     {activeApp === 'newtask' && <NewTaskApp onClose={handleClose} />}
                     {activeApp === 'tracker' && <TrackerApp onClose={handleClose} />}
                     {activeApp === 'snacks' && <SnacksApp onClose={handleClose} />}
                     {activeApp === 'entries' && <EntriesApp onClose={handleClose} />}
                     {activeApp === 'updates' && <UpdatesApp onClose={handleClose} />}
                  </motion.div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                     <div className="w-32 h-32 relative mb-4 grayscale opacity-50">
                        <Image src="https://iili.io/FC3KC6g.png" fill className="object-contain" alt="Logo" />
                     </div>
                     <p className="text-gray-800 dark:text-white font-light">Select an application from the sidebar</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
