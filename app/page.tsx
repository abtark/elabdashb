"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { 
  CheckSquare, Table, Clock, Zap, Coffee, Sun, Moon, 
  Play, Pause, X 
} from "lucide-react";

// Import components
import Sidebar from "./components/Sidebar";
import NewTaskApp from "./components/NewTaskApp";
import EntriesApp from "./components/EntriesApp";
import TrackerApp from "./components/TrackerApp";
import UpdatesApp from "./components/UpdatesApp";
import SnacksApp from "./components/SnacksApp";

// --- GLOBAL STOPWATCH HOOK ---
const useStopwatch = (id: string) => {
  const [state, setState] = useState({
    startTime: 0,
    elapsed: 0,
    isRunning: false
  });

  useEffect(() => {
    const saved = localStorage.getItem(`stopwatch_${id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isRunning) {
        const now = Date.now();
        const additionalTime = now - parsed.lastTick;
        setState({
          startTime: parsed.startTime,
          elapsed: parsed.elapsed + additionalTime,
          isRunning: true
        });
      } else {
        setState(parsed);
      }
    }
  }, [id]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isRunning) {
      localStorage.setItem(`stopwatch_${id}`, JSON.stringify({ ...state, lastTick: Date.now() }));
      interval = setInterval(() => {
        setState(prev => {
          const newState = { ...prev, elapsed: Date.now() - prev.startTime };
          localStorage.setItem(`stopwatch_${id}`, JSON.stringify({ ...newState, lastTick: Date.now() }));
          return newState;
        });
      }, 1000);
    } else {
      localStorage.setItem(`stopwatch_${id}`, JSON.stringify({ ...state, lastTick: Date.now() }));
    }
    return () => clearInterval(interval);
  }, [state.isRunning, state.startTime, id]);

  const start = () => {
    if (!state.isRunning) {
      setState(prev => ({
        ...prev,
        startTime: Date.now() - prev.elapsed,
        isRunning: true
      }));
    }
  };

  const pause = () => {
    if (state.isRunning) {
      setState(prev => ({ ...prev, isRunning: false }));
    }
  };

  const reset = () => {
    setState({ startTime: 0, elapsed: 0, isRunning: false });
    localStorage.removeItem(`stopwatch_${id}`);
  };

  return { ...state, start, pause, reset };
};

// --- MINI BUBBLE COMPONENT ---
const MiniStopwatch = ({ 
  label, time, isRunning, onToggle, bottomOffset, visible
}: { 
  label: string, time: string, isRunning: boolean, onToggle: () => void, bottomOffset: string, visible: boolean
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!visible && !isRunning) return null; // Hide if toggled off AND not running. 
  // User req: "when toggle off then mini stopwatch will be hide" -> assuming completely hidden unless running logic overrides? 
  // Sticking to strict toggle off = hide for now based on "toggle off then mini stopwatch will be hide".
  if (!visible) return null;

  return (
    <div className={`fixed right-4 z-[60] transition-all duration-300 flex items-center justify-end gap-2 ${bottomOffset}`}>
      <AnimatePresence>
        {(isExpanded || isRunning) && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white/90 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full pl-4 pr-1 py-1 shadow-xl flex items-center gap-3"
          >
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase font-bold text-gray-500">{label}</span>
              <span className="font-mono font-bold text-gray-800 dark:text-white">{time}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => { onToggle(); setIsExpanded(!isExpanded); }}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all border
          ${isRunning 
            ? 'bg-orange-500 border-orange-600 text-white animate-pulse' 
            : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-green-500 hover:scale-110'
          }
        `}
      >
        {isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}
      </button>
    </div>
  );
};

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [activeApp, setActiveApp] = useState<string | null>('newtask');
  const [isClient, setIsClient] = useState(false);
  
  // Shared State
  const [totalSentLinks, setTotalSentLinks] = useState(0);
  const [totalDailyEntries, setTotalDailyEntries] = useState(0);
  const [showBubbles, setShowBubbles] = useState(false);

  // Global Stopwatch State
  const generalSW = useStopwatch('general');
  const newTaskSW = useStopwatch('newtask');

  useEffect(() => setIsClient(true), []);

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return `${h.toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const menuItems = [
    { id: 'newtask', icon: CheckSquare, label: 'NewTask Updates', color: 'text-blue-500', bgColor: 'bg-blue-500' },
    { id: 'entries', icon: Table, label: 'Daily Entry Counts', color: 'text-green-500', bgColor: 'bg-green-500' },
    { id: 'tracker', icon: Clock, label: 'Tracker', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { id: 'updates', icon: Zap, label: 'Updates', color: 'text-yellow-500', bgColor: 'bg-yellow-500' },
    { id: 'snacks', icon: Coffee, label: 'Food & Beverage', color: 'text-pink-500', bgColor: 'bg-pink-500' },
  ];

  const handleClose = () => setActiveApp(null);

  if (!isClient) return null;

  return (
    <>
      <style jsx global>{`
        .no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spinner { -moz-appearance: textfield; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,100,100,0.3); border-radius: 10px; }
      `}</style>

      {/* Mini Stopwatches */}
      <MiniStopwatch 
        label="General" 
        time={formatTime(generalSW.elapsed)} 
        isRunning={generalSW.isRunning} 
        onToggle={generalSW.isRunning ? generalSW.pause : generalSW.start}
        bottomOffset="bottom-20"
        visible={showBubbles}
      />
      <MiniStopwatch 
        label="NewTask" 
        time={formatTime(newTaskSW.elapsed)} 
        isRunning={newTaskSW.isRunning} 
        onToggle={newTaskSW.isRunning ? newTaskSW.pause : newTaskSW.start}
        bottomOffset="bottom-4"
        visible={showBubbles}
      />

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
                  <Image src="https://iili.io/FC3KC6g.png" alt="Logo" fill className="object-contain" priority />
               </div>
               <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/40 transition-colors text-gray-800 dark:text-white">
                 {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
               </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar menuItems={menuItems} activeApp={activeApp} setActiveApp={setActiveApp} />

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
                     {activeApp === 'newtask' && (
                       <NewTaskApp 
                         onClose={handleClose} 
                         totalSentLinks={totalSentLinks} 
                         setTotalSentLinks={setTotalSentLinks} 
                       />
                     )}
                     {activeApp === 'entries' && (
                       <EntriesApp 
                         onClose={handleClose} 
                         setGlobalTotal={setTotalDailyEntries} 
                       />
                     )}
                     {activeApp === 'tracker' && (
                       <TrackerApp 
                         onClose={handleClose} 
                         generalSW={generalSW} 
                         newTaskSW={newTaskSW} 
                         formatTime={formatTime} 
                         showBubbles={showBubbles}
                         setShowBubbles={setShowBubbles}
                       />
                     )}
                     {activeApp === 'updates' && (
                       <UpdatesApp 
                         onClose={handleClose} 
                         totalSentLinks={totalSentLinks}
                         totalDailyEntry={totalDailyEntries}
                         generalElapsed={generalSW.elapsed}
                         newTaskElapsed={newTaskSW.elapsed}
                       />
                     )}
                     {activeApp === 'snacks' && <SnacksApp onClose={handleClose} />}
                  </motion.div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                     <div className="w-32 h-32 relative mb-4 grayscale opacity-50">
                        <Image src="https://iili.io/FC3KC6g.png" fill className="object-contain" alt="Logo" priority />
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
