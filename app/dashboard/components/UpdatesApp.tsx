"use client";
import React, { useState, useEffect } from "react";
import { X, RotateCcw, Hourglass, Edit2, Check, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface UpdatesAppProps {
  onClose: () => void;
  totalSentLinks: number;
  entriesCounts: Record<string, number>;
  mainHourDecimal: number;
  ntHourDecimal: number;
  onGlobalReset: () => void;
  resetSignal: number;
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

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="bg-white dark:bg-gray-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">Confirmation</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">No</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors">Yes</button>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function UpdatesApp({ 
  onClose, totalSentLinks, entriesCounts, mainHourDecimal, ntHourDecimal, onGlobalReset, resetSignal 
}: UpdatesAppProps) {
  
  // Local State
  const [otInput, setOtInput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [toggles, setToggles] = useState<ToggleItem[]>([]);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Derived Values
  const otHourValue = Math.max(0, mainHourDecimal - (parseFloat(otInput) || 0));
  
  const LABELS: Record<string, string> = {
    cat1: 'LA', cat2: 'FC', cat3: 'FL', cat4: 'Others', cat5: 'Chk Name', cat6: 'Urgent Task'
  };

  // --- INITIALIZATION & PERSISTENCE ---
  useEffect(() => {
      // Load Toggles
      const savedToggles = localStorage.getItem('elab_toggle_items');
      if (savedToggles) {
          setToggles(JSON.parse(savedToggles));
      } else {
          // Default 6 items
          setToggles([
              { id: '1', label: 'File Drive & Upload', checked: false, editing: false },
              { id: '2', label: 'File Handling', checked: false, editing: false },
              { id: '3', label: 'File Download', checked: false, editing: false },
              { id: '4', label: 'File Check', checked: false, editing: false },
              { id: '5', label: 'Other Task 1', checked: false, editing: false },
              { id: '6', label: 'Other Task 2', checked: false, editing: false },
          ]);
      }

      // Load OT Input
      const savedOT = localStorage.getItem('elab_ot_input');
      if (savedOT) setOtInput(savedOT);
  }, []);

  useEffect(() => {
      if (toggles.length > 0) localStorage.setItem('elab_toggle_items', JSON.stringify(toggles));
  }, [toggles]);

  useEffect(() => {
      localStorage.setItem('elab_ot_input', otInput);
  }, [otInput]);

  // Handle Global Reset Signal locally
  useEffect(() => {
      if (resetSignal > 0) {
          setOtInput('');
          // Optional: Reset toggles? Usually toggles might remain, but inputs clear.
          // Let's clear OT input only as it's a daily value.
      }
  }, [resetSignal]);

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
      if (ntHourDecimal > 0) {
          const ntStr = `NewTask ${ntHourDecimal.toFixed(2)}h` + (totalSentLinks > 0 ? ` (${totalSentLinks})` : '');
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

  const summaryText = generateSummary(); 
  const displayText = summaryText || "No updates available.";
  const isCopyable = summaryText.length > 0;
  
  const totalEntries = Object.values(entriesCounts).reduce((a,b)=>a+b,0);

  const handleCopy = () => {
      if (!isCopyable) return;
      navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="h-full flex flex-col relative gap-4 w-full px-2 font-ubuntu">
      
      {/* 1. Header (Red Background, Icon) */}
      <div className="relative flex justify-center items-center shrink-0 min-h-[40px]">
         <div className="px-6 py-2 rounded-full bg-[#A80038] text-white font-medium text-sm shadow-lg cursor-default flex items-center gap-2">
            <Zap size={16} fill="currentColor" /> ELab Updates
         </div>
         <CloseButton onClick={onClose} />
      </div>

      {/* 2. Top Stats Bar with Reset */}
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
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20"
         >
            <RotateCcw size={14}/> Reset
         </button>
      </div>

      {/* 3. Hours Row */}
      <div className="flex gap-4 w-full">
         <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-xs font-bold mb-2 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider"><Hourglass size={12}/> Main Hour</div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white tabular-nums">{mainHourDecimal.toFixed(2)}</div>
         </div>
         <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 text-center shadow-sm">
            <div className="text-xs font-bold mb-2 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider"><Hourglass size={12}/> NewTask Hour</div>
            <div className="text-3xl font-bold text-gray-800 dark:text-white tabular-nums">{ntHourDecimal.toFixed(2)}</div>
         </div>
      </div>

      {/* 4. OT Hour Row */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
         {/* Wider Input Box */}
         <input 
            type="number" 
            placeholder="Enter General Hour" 
            value={otInput} 
            onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val >= 0 || e.target.value === '') setOtInput(e.target.value);
            }} 
            className="w-48 bg-white/60 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-full px-6 py-2 text-center outline-none focus:ring-2 focus:ring-blue-400/50 no-spinner font-medium text-lg placeholder:text-sm placeholder:font-normal" 
         />
         <div className="font-bold text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap flex items-center gap-2 ml-auto">
             OT HOUR
             <span className="text-blue-600 dark:text-blue-400 text-2xl tabular-nums">{otHourValue.toFixed(2)}</span>
         </div>
      </div>

      {/* 5. Toggles Grid (6 Items) */}
      <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto custom-scrollbar p-1">
         {toggles.map(item => (
            // Small Height (py-1.5)
            <div key={item.id} className="group flex justify-between items-center px-3 py-1.5 rounded-xl border border-transparent bg-white/40 dark:bg-white/5 hover:border-white/30 transition-all shadow-sm">
               
               <div className="flex items-center gap-2 flex-1 min-w-0">
                   <button onClick={() => handleEditToggle(item.id)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                       {item.editing ? <Check size={14} className="text-green-500"/> : <Edit2 size={14}/>}
                   </button>
                   
                   {item.editing ? (
                       <input 
                          value={item.label}
                          onChange={(e) => handleLabelChange(item.id, e.target.value)}
                          className="bg-transparent border-b border-blue-500 outline-none w-full text-xs font-medium"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleEditToggle(item.id)}
                       />
                   ) : (
                       <span className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate select-none" title={item.label}>{item.label}</span>
                   )}
               </div>

               <div onClick={() => handleToggleCheck(item.id)} className={`cursor-pointer w-8 h-4 rounded-full p-0.5 flex items-center shadow-inner transition-colors duration-300 ${item.checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <motion.div 
                    initial={false}
                    animate={{ x: item.checked ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 700, damping: 30 }}
                    className="w-3 h-3 bg-white rounded-full shadow-sm"
                  />
               </div>
            </div>
         ))}
      </div>

      {/* 6. Summary Box */}
      <div className="relative">
        <div 
            onClick={handleCopy}
            className={`bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-2xl p-4 text-center transition-all duration-300 shadow-sm shrink-0 min-h-[80px] flex flex-col justify-center items-center
                ${isCopyable ? 'cursor-pointer hover:bg-white/80 dark:hover:bg-white/10' : 'cursor-not-allowed opacity-70'}
                ${copied ? 'bg-green-100/80 dark:bg-green-900/30 border-green-500/50 scale-[1.02]' : ''}
            `}
        >
            <div className="font-medium text-sm text-gray-800 dark:text-gray-200 break-words leading-relaxed select-none w-full">
                {displayText}
            </div>
        </div>
        
        <AnimatePresence>
            {copied && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="absolute bottom-2 left-0 right-0 text-center pointer-events-none"
                >
                    <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-full shadow-sm">
                        Copied to clipboard!
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <ConfirmModal 
        isOpen={resetConfirmOpen} 
        onClose={() => setResetConfirmOpen(false)} 
        onConfirm={onGlobalReset} 
        message="Reset ALL daily progress across Dashboard (Entries, Links, Updates)?" 
      />
    </div>
  );
}
