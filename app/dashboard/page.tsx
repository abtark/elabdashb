"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { 
  LogOut, Moon, Sun, Edit3, X, Maximize2, Minimize2, 
  CheckSquare, Table, Clock, Zap, Coffee, User, Building, Play, Pause, RotateCcw
} from "lucide-react";

// --- Types & Interfaces ---
type AppType = 'newtask' | 'entries' | 'tracker' | 'updates' | 'snacks';
type TabType = 'self' | 'office';

// --- MOCK LOGIC COMPONENTS (Migrated from HTML) ---

// 1. SNACKS COMPONENT
const SnacksApp = ({ isEditMode }: { isEditMode: boolean }) => {
  const [persons, setPersons] = useState([
    { id: 1, name: 'Naimul Hasnat', checked: false },
    { id: 2, name: 'Nazmul Alam', checked: false },
    { id: 3, name: 'Tawhid Jihad', checked: false },
    { id: 4, name: 'Tariqul Rizvi', checked: false },
    { id: 5, name: 'Shahed Evan', checked: false },
    // Add rest from list...
  ]);

  const togglePerson = (id: number) => {
    setPersons(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  const total = persons.length;
  const notTaking = persons.filter(p => p.checked).length;

  return (
    <div className="h-full flex flex-col p-4 overflow-y-auto">
      <div className="flex justify-between mb-6 bg-white/10 dark:bg-black/20 p-4 rounded-xl">
        <div className="text-center"><div className="text-xs opacity-70">Total</div><div className="text-xl font-bold text-blue-500">{total}</div></div>
        <div className="text-center"><div className="text-xs opacity-70">No Snack</div><div className="text-xl font-bold text-red-500">{notTaking}</div></div>
        <div className="text-center"><div className="text-xs opacity-70">Taking</div><div className="text-xl font-bold text-green-500">{total - notTaking}</div></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {persons.map(p => (
          <div key={p.id} onClick={() => togglePerson(p.id)} className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${p.checked ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
            <span className="text-sm font-medium">{p.name}</span>
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${p.checked ? 'bg-red-500' : 'bg-gray-600'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${p.checked ? 'translate-x-4' : ''}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 2. TRACKER COMPONENT (Stopwatch)
const TrackerApp = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime(t => t + 10), 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const format = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    return `${h.toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-6xl md:text-8xl font-thin font-mono tracking-wider">{format(time)}</div>
      <div className="flex gap-4">
        <button onClick={() => setIsRunning(!isRunning)} className="p-4 rounded-full bg-blue-500/20 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
          {isRunning ? <Pause size={32} /> : <Play size={32} />}
        </button>
        <button onClick={() => { setIsRunning(false); setTime(0); }} className="p-4 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all">
          <RotateCcw size={32} />
        </button>
      </div>
    </div>
  );
};

// 3. NEW TASK COMPONENT
const NewTaskApp = () => {
  const [activeTab, setActiveTab] = useState<TabType>('self');
  
  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-center gap-4 mb-6">
        <button onClick={() => setActiveTab('self')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'self' ? 'bg-blue-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
          <User size={16} /> Self
        </button>
        <button onClick={() => setActiveTab('office')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all ${activeTab === 'office' ? 'bg-purple-600 text-white' : 'bg-white/5 hover:bg-white/10'}`}>
          <Building size={16} /> Office
        </button>
      </div>
      
      <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/10 overflow-y-auto">
        {activeTab === 'self' ? (
           <div className="space-y-6">
             <div className="flex gap-4 items-center">
               <input type="number" placeholder="Enter Sent Links" className="bg-transparent border-b border-white/20 p-2 outline-none w-full" />
               <button className="bg-blue-500 p-2 rounded-lg text-white"><CheckSquare size={18} /></button>
             </div>
             <div className="text-center text-sm opacity-60">Log system waiting for integration...</div>
           </div>
        ) : (
          <div className="text-center space-y-4">
             <h3 className="text-xl font-bold">Office Targets</h3>
             <div className="h-40 bg-white/5 rounded-xl flex items-center justify-center">Chart JS Area</div>
          </div>
        )}
      </div>
    </div>
  );
};


// --- MAIN DASHBOARD PAGE ---

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeApp, setActiveApp] = useState<AppType | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const menuItems = [
    { id: 'newtask', icon: CheckSquare, label: 'NewTask', color: 'text-blue-400' },
    { id: 'entries', icon: Table, label: 'Count Entries', color: 'text-green-400' },
    { id: 'tracker', icon: Clock, label: 'Tracker', color: 'text-orange-400' },
    { id: 'updates', icon: Zap, label: 'Updates', color: 'text-yellow-400' },
    { id: 'snacks', icon: Coffee, label: 'F & B', color: 'text-pink-400' },
  ];

  const handleClose = () => { setActiveApp(null); setIsMaximized(false); };
  const handleMaximize = () => setIsMaximized(true);
  const handleMinimize = () => setIsMaximized(false); // Returns to dashboard view

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-100 dark:bg-[#050505] transition-colors duration-500">
      
      {/* 1. Animated Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-10 left-[20%] w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 left-[30%] w-80 h-80 bg-pink-500/30 rounded-full blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* 2. Glass Container */}
      <motion.div 
        layout
        className={`relative z-10 w-full max-w-[750px] transition-all duration-500 ease-spring
          ${isMaximized ? 'fixed inset-4 max-w-none max-h-none h-auto' : 'h-[95vh] max-h-[800px]'}
          glass-panel rounded-3xl flex flex-col overflow-hidden
        `}
      >
        
        {/* --- Header Bar --- */}
        <div className="flex items-center justify-between p-6 pb-2 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-ubuntu font-bold tracking-tight">
               {activeApp ? menuItems.find(i => i.id === activeApp)?.label : "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4 relative">
             {/* Logo & Edit Mode Toggle */}
            <div 
              className="relative cursor-pointer group" 
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <motion.div 
                animate={{ x: isEditMode ? -30 : 0 }}
                className="relative z-20"
              >
                <Image src="https://iili.io/FC3KC6g.png" alt="Logo" width={40} height={40} />
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isEditMode ? 1 : 0, x: isEditMode ? 0 : 10 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500 z-10"
              >
                <Edit3 size={20} />
              </motion.div>
            </div>

            {/* Theme Toggle */}
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full bg-black/5 dark:bg-white/10 hover:bg-black/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* --- Main Layout: Sidebar + Content --- */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Sidebar Menu (Left) */}
          <div className="w-20 flex flex-col items-center py-8 gap-8 border-r border-white/10 bg-white/5 shrink-0 z-20 backdrop-blur-md">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeApp === item.id;
              
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveApp(item.id as AppType)}
                  className={`relative group p-3 rounded-2xl transition-all duration-300
                    ${isActive ? 'bg-white/20 dark:bg-white/10 shadow-lg scale-110' : 'hover:bg-white/10'}
                  `}
                >
                  <Icon size={24} className={`${isActive ? item.color : 'text-gray-500 dark:text-gray-400'}`} />
                  
                  {/* Tooltip */}
                  <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.label}
                  </span>
                  
                  {/* Active Indicator */}
                  {isActive && <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r-full" />}
                </button>
              )
            })}

            <div className="mt-auto">
               <Link href="/" className="p-3 block rounded-2xl hover:bg-red-500/10 text-red-500 transition-colors">
                  <LogOut size={24} />
               </Link>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 relative overflow-hidden bg-white/30 dark:bg-black/20">
            <AnimatePresence mode="wait">
              {activeApp ? (
                <motion.div 
                  key={activeApp}
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="h-full w-full flex flex-col"
                >
                  {/* Mac Window Controls */}
                  <div className="flex items-center gap-2 p-4 border-b border-white/10 bg-white/5">
                    <button onClick={handleClose} className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors" title="Close" />
                    <button onClick={handleMinimize} className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors" title="Minimize" />
                    <button onClick={handleMaximize} className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors" title="Maximize" />
                  </div>

                  {/* App Content */}
                  <div className="flex-1 overflow-auto p-4 md:p-8">
                     {activeApp === 'snacks' && <SnacksApp isEditMode={isEditMode} />}
                     {activeApp === 'tracker' && <TrackerApp />}
                     {activeApp === 'newtask' && <NewTaskApp />}
                     {activeApp === 'entries' && (
                       <div className="flex items-center justify-center h-full text-white/50">Daily Entry Logic Here</div>
                     )}
                     {activeApp === 'updates' && (
                       <div className="flex items-center justify-center h-full text-white/50">Elab Updates Logic Here</div>
                     )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-8">
                   <div className="w-24 h-24 mb-6 relative opacity-20">
                      <Image src="https://iili.io/FC3KC6g.png" fill className="object-contain grayscale" alt="Watermark" />
                   </div>
                   <h2 className="text-2xl font-light opacity-50">Welcome to Emanistation</h2>
                   <p className="opacity-30 text-sm mt-2">Select an app from the sidebar to begin.</p>
                </div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>

      {/* 3. Backdrop Blur for Maximize Mode */}
      {isMaximized && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
        />
      )}
    </div>
  );
}
