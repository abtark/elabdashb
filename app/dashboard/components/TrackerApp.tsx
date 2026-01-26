"use client";
import React, { useState } from "react";
import { Clock, Play, Pause, RotateCcw, X } from "lucide-react";

// Types derived from the hook in page.tsx
interface StopwatchState {
  startTime: number;
  elapsed: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

interface TrackerAppProps {
  onClose: () => void;
  generalSW: StopwatchState;
  newTaskSW: StopwatchState;
  formatTime: (ms: number) => string;
}

const StopwatchDisplay = ({ 
  label, time, isRunning, onToggle, onReset 
}: { 
  label: string, time: string, isRunning: boolean, onToggle: () => void, onReset: () => void 
}) => (
  <div className="flex flex-col items-center justify-center bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-sm w-full max-w-md mx-auto">
    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2">
      <Clock size={24} className="text-orange-500" /> {label}
    </h2>
    <div className="text-5xl font-mono font-bold text-gray-800 dark:text-white mb-8 tracking-wider">
      {time}
    </div>
    <div className="flex gap-4">
      <button 
        onClick={onToggle} 
        className={`p-4 rounded-full transition-all shadow-lg ${isRunning ? 'bg-orange-500/20 text-orange-500 hover:bg-orange-500 hover:text-white' : 'bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white'}`}
      >
        {isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
      </button>
      <button 
        onClick={onReset} 
        className="p-4 rounded-full bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-lg"
      >
        <RotateCcw size={32} />
      </button>
    </div>
  </div>
);

export default function TrackerApp({ onClose, generalSW, newTaskSW, formatTime }: TrackerAppProps) {
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

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md ml-4"
        >
          Close <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden flex items-center justify-center">
        {activeTab === 'general' ? (
          <StopwatchDisplay 
            label="G. Stopwatch" 
            time={formatTime(generalSW.elapsed)} 
            isRunning={generalSW.isRunning} 
            onToggle={generalSW.isRunning ? generalSW.pause : generalSW.start} 
            onReset={generalSW.reset} 
          />
        ) : (
          <StopwatchDisplay 
            label="NT Stopwatch" 
            time={formatTime(newTaskSW.elapsed)} 
            isRunning={newTaskSW.isRunning} 
            onToggle={newTaskSW.isRunning ? newTaskSW.pause : newTaskSW.start} 
            onReset={newTaskSW.reset} 
          />
        )}
      </div>
    </div>
  );
}
