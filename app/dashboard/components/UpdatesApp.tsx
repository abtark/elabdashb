"use client";
import React, { useState, useEffect } from "react";
import { X, RotateCcw, Hourglass, Edit2, Check, Zap, Copy } from "lucide-react";
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
  
  const [otInput, setOtInput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [otCopied, setOtCopied] = useState(false); // Specific for OT button
  const [toggles, setToggles] = useState<ToggleItem[]>([]);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Derived Values
  const otHourValue = otInput ? Math.max(0, mainHourDecimal - parseFloat(otInput)) : 0;
  
  const LABELS: Record<string, string> = {
    cat1: 'LA', cat2: 'FC', cat3: 'FL', cat4: 'Others', cat5: 'Chk Name', cat6: 'Urgent Task'
  };

  useEffect(() => {
      const savedToggles = localStorage.getItem('elab_toggle_items');
      if (savedToggles) {
          const parsed = JSON.parse(savedToggles);
          // Ensure we have 10 items even if loaded from old state
          if (parsed.length < 10) {
              const currentLength = parsed.length;
              const newItems = [];
              for(let i = currentLength + 1; i <= 10; i++) {
                  newItems.push({ id: String(i), label: `Other Task ${i - 4}`, checked: false, editing: false });
              }
              setToggles([...parsed, ...newItems]);
          } else {
              setToggles(parsed);
          }
      } else {
          setToggles([
              { id: '1', label: 'File Drive & Upload', checked: false, editing: false },
              { id: '2', label: 'File Handling', checked: false, editing: false },
              { id: '3', label: 'File Download', checked: false, editing: false },
              { id: '4', label: 'File Check', checked: false, editing: false },
              { id: '5', label: 'Other Task 1', checked: false, editing: false },
              { id: '6', label: 'Other Task 2', checked: false, editing: false },
              { id: '7', label: 'Other Task 3', checked: false, editing: false },
              { id: '8', label: 'Other Task 4', checked: false, editing: false },
              { id: '9', label: 'Other Task 5', checked: false, editing: false },
              { id: '10', label: 'Other Task 6', checked: false, editing: false },
          ]);
      }
      const savedOT = localStorage.getItem('elab_ot_input');
      if (savedOT) setOtInput(savedOT);
  }, []);

  useEffect(() => {
      if (toggles.length > 0) localStorage.setItem('elab_toggle_items', JSON.stringify(toggles));
  }, [toggles]);

  useEffect(() => {
      localStorage.setItem('elab_ot_input', otInput);
  }, [otInput]);

  // RESET SIGNAL: Clears OT Input AND resets toggles
  useEffect(() => {
      if (resetSignal > 0) {
          setOtInput('');
          setToggles(prev => prev.map(t => ({ ...t, checked: false })));
      }
  }, [resetSignal]);

  const handleToggleCheck = (id: string) => {
      setToggles(prev => prev.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
  };

  const handleEditToggle = (id: string) => {
      setToggles(prev => prev.map(t => t.id === id ? { ...t, editing: !t.editing } : t));
  };

  const handleLabelChange = (id: string, newLabel: string) => {
      setToggles(prev => prev.map(t => t.id === id ? { ...t, label: newLabel } : t));
  };

  const generateSummary = () => {
      const parts = [];
      Object.entries(entriesCounts).forEach(([key, val]) => {
          if (val > 0) parts.push(`${LABELS[key]}: ${val}`);
      });
      if (ntHourDecimal > 0) {
          const ntStr = `NewTask ${ntHourDecimal.toFixed(2)}h` + (totalSentLinks > 0 ? ` (${totalSentLinks})` : '');
          parts.push(ntStr);
      } else if (totalSentLinks > 0) {
          parts.push(`NewTask (${totalSentLinks})`);
      }
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

  const handleCopyOT = () => {
     navigator.clipboard.writeText(otHourValue.toFixed(2));
     setOtCopied(true);
     setTimeout(() => setOtCopied(false), 1500);
  };

  return (
    <div className="h-full flex flex-col relative gap-3 w-full px-2 font-ubuntu">
      
      <div className="relative flex justify-center items-center shrink-0 min-h-[40px]">
         <div className="px-6 py-2 rounded-full bg-[#A80038] text-white font-medium text-sm shadow-lg cursor-default flex items-center gap-2">
            <Zap size={16} fill="currentColor" /> ELab Updates
         </div>
         <CloseButton onClick={onClose} />
      </div>

      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 flex justify-between items-center text-xs sm:text-sm font-bold shadow-sm backdrop-blur-md shrink-0">
         <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">Sent Links:</span> 
            <span className="bg-blue-100/50 dark:bg-blue-500/10 px-2 py-0.5 rounded text-blue-600 dark:text-blue-400">{totalSentLinks}</span>
         </div>
         <div className="h-4 w-px bg-gray-300 dark:bg-white/10"></div>
         <div className="flex items-center gap-2">
            <span className="text-gray-600 dark:text-gray-300">Total Entry:</span> 
            <span className="bg-green-100/50 dark:bg-green-500/10 px-2 py-0.5 rounded text-green-600 dark:text-green-400">{totalEntries}</span>
         </div>
         <div className="h-4 w-px bg-gray-300 dark:bg-white/10"></div>
         <button onClick={() => setResetConfirmOpen(true)} className="flex items-center gap-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded-lg transition-colors border border-red-500/20">
            <RotateCcw size={12}/> Reset
         </button>
      </div>

      <div className="flex gap-3 w-full shrink-0">
         <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-center shadow-sm">
            <div className="text-[10px] font-bold mb-1 flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 uppercase tracking-wider"><Hourglass size={10}/> Main Hour</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white tabular-nums">{mainHourDecimal.toFixed(2)}</div>
         </div>
         <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 text-center shadow-sm">
            <div className="text-[10px] font-bold mb-1 flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 uppercase tracking-wider"><Hourglass size={10}/> NewTask Hour</div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white tabular-nums">{ntHourDecimal.toFixed(2)}</div>
         </div>
      </div>

      {/* New OT Section Layout */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-sm gap-4 shrink-0">
         <input 
            type="number" 
            placeholder="General Hour" 
            value={otInput} 
            onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (val >= 0 || e.target.value === '') setOtInput(e.target.value);
            }} 
            className="w-[140px] bg-white/60 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-2 text-center outline-none focus:ring-2 focus:ring-blue-400/50 no-spinner font-medium text-base placeholder:text-xs placeholder:font-normal placeholder:text-gray-400" 
         />
         
         <div className="flex-1 flex flex-col items-center justify-center leading-tight">
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OT Hour</span>
             <span className="text-blue-600 dark:text-blue-400 text-2xl font-bold tabular-nums">{otHourValue.toFixed(2)}</span>
         </div>

         <button 
            onClick={handleCopyOT}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
         >
            {otCopied ? <Check size={16}/> : <Copy size={16}/>}
            {otCopied ? 'Copied' : 'Copy OT'}
         </button>
      </div>

      {/* Toggles: Reduced Height & Spacing, 2 Columns */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-2 flex-1 overflow-y-auto custom-scrollbar p-1 content-start">
         {toggles.map(item => (
            <div 
               key={item.id} 
               className={`group flex justify-between items-center px-3 rounded-xl border transition-all shadow-sm h-9 
                  ${item.checked 
                     ? 'bg-green-100/80 border-green-200 dark:bg-green-900/40 dark:border-green-500/30' 
                     : 'bg-white/40 border-transparent dark:bg-white/5 hover:border-white/30'
                  }
               `}
            >
               <div className="flex items-center gap-2 flex-1 min-w-0">
                   <button onClick={() => handleEditToggle(item.id)} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity">
                       {item.editing ? <Check size={12} className="text-green-500"/> : <Edit2 size={12}/>}
                   </button>
                   {item.editing ? (
                       <input 
                          value={item.label}
                          onChange={(e) => handleLabelChange(item.id, e.target.value)}
                          className="bg-transparent border-b border-blue-500 outline-none w-full text-xs font-medium text-gray-800 dark:text-white"
                          autoFocus
                          onKeyDown={e => e.key === 'Enter' && handleEditToggle(item.id)}
                       />
                   ) : (
                       <span className={`text-xs font-medium truncate select-none ${item.checked ? 'text-green-800 dark:text-green-200 font-bold' : 'text-gray-700 dark:text-gray-200'}`} title={item.label}>{item.label}</span>
                   )}
               </div>
               <div onClick={() => handleToggleCheck(item.id)} className={`cursor-pointer w-8 h-4 rounded-full p-0.5 flex items-center shadow-inner transition-colors duration-300 ${item.checked ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <motion.div initial={false} animate={{ x: item.checked ? 16 : 0 }} transition={{ type: "spring", stiffness: 700, damping: 30 }} className="w-3 h-3 bg-white rounded-full shadow-sm" />
               </div>
            </div>
         ))}
      </div>

      <div className="relative shrink-0">
        <div onClick={handleCopy} className={`bg-white/60 dark:bg-black/40 border border-white/30 dark:border-white/10 rounded-2xl p-4 text-center transition-all duration-300 shadow-sm min-h-[80px] flex flex-col justify-center items-center ${isCopyable ? 'cursor-pointer hover:bg-white/80 dark:hover:bg-white/10' : 'cursor-not-allowed opacity-70'} ${copied ? 'bg-green-100/80 dark:bg-green-900/30 border-green-500/50 scale-[1.02]' : ''}`}>
            <div className="font-medium text-sm text-gray-800 dark:text-gray-200 break-words leading-relaxed select-none w-full">
                {displayText}
            </div>
        </div>
        <AnimatePresence>
            {copied && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute bottom-2 left-0 right-0 text-center pointer-events-none">
                    <span className="text-[10px] uppercase font-bold text-green-600 dark:text-green-400 bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-full shadow-sm">Copied to clipboard!</span>
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      <ConfirmModal isOpen={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)} onConfirm={onGlobalReset} message="Reset ALL data (Entries, Links, Updates)?" />
    </div>
  );
}
