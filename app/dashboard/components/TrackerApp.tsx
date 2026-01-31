"use client";
import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw, X, CheckSquare, Flag, CircleDot, Trash2 } from "lucide-react";

interface StopwatchState { startTime: number; elapsed: number; isRunning: boolean; laps: number[]; start: () => void; pause: () => void; reset: () => void; lap: () => void; deleteLap: (index: number) => void; }
interface TrackerAppProps { onClose: () => void; generalSW: StopwatchState; newTaskSW: StopwatchState; formatTime: (ms: number) => string; showBubbles: boolean; toggleBubbles: () => void; }

const getDecimalHours = (ms: number) => { const totalSeconds = Math.floor(ms / 1000); const hours = Math.floor(totalSeconds / 3600); const minutes = Math.floor((totalSeconds % 3600) / 60); const decimal = hours + (minutes / 60); return `${decimal.toFixed(2)}h`; };

const StopwatchDisplay = ({ label, time, elapsed, isRunning, laps, onToggle, onReset, onLap, onDeleteLap, formatTime }: any) => (
  <div className="flex flex-col items-center w-full h-full gap-6">
    {/* Reduced Height: h-[280px], Very Light Accent Color (Orange) */}
    <div className="flex flex-col items-center justify-center bg-orange-50/80 dark:bg-orange-900/10 border border-black/5 dark:border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-sm w-full max-w-2xl h-[280px] shrink-0 transition-all">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white flex items-center gap-3"><div className="w-8 h-8 flex items-center justify-center"><Clock size={28} className="text-orange-500" /></div>{label}<span className="text-lg font-mono text-black dark:text-white ml-2 font-bold opacity-80">{getDecimalHours(elapsed)}</span></h2>
      <div className="text-7xl sm:text-8xl font-mono font-bold text-gray-900 dark:text-white mb-6 tracking-wider tabular-nums w-full text-center select-none drop-shadow-sm">{time}</div>
      <div className="flex gap-6">
        <button onClick={onToggle} className={`p-5 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 border border-black/5 dark:border-white/10 ${isRunning ? 'bg-orange-500 text-white hover:bg-orange-600' : 'bg-green-500 text-white hover:bg-green-600'}`}>{isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}</button>
        <button onClick={isRunning ? onLap : onReset} className={`p-5 rounded-full transition-all shadow-xl hover:scale-105 active:scale-95 border border-black/5 dark:border-white/10 ${isRunning ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-red-500 text-white hover:bg-red-600'}`}>{isRunning ? <Flag size={32} /> : <RotateCcw size={32} />}</button>
      </div>
    </div>
    {laps.length > 0 && (<div className="w-full max-w-2xl h-[200px] shrink-0"><div className="w-full h-full bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-sm overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300"><h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wider text-center sticky top-0 bg-transparent z-10">Laps</h3><div className="overflow-y-auto custom-scrollbar pr-2 flex-1">{laps.map((lapTime: number, index: number) => (<div key={index} className="flex justify-between items-center py-2.5 border-b border-gray-300 dark:border-white/10 last:border-0 text-sm font-mono font-medium text-gray-800 dark:text-gray-200 hover:bg-white/20 dark:hover:bg-white/10 rounded px-2 transition-colors group"><span className="opacity-70 w-16 text-gray-700 dark:text-gray-400">Lap {laps.length - index}</span><span className="flex-1 text-center cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 active:scale-95 transition-all select-none font-bold" onClick={() => navigator.clipboard.writeText(formatTime(lapTime))} title="Click to copy">{formatTime(lapTime)}</span><button onClick={() => onDeleteLap(index)} className="w-8 h-8 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-full transition-all"><X size={16} /></button></div>))}</div></div></div>)}
  </div>
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-gray-300 dark:border-white/20 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-white hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

export default function TrackerApp({ onClose, generalSW, newTaskSW, formatTime, showBubbles, toggleBubbles }: TrackerAppProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'newtask'>('general');
  const [currentDate, setCurrentDate] = useState({ date: '', day: '' });

  useEffect(() => { const saved = localStorage.getItem('tracker_active_tab'); if (saved) setActiveTab(saved as 'general' | 'newtask'); }, []);
  useEffect(() => { localStorage.setItem('tracker_active_tab', activeTab); }, [activeTab]);

  useEffect(() => {
      const now = new Date();
      setCurrentDate({
          date: now.toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }),
          day: now.toLocaleDateString('en-GB', { weekday: 'long' })
      });
  }, []);

  return (
    <div className="h-full flex flex-col relative w-full font-ubuntu gap-4 select-none">
      <div className="flex justify-center items-center gap-4 mb-0 shrink-0 relative min-h-[40px]">
        <button onClick={() => setActiveTab('general')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === 'general' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}><Clock size={16} /> General</button>
        <button onClick={() => setActiveTab('newtask')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === 'newtask' ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}><CheckSquare size={16} /> NewTask</button>
        <CloseButton onClick={onClose} />
      </div>

      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl py-3 px-6 flex items-center justify-between shadow-sm backdrop-blur-md shrink-0 w-full max-w-2xl mx-auto mt-2">
          <div className="flex items-center gap-3 text-gray-800 dark:text-gray-100 text-sm font-bold"><span>Today's Date: {currentDate.date}</span><CircleDot size={6} className="text-gray-400 fill-current" /><span>{currentDate.day}</span></div>
          <div className="h-6 w-px bg-gray-300 dark:bg-white/10 mx-2"></div>
          <div className="flex items-center gap-3 cursor-pointer group" onClick={toggleBubbles}>
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors select-none">Show Stopwatch in Floating Window</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-300 ${showBubbles ? 'bg-green-500' : 'bg-gray-400 dark:bg-gray-600'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${showBubbles ? 'translate-x-5' : 'translate-x-0'}`} /></div>
         </div>
      </div>

      <div className="flex-1 overflow-hidden w-full flex flex-col items-center mt-4">
        {activeTab === 'general' ? (
          <StopwatchDisplay label="Main Stopwatch" time={formatTime(generalSW.elapsed)} elapsed={generalSW.elapsed} isRunning={generalSW.isRunning} laps={generalSW.laps} onToggle={generalSW.isRunning ? generalSW.pause : generalSW.start} onReset={generalSW.reset} onLap={generalSW.lap} onDeleteLap={generalSW.deleteLap} formatTime={formatTime} />
        ) : (
          <StopwatchDisplay label="NT Stopwatch" time={formatTime(newTaskSW.elapsed)} elapsed={newTaskSW.elapsed} isRunning={newTaskSW.isRunning} laps={newTaskSW.laps} onToggle={newTaskSW.isRunning ? newTaskSW.pause : newTaskSW.start} onReset={newTaskSW.reset} onLap={newTaskSW.lap} onDeleteLap={newTaskSW.deleteLap} formatTime={formatTime} />
        )}
      </div>
    </div>
  );
}
