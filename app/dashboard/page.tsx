"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  CheckSquare, Table, Clock, Zap, Coffee, Sun, Moon, 
  Play, Pause, Compass, LogOut 
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import NewTaskApp from "./components/NewTaskApp";
import EntriesApp from "./components/EntriesApp";
import TrackerApp from "./components/TrackerApp";
import UpdatesApp from "./components/UpdatesApp";
import SnacksApp from "./components/SnacksApp";

const useStopwatch = (id: string) => {
  const [state, setState] = useState({ startTime: 0, elapsed: 0, isRunning: false, laps: [] as number[] });
  useEffect(() => { const saved = localStorage.getItem(`stopwatch_${id}`); if (saved) { const parsed = JSON.parse(saved); if (parsed.isRunning) { const now = Date.now(); const additionalTime = now - parsed.lastTick; setState({ startTime: parsed.startTime, elapsed: parsed.elapsed + additionalTime, isRunning: true, laps: parsed.laps || [] }); } else { setState({ ...parsed, laps: parsed.laps || [] }); } } }, [id]);
  useEffect(() => { let interval: NodeJS.Timeout; if (state.isRunning) { localStorage.setItem(`stopwatch_${id}`, JSON.stringify({ ...state, lastTick: Date.now() })); interval = setInterval(() => { setState(prev => { const newState = { ...prev, elapsed: Date.now() - prev.startTime }; localStorage.setItem(`stopwatch_${id}`, JSON.stringify({ ...newState, lastTick: Date.now() })); return newState; }); }, 1000); } else { localStorage.setItem(`stopwatch_${id}`, JSON.stringify({ ...state, lastTick: Date.now() })); } return () => clearInterval(interval); }, [state.isRunning, state.startTime, id, state.laps]);
  const start = () => { if (!state.isRunning) { setState(prev => ({ ...prev, startTime: Date.now() - prev.elapsed, isRunning: true })); } };
  const pause = () => { if (state.isRunning) { setState(prev => ({ ...prev, isRunning: false })); } };
  const reset = () => { setState({ startTime: 0, elapsed: 0, isRunning: false, laps: [] }); localStorage.removeItem(`stopwatch_${id}`); };
  const lap = () => { const currentTotal = state.elapsed + (state.isRunning ? (Date.now() - state.startTime) - state.elapsed : 0); setState(prev => ({ ...prev, laps: [currentTotal, ...prev.laps] })); };
  const deleteLap = (index: number) => { setState(prev => { const newLaps = prev.laps.filter((_, i) => i !== index); return { ...prev, laps: newLaps }; }); };
  return { ...state, start, pause, reset, lap, deleteLap };
};

const MiniStopwatch = ({ label, time, isRunning, onToggle, bottomOffset, visible }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => { if (!isRunning) setIsExpanded(false); }, [isRunning]);
  if (!visible) return null;
  return (
    <div className={`fixed right-4 z-[9990] transition-all duration-300 flex items-center justify-end gap-2 ${bottomOffset}`}>
      <AnimatePresence>
        {(isExpanded || isRunning) && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="bg-white/90 dark:bg-black/80 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-full pl-4 pr-1 py-1 shadow-xl flex items-center gap-3">
            <div className="flex flex-col leading-none"><span className="text-[10px] uppercase font-bold text-gray-500">{label}</span><span className="font-mono font-bold text-gray-800 dark:text-white">{time}</span></div>
          </motion.div>
        )}
      </AnimatePresence>
      <button onClick={() => { if (isRunning) onToggle(); else { setIsExpanded(!isExpanded); if(!isExpanded) onToggle(); } }} className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all border ${isRunning ? 'bg-orange-500 border-orange-600 text-white animate-pulse' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-green-500 hover:scale-110'}`}>{isRunning ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1" />}</button>
    </div>
  );
};

const DigitalClock = () => {
    const [time, setTime] = useState<string>("");
    const [date, setDate] = useState<string>("");
    useEffect(() => {
        const update = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('en-GB', { hour12: false }));
            const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
            const dayStr = now.toLocaleDateString('en-GB', { weekday: 'long' });
            setDate(`${dateStr}, ${dayStr}`);
        };
        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="flex flex-col items-center justify-center gap-4 text-center animate-fade-in select-none">
             <div className="text-6xl md:text-8xl font-mono font-bold text-gray-800 dark:text-white tracking-widest tabular-nums drop-shadow-sm">{time || "--:--:--"}</div>
             <div className="text-xl md:text-3xl font-medium text-gray-500 dark:text-gray-400">{date || "Loading..."}</div>
        </div>
    );
};

