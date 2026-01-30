"use client";
import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw, X, CheckSquare, Flag, CircleDot, Calendar } from "lucide-react";

// --- TYPES ---
interface StopwatchState {
  startTime: number;
  elapsed: number;
  isRunning: boolean;
  laps: number[]; // Added laps
  start: () => void;
  pause: () => void;
  reset: () => void;
  lap: () => void; // Added lap function
}

interface TrackerAppProps {
  onClose: () => void;
  generalSW: StopwatchState;
  newTaskSW: StopwatchState;
  formatTime: (ms: number) => string;
  showBubbles: boolean;
  toggleBubbles: () => void;
}

// --- STOPWATCH COMPONENT ---
const StopwatchDisplay = ({ 
  label, time, isRunning, laps, onToggle, onReset, onLap, formatTime 
}: { 
  label: string, time: string, isRunning: boolean, laps: number[], onToggle: () => void, onReset: () => void, onLap: () => void, formatTime: (ms: number) => string
}) => (
  <div className="flex flex-col items-center w-full h-full">
    {/* Timer Circle/Display */}
    <div className="flex flex-col items-center justify-center bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-sm w-full max-w-2xl mx-auto flex-1 mb-4">
      <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-white flex items-center gap-3">
        <Clock size={28} className="text-orange-500" /> {label}
      </h2>
      <div className="text-7xl sm:text-8xl font-mono font-bold text-gray-800 dark:text-white mb-10 tracking-wider tabular-nums">
        {time}
      </div>
      
      {/* Controls */}
      <div className="flex gap-6">
        <button 
          onClick={onToggle} 
          className={`p-6 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 ${isRunning ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-green-500 text-white hover:bg-green-600'}`}
        >
          {isRunning ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
        </button>
        
        <button 
          onClick={isRunning ? onLap : onReset} 
          className={`p-6 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 ${isRunning ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-red-500 text-white hover:bg-red-600'}`}
        >
          {isRunning ? <Flag size={40} /> : <RotateCcw size={40} />}
        </button>
      </div>
    </div>

    {/* Laps List */}
    {laps.length > 0 && (
        <div className="w-full max-w-2xl bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-sm overflow-hidden flex-shrink-0 max-h-[200px] flex flex-col">
            <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider text-center">Laps</h3>
            <div className="overflow-y-auto custom-scrollbar pr-2 flex-1">
                {laps.map((lapTime, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-white/10 last:border-0 text-sm font-mono font-medium text-gray-700 dark:text-gray-200">
                        <span>Lap {laps.length - index}</span>
                        <span>{formatTime(lapTime)}</span>
                    </div>
                ))}
            </div>
        </div>
    )}
  </div>
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

export default function TrackerApp({ onClose, generalSW, newTaskSW, formatTime, showBubbles, toggleBubbles }: TrackerAppProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'newtask'>('general');
  const [currentDate, setCurrentDate] = useState({ date: '', day: '' });

  useEffect(() => {
      const now = new Date();
      setCurrentDate({
          date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
          day: now.toLocaleDateString('en-GB', { weekday: 'long' })
      });
  }, []);

  return (
    <div className="h-full flex flex-col relative w-full font-ubuntu">
      
      {/* 1. Header Menu */}
      <div className="flex justify-center items-center gap-4 mb-3 shrink-0 relative min-h-[40px]">
        <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === 'general' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
            <Clock size={16} /> General
        </button>
        <button onClick={() => setActiveTab('newtask')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === 'newtask' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
            <CheckSquare size={16} /> NewTask
        </button>
        <CloseButton onClick={onClose} />
      </div>

      {/* 2. Date Display Section */}
      <div className="flex justify-center mb-3">
          <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-xl py-2 px-6 flex items-center gap-3 shadow-sm backdrop-blur-md text-gray-700 dark:text-gray-200 text-sm font-semibold">
              <span>Today's Date: {currentDate.date}</span>
              <CircleDot size={8} className="text-gray-400 fill-current" />
              <span>{currentDate.day}</span>
          </div>
      </div>

      {/* 3. Floating Window Toggle Section */}
      <div className="flex justify-center mb-4">
         <div className="bg-white/30 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-full px-6 py-2 flex items-center gap-4 cursor-pointer hover:bg-white/40 dark:hover:bg-white/10 transition-colors" onClick={toggleBubbles}>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 select-none">Show Stopwatch in Floating Window</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${showBubbles ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}>
               <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${showBubbles ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
         </div>
      </div>

      {/* 4. Main Content (Full Width) */}
      <div className="flex-1 overflow-hidden w-full flex flex-col items-center">
        {activeTab === 'general' ? (
          <StopwatchDisplay 
            label="Main Stopwatch" 
            time={formatTime(generalSW.elapsed)} 
            isRunning={generalSW.isRunning} 
            laps={generalSW.laps}
            onToggle={generalSW.isRunning ? generalSW.pause : generalSW.start} 
            onReset={generalSW.reset} 
            onLap={generalSW.lap}
            formatTime={formatTime}
          />
        ) : (
          <StopwatchDisplay 
            label="NT Stopwatch" 
            time={formatTime(newTaskSW.elapsed)} 
            isRunning={newTaskSW.isRunning} 
            laps={newTaskSW.laps}
            onToggle={newTaskSW.isRunning ? newTaskSW.pause : newTaskSW.start} 
            onReset={newTaskSW.reset} 
            onLap={newTaskSW.lap}
            formatTime={formatTime}
          />
        )}
      </div>
    </div>
  );
}
