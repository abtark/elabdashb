"use client";
import React, { useState } from "react";
import { Clock, Play, Pause, RotateCcw, X } from "lucide-react";

// ... (StopwatchDisplay component same as before) ...
const StopwatchDisplay = ({ label, time, isRunning, onToggle, onReset }: any) => (
  <div className="flex flex-col items-center justify-center bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-8 backdrop-blur-md shadow-sm w-full max-w-md mx-auto">
    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-white flex items-center gap-2"><Clock size={24} className="text-orange-500" /> {label}</h2>
    <div className="text-5xl font-mono font-bold text-gray-800 dark:text-white mb-8 tracking-wider">{time}</div>
    <div className="flex gap-4">
      <button onClick={onToggle} className={`p-4 rounded-full shadow-lg ${isRunning ? 'bg-orange-500 text-white' : 'bg-green-500/20 text-green-500'}`}>{isRunning ? <Pause size={32} fill="currentColor"/> : <Play size={32} fill="currentColor"/>}</button>
      <button onClick={onReset} className="p-4 rounded-full bg-red-500/20 text-red-500"><RotateCcw size={32}/></button>
    </div>
  </div>
);

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

export default function TrackerApp({ onClose, generalSW, newTaskSW, formatTime, showBubbles, setShowBubbles }: any) {
  const [activeTab, setActiveTab] = useState<'general' | 'newtask'>('general');

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-center items-center gap-4 mb-4 shrink-0 relative">
        <button onClick={() => setActiveTab('general')} className={`px-6 py-2 rounded-full text-sm font-medium border ${activeTab === 'general' ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400'}`}>General</button>
        <button onClick={() => setActiveTab('newtask')} className={`px-6 py-2 rounded-full text-sm font-medium border ${activeTab === 'newtask' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400'}`}>NewTask</button>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex justify-center mb-6">
         <label className="flex items-center gap-3 cursor-pointer bg-white/10 px-4 py-2 rounded-full border border-white/10">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Show Stopwatch in Floating Window</span>
            <div className={`w-10 h-5 rounded-full p-0.5 transition-colors ${showBubbles ? 'bg-green-500' : 'bg-gray-400'}`} onClick={() => setShowBubbles(!showBubbles)}>
               <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${showBubbles ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
         </label>
      </div>

      <div className="flex-1 flex items-center justify-center">
        {activeTab === 'general' ? <StopwatchDisplay label="G. Stopwatch" time={formatTime(generalSW.elapsed)} isRunning={generalSW.isRunning} onToggle={generalSW.isRunning ? generalSW.pause : generalSW.start} onReset={generalSW.reset} /> 
        : <StopwatchDisplay label="NT Stopwatch" time={formatTime(newTaskSW.elapsed)} isRunning={newTaskSW.isRunning} onToggle={newTaskSW.isRunning ? newTaskSW.pause : newTaskSW.start} onReset={newTaskSW.reset} />}
      </div>
    </div>
  );
}
