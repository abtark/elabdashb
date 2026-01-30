"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, RotateCcw, Copy, Hourglass, Edit2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface UpdatesAppProps {
  onClose: () => void;
  totalSentLinks: number;
  entriesCounts: Record<string, number>;
  generalElapsed: number;
  newTaskElapsed: number;
  onGlobalReset: () => void;
}

interface ToggleItem {
  id: string;
  label: string;
  checked: boolean;
  editing: boolean;
}

// --- UTILS ---
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

// --- MAIN COMPONENT ---
export default function UpdatesApp({ 
  onClose, totalSentLinks, entriesCounts, generalElapsed, newTaskElapsed, onGlobalReset 
}: UpdatesAppProps) {
  
  // Local State
  const [otInput, setOtInput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  
  // Toggles State with Persistence
  const [toggles, setToggles] = useState<ToggleItem[]>([]);

  // Derived Values
  const mainHour = generalElapsed / 3600000;
  const ntHour = newTaskElapsed / 3600000;
  const otHour = Math.max(0, mainHour - (parseFloat(otInput) || 0));
  
  // Entries Labels (Must match EntriesApp keys)
  const LABELS: Record<string, string> = {
    cat1: 'LA', cat2: 'FC', cat3: 'FL', cat4: 'Others', cat5: 'Chk Name', cat6: 'Urgent Task'
  };

  // --- INITIALIZATION ---
  useEffect(() => {
      const savedToggles = localStorage.getItem('elab_toggle_items');
      if (savedToggles) {
          setToggles(JSON.parse(savedToggles));
      } else {
          setToggles([
              { id: '1', label: 'File Drive & Upload', checked: false, editing: false },
              { id: '2', label: 'File Handling', checked: false, editing: false },
              { id: '3', label: 'File Download', checked: false, editing: false },
              { id: '4', label: 'File Check', checked: false, editing: false },
          ]);
      }
  }, []);

  useEffect(() => {
      if (toggles.length > 0) localStorage.setItem('elab_toggle_items', JSON.stringify(toggles));
  }, [toggles]);

  // --- HANDLERS ---
  const handleToggleCheck = (id: string) => {
      setToggles(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const handleEditToggle = (id: string) => {
      setToggles(prev => prev.map(t => t.id === id ? { ...t, editing: !t.editing } : t));
  };

  const handleLabelChange = (id: string, newLabel: string) => {
      setToggles(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
  };

  // --- SUMMARY GENERATION ---
  const generateSummary = () => {
      const parts = [];

      // 1. Entries
      Object.entries(entriesCounts).forEach(([key, val]) => {
          if (val > 0) parts.push(`${LABELS[key]}: ${val}`);
      });

      // 2. New Task Hour
      if (ntHour > 0) {
          const ntStr = `NewTask ${ntHour.toFixed(2)}h` + (totalSentLinks > 0 ? ` (${totalSentLinks})` : '');
          parts.push(ntStr);
      } else if (totalSentLinks > 0) {
          parts.push(`NewTask (${totalSentLinks})`);
      }

      // 3. Toggles
      const activeToggles = toggles.filter(t => t.checked).map(t => t.label);
      if (activeToggles.length > 0) {
          parts.push(`[${activeToggles.join(', ')}]`);
      }

      return parts.join(', ');
  };

  const summaryText = generateSummary() || "No updates available.";
  const totalEntries = Object.values(entriesCounts).reduce((a,b)=>a+b,0);

  const handleCopy = () => {
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-full flex flex-col relative gap-4 w-full px-2 font-ubuntu">
      
      {/* 1. Header (Red Background) */}
      <div className="relative flex justify-center items-center shrink-0 min-h-[40px]">
         <div className="px-6 py-2 rounded-full bg-[#A80038] text-white font-medium text-sm shadow-lg cursor-default">
            ELab Updates
         </div>
         <CloseButton onClick={onClose} />
      </div>

      {/* 2. Top Stats Bar */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 flex justify-between items-center text-sm font-bold shadow-sm backdrop-blur-md shrink-0">
         <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">Total Sent Links:</span> 
            <span className="bg-blue-100/50 dark:bg-blue-500/10 px-3 py-1 rounded text-blue-600 dark:text-blue-400">{totalSentLinks}</span>
         </div>
         <div className="h-4 w-px bg-gray-300 dark:bg-white/10"></div>
         <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">Today's Total Entry:</span> 
            <span className="bg-green-100/50 dark:bg-green-500/10 px-3 py-1 rounded text-green-600 dark:text-green-400">{totalEntries}</span>
         </div>
         <div className="h-4 w-px bg-gray-300 dark:bg-white/10"></div>
         <button 
            onClick={onGlobalReset}
            className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors"
         >
            <RotateCcw size={14}/> Reset
         </button>
      </div>

      {/* 3. Hours Row */}
      <div className="flex gap-4 w-full">
         <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-xs font-bold mb-2 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider"><Hourglass size={12}/> Main Hour</div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white tabular-nums">{mainHour.toFixed(2)}</div>
         </div>
         <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-xs font-bold mb-2 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider"><Hourglass size={12}/> NewTask Hour</div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white tabular-nums">{ntHour.toFixed(2)}</div>
         </div>
      </div>

      {/* 4. OT Hour Row */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
         <input 
            type="number" 
            placeholder="Enter General Hour" 
            value={otInput} 
            onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val >= 0 || e.target.value === '') setOtInput(e.target.value);
            }} 
            className="flex-1 bg-white/60 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-full px-6 py-2 text-center outline-none focus:ring-2 focus:ring-blue-400/50 no-spinner font-medium text-lg" 
         />
         <div className="font-bold text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap flex items-center gap-2">
             OT Hour 
             <span className="text-blue-600 dark:text-blue-400 text-2xl tabular-nums">{otHour.toFixed(2)}</span>
         </div>
      </div>

      {/* 5. Toggles Grid */}
      <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto custom-scrollbar p-1">
         {toggles.map(item => (
            <div key={item.id} className="group flex justify-between items-center p-3 rounded-xl border border-transparent bg-white/40 dark:bg-white/5 hover:border-white/30 transition-all shadow-sm">
               
               <div className="flex items-center gap-2 flex-1 min-w-0">
                   {/* Edit Button (Hover) */}
                   <button onClick={() => handleEditToggle(item.id)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                       {item.editing ? <Check size={14} className="text-green-500"/> : <Edit2 size={14}/>}
                   </button>
                   
                   {item.editing ? (
                       <input 
                          value={item.label}
                          onChange={(e) => handleLabelChange(item.id, e.target.value)}
                          className="bg-transparent border-b border-blue-500 outline-none w-full text-sm font-medium"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleEditToggle(item.id)}
                       />
                   ) : (
                       <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate select-none" title={item.label}>{item.label}</span>
                   )}
               </div>

               {/* Toggle Switch */}
               <div onClick={() => handleToggleCheck(item.id)} className={`cursor-pointer w-10 h-5 rounded-full p-0.5 flex items-center shadow-inner transition-colors duration-300 ${item.checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <motion.div 
                    initial={false}
                    animate={{ x: item.checked ? 20 : 0 }}
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className="w-4 h-4 bg-white rounded-full shadow-sm"
                  />
               </div>
            </div>
         ))}
      </div>

      {/* 6. Summary Box */}
      <div 
        onClick={handleCopy}
        className={`bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-2xl p-4 text-center cursor-pointer transition-all duration-300 shadow-sm shrink-0
            ${copied ? 'bg-green-100/80 dark:bg-green-900/30 scale-[1.02]' : 'hover:bg-white/80 dark:hover:bg-white/10'}
        `}
      >
         <div className="font-medium text-sm text-gray-800 dark:text-gray-200 break-words leading-relaxed select-none">
            {summaryText}
         </div>
         {copied && <div className="text-xs text-green-600 dark:text-green-400 font-bold mt-2 animate-pulse">Copied to clipboard!</div>}
      </div>
    </div>
  );
}
