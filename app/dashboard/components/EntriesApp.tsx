"use client";

import React, { useState, useEffect } from "react";
import { X, Check, RotateCcw, History, Edit3, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

// ... (Keep existing Types, CategoryConfig, Modal, ConfirmModal from previous version) ...
type CategoryKey = 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5' | 'cat6';
// ... 

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

export default function EntriesApp({ onClose, setGlobalTotal }: { onClose: () => void, setGlobalTotal: (n: number) => void }) {
  // ... (Keep existing state logic: counts, labels, logs, inputs, persistence) ...
  // Note: ensure setGlobalTotal(getTotal()) is called inside useEffect when counts change.

  // MOCK STATE SETUP FOR DISPLAY (Replace with full logic from previous turn)
  const [counts, setCounts] = useState({cat1:0,cat2:0,cat3:0,cat4:0,cat5:0,cat6:0});
  const [labels, setLabels] = useState({cat1:'LA',cat2:'FC',cat3:'FL',cat4:'Others',cat5:'Chk Name',cat6:'Urgent'});
  const getTotal = () => Object.values(counts).reduce((a,b)=>a+b,0);
  
  useEffect(() => { setGlobalTotal(getTotal()); }, [counts]);

  return (
    <div className="h-full flex flex-col relative gap-4 max-w-[95%] mx-auto">
      {/* Top Bar */}
      <div className="relative flex justify-center items-center mb-0 shrink-0 select-none min-h-[40px]">
         <div className="flex items-center gap-3">
            <span className="font-bold text-gray-700 dark:text-gray-300">Today's Total Entry</span>
            <div className="bg-blue-100/50 dark:bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-lg font-bold text-lg text-center min-w-[60px]">{getTotal()}</div>
            <button className="flex items-center gap-1 bg-white/20 border border-blue-500/30 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold"><History size={14}/> Logs</button>
            <button className="flex items-center gap-1 bg-red-50/50 border border-red-500/30 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold"><RotateCcw size={14}/> Reset!</button>
         </div>
         <CloseButton onClick={onClose} />
      </div>

      {/* Summary Section (2 Rows) */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-sm backdrop-blur-md">
         <div className="grid grid-cols-3 gap-2 mb-2">
            {['cat1','cat2','cat3'].map(k => (
               <div key={k} className="flex flex-col items-center p-2 bg-blue-50/50 dark:bg-white/5 rounded-xl border border-blue-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{labels[k]}</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{counts[k]}</span>
               </div>
            ))}
         </div>
         <div className="grid grid-cols-3 gap-2">
            {['cat4','cat5','cat6'].map(k => (
               <div key={k} className="flex flex-col items-center p-2 bg-blue-50/50 dark:bg-white/5 rounded-xl border border-blue-100 dark:border-white/5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase">{labels[k]}</span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">{counts[k]}</span>
               </div>
            ))}
         </div>
      </div>

      {/* Input Grid */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-sm backdrop-blur-md flex-1 overflow-y-auto">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {Object.keys(labels).map((key) => (
               <div key={key} className="flex items-center gap-2">
                  <button className="p-2 text-gray-400 hover:text-blue-500"><Edit3 size={16}/></button>
                  <input type="number" placeholder={`Enter ${labels[key]} Entry`} className="w-full bg-white/70 dark:bg-white/5 border border-white/30 rounded-full py-2 px-4 text-center text-sm outline-none focus:ring-2 focus:ring-blue-400/50" />
                  <button className="p-1.5 rounded-full border border-green-500/50 text-green-600 hover:bg-green-50"><CheckCircle2 size={24}/></button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
