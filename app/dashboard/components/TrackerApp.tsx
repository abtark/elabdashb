"use client";
import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

// Reusable Stopwatch Component
const Stopwatch = ({ id, label }: { id: string, label: string }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => setTime((t) => t + 10), 10);
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
    <div className="flex flex-col items-center justify-center bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-sm w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
        <Clock size={24} className="text-orange-500" /> {label}
      </h2>
      <div className="text-5xl font-mono font-bold text-gray-800 dark:text-white mb-8 tracking-wider">
        {format(time)}
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => setIsRunning(!isRunning)} 
          className={`p-4 rounded-full transition-all shadow-lg ${isRunning ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white' : 'bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'}`}
        >
          {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
        </button>
        <button 
          onClick={() => { setIsRunning(false); setTime(0); }} 
          className="p-4 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
        >
          <RotateCcw size={32} />
        </button>
      </div>
    </div>
  );
};

export default function TrackerApp({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'general' | 'newtask'>('general');

  return (
    <div className="h-full flex flex-col relative">
      {/* Header Menu */}
      <div className="flex justify-center items-center gap-4 mb-4 shrink-0 relative">
        <button onClick={() => setActiveTab('general')} className={`px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'general' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          General
        </button>
        <button onClick={() => setActiveTab('newtask')} className={`px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'newtask' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          NewTask
        </button>

        {/* Close Button Top Right of Sub-Menu */}
        <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2 group relative w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm">
          <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-black/60 leading-none">x</span>
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex items-center justify-center">
        {activeTab === 'general' ? (
          <Stopwatch id="general" label="G. Stopwatch" />
        ) : (
          <Stopwatch id="newtask" label="NT Stopwatch" />
        )}
      </div>
    </div>
  );
}