export default function DashboardPage() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  // Auth Loading State
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [totalSentLinks, setTotalSentLinks] = useState(0);
  const [entriesCounts, setEntriesCounts] = useState<Record<string, number>>({ cat1: 0, cat2: 0, cat3: 0, cat4: 0, cat5: 0, cat6: 0 });
  const [showBubbles, setShowBubbles] = useState(false);
  const [resetSignal, setResetSignal] = useState(0);
  const generalSW = useStopwatch('general');
  const newTaskSW = useStopwatch('newtask');

  useEffect(() => {
      // 1. Protection Logic
      const handleContext = (e: Event) => e.preventDefault();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.ctrlKey && e.key === 'u')) {
          e.preventDefault();
        }
      };
      window.addEventListener('contextmenu', handleContext);
      window.addEventListener('keydown', handleKeyDown);

      // 2. Auth Check
      const isAuth = localStorage.getItem("isAuthenticated");
      if (isAuth !== "true") {
        router.push("/");
      } else {
        setIsAuthChecking(false);
        setIsClient(true);
      }

      // 3. Load State
      const savedApp = localStorage.getItem('dashboard_active_app');
      if (savedApp) setActiveApp(savedApp);
      const savedBubbles = localStorage.getItem('show_stopwatch_bubbles');
      const savedLinks = localStorage.getItem('global_total_sent_links');
      const savedEntries = localStorage.getItem('global_entries_counts');
      if (savedBubbles) setShowBubbles(JSON.parse(savedBubbles));
      if (savedLinks) setTotalSentLinks(JSON.parse(savedLinks));
      if (savedEntries) setEntriesCounts(JSON.parse(savedEntries));

      return () => {
        window.removeEventListener('contextmenu', handleContext);
        window.removeEventListener('keydown', handleKeyDown);
      };
  }, [router]);

  useEffect(() => { if (isClient) { if(activeApp) localStorage.setItem('dashboard_active_app', activeApp); else localStorage.removeItem('dashboard_active_app'); } }, [activeApp, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('global_total_sent_links', JSON.stringify(totalSentLinks)); }, [totalSentLinks, isClient]);
  useEffect(() => { if (isClient) localStorage.setItem('global_entries_counts', JSON.stringify(entriesCounts)); }, [entriesCounts, isClient]);

  const toggleBubbles = () => { const newState = !showBubbles; setShowBubbles(newState); localStorage.setItem('show_stopwatch_bubbles', JSON.stringify(newState)); };
  const handleGlobalReset = () => {
      setTotalSentLinks(0);
      setEntriesCounts({ cat1: 0, cat2: 0, cat3: 0, cat4: 0, cat5: 0, cat6: 0 });
      generalSW.reset(); newTaskSW.reset(); 
      localStorage.removeItem('global_total_sent_links'); localStorage.removeItem('global_entries_counts'); localStorage.removeItem('dailyEntryLogs'); localStorage.removeItem('dailyEntryCounts'); localStorage.removeItem('nt_self_sent_links_logs'); 
      setResetSignal(prev => prev + 1); 
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  const formatTime = (ms: number) => { const s = Math.floor(ms / 1000); const m = Math.floor(s / 60); const h = Math.floor(m / 60); return `${h.toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`; };
  const getHourDecimal = (ms: number) => { const totalMinutes = Math.floor(ms / 60000); const hours = Math.floor(totalMinutes / 60); const minutes = totalMinutes % 60; return hours + (minutes / 60); };

  const menuItems = [
    { id: 'newtask', icon: Compass, label: 'NewTask Updates', color: 'text-[#0B66C3]', bgColor: 'bg-[#0B66C3]' },
    { id: 'entries', icon: Table, label: 'Daily Entry Counts', color: 'text-green-500', bgColor: 'bg-green-500' },
    { id: 'tracker', icon: Clock, label: 'Tracker', color: 'text-orange-500', bgColor: 'bg-orange-500' },
    { id: 'updates', icon: Zap, label: 'Updates', color: 'text-[#18B0FE]', bgColor: 'bg-[#18B0FE]' },
    { id: 'snacks', icon: Coffee, label: 'Food & Beverage', color: 'text-[#9E2A3A]', bgColor: 'bg-[#9E2A3A]' },
  ];

  const handleClose = () => { setActiveApp(null); localStorage.removeItem('dashboard_active_app'); };

  const activeItem = menuItems.find(i => i.id === activeApp);
  const headingColor = activeItem ? activeItem.color : "text-gray-800 dark:text-white";

  // While checking auth, show nothing or simple background
  if (isAuthChecking) return null;

  return (
    <>
      <style jsx global>{`
        .no-spinner::-webkit-inner-spin-button, .no-spinner::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .no-spinner { -moz-appearance: textfield; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(100,100,100,0.3); border-radius: 10px; }
      `}</style>

      <MiniStopwatch label="Main" time={formatTime(generalSW.elapsed)} isRunning={generalSW.isRunning} onToggle={generalSW.isRunning ? generalSW.pause : generalSW.start} bottomOffset="bottom-20" visible={showBubbles} />
      <MiniStopwatch label="NewTask" time={formatTime(newTaskSW.elapsed)} isRunning={newTaskSW.isRunning} onToggle={newTaskSW.isRunning ? newTaskSW.pause : newTaskSW.start} bottomOffset="bottom-4" visible={showBubbles} />

      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-500 font-ubuntu select-none">
        
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

        <motion.div layout className="relative z-10 w-full max-w-[950px] h-[95vh] max-h-[850px] bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-white/20 dark:border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]">
          
          <div className="flex items-center justify-between px-6 py-1 shrink-0 select-none">
            <h1 className={`text-xl font-bold tracking-tight opacity-90 ml-2 transition-colors duration-300 ${headingColor}`}>
               {activeItem ? activeItem.label : "EntryLab Dashboard"}
            </h1>
            <div className="flex items-center gap-4">
               {/* Fixed Static Logo */}
               <div className="relative w-28 h-28 drop-shadow-2xl pointer-events-none">
                  <Image src="https://iili.io/FC3KC6g.png" alt="Logo" fill className="object-contain" priority draggable={false} />
               </div>
               
               <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/40 transition-colors text-gray-800 dark:text-white">
                 {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
               </button>
               {/* Logout Button */}
               <button onClick={handleLogout} className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors" title="Logout">
                 <LogOut size={18} />
               </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden relative">
            <Sidebar menuItems={menuItems} activeApp={activeApp} setActiveApp={setActiveApp} />

            <div className="flex-1 relative overflow-hidden bg-white/10 dark:bg-transparent backdrop-blur-md">
              <AnimatePresence mode="wait">
                {activeApp ? (
                  <motion.div key={activeApp} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.02 }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="h-full w-full flex flex-col p-6 pt-6">
                     {activeApp === 'newtask' && <NewTaskApp onClose={handleClose} totalSentLinks={totalSentLinks} setTotalSentLinks={setTotalSentLinks} resetSignal={resetSignal} />}
                     {activeApp === 'entries' && <EntriesApp onClose={handleClose} counts={entriesCounts} setCounts={setEntriesCounts} resetSignal={resetSignal} />}
                     {activeApp === 'tracker' && <TrackerApp onClose={handleClose} generalSW={generalSW} newTaskSW={newTaskSW} formatTime={formatTime} showBubbles={showBubbles} toggleBubbles={toggleBubbles} />}
                     {activeApp === 'updates' && <UpdatesApp onClose={handleClose} totalSentLinks={totalSentLinks} entriesCounts={entriesCounts} mainHourDecimal={getHourDecimal(generalSW.elapsed)} ntHourDecimal={getHourDecimal(newTaskSW.elapsed)} onGlobalReset={handleGlobalReset} resetSignal={resetSignal} />}
                     {activeApp === 'snacks' && <SnacksApp onClose={handleClose} />}
                  </motion.div>
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-center p-8">
                     <DigitalClock />
                     <p className="mt-8 text-gray-500 dark:text-gray-400 font-light text-sm">Select an application from the sidebar to begin.</p>
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
