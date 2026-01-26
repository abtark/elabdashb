"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Check, RotateCcw, History, Edit3, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";

// --- Types ---
type CategoryKey = 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5' | 'cat6';

interface DailyLog {
  id: number;
  catKey: CategoryKey;
  value: number;
  time: string;
  date: string;
}

interface CategoryConfig {
  key: CategoryKey;
  defaultLabel: string;
}

const CATEGORIES: CategoryConfig[] = [
  { key: 'cat1', defaultLabel: 'LA' },
  { key: 'cat2', defaultLabel: 'FC' },
  { key: 'cat3', defaultLabel: 'FL' },
  { key: 'cat4', defaultLabel: 'Others' },
  { key: 'cat5', defaultLabel: 'Chk Name' },
  { key: 'cat6', defaultLabel: 'Urgent Task' },
];

// --- MODAL COMPONENT (Reusable) ---
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 border border-white/20 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-500 dark:text-gray-400 hover:opacity-100" /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; message: string }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"
      >
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
export default function EntriesApp({ onClose }: { onClose: () => void }) {
  // State
  const [counts, setCounts] = useState<Record<CategoryKey, number>>({
    cat1: 0, cat2: 0, cat3: 0, cat4: 0, cat5: 0, cat6: 0
  });
  
  const [labels, setLabels] = useState<Record<CategoryKey, string>>({
    cat1: 'LA', cat2: 'FC', cat3: 'FL', cat4: 'Others', cat5: 'Chk Name', cat6: 'Urgent Task'
  });

  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [inputs, setInputs] = useState<Record<CategoryKey, string>>({
    cat1: '', cat2: '', cat3: '', cat4: '', cat5: '', cat6: ''
  });

  // UI State
  const [showLogs, setShowLogs] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<CategoryKey | null>(null);
  const [editLabelValue, setEditLabelValue] = useState("");
  const [addedAnimation, setAddedAnimation] = useState<CategoryKey | null>(null);

  // Persistence
  useEffect(() => {
    const savedCounts = localStorage.getItem('dailyEntryCounts');
    const savedLabels = localStorage.getItem('dailyEntryLabels');
    const savedLogs = localStorage.getItem('dailyEntryLogs');

    if (savedCounts) setCounts(JSON.parse(savedCounts));
    if (savedLabels) setLabels(JSON.parse(savedLabels));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyEntryCounts', JSON.stringify(counts));
    localStorage.setItem('dailyEntryLabels', JSON.stringify(labels));
    localStorage.setItem('dailyEntryLogs', JSON.stringify(logs));
  }, [counts, labels, logs]);

  // Handlers
  const getTotal = () => Object.values(counts).reduce((a, b) => a + b, 0);

  const handleAdd = (key: CategoryKey) => {
    const val = parseInt(inputs[key]);
    if (!isNaN(val) && val > 0) {
      const now = new Date();
      
      // Update Count
      setCounts(prev => ({ ...prev, [key]: prev[key] + val }));
      
      // Add Log
      setLogs(prev => [...prev, {
        id: Date.now(),
        catKey: key,
        value: val,
        time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
        date: now.toLocaleDateString('en-GB')
      }]);
      
      // Reset Input & Animate
      setInputs(prev => ({ ...prev, [key]: '' }));
      setAddedAnimation(key);
      setTimeout(() => setAddedAnimation(null), 1000);
    }
  };

  const handleReset = () => {
    setCounts({ cat1: 0, cat2: 0, cat3: 0, cat4: 0, cat5: 0, cat6: 0 });
    setLogs([]);
  };

  const deleteLog = (logId: number, catKey: CategoryKey, val: number) => {
    setLogs(prev => prev.filter(l => l.id !== logId));
    setCounts(prev => ({ ...prev, [catKey]: Math.max(0, prev[catKey] - val) }));
  };

  const startEditLabel = (key: CategoryKey) => {
    setEditingKey(key);
    setEditLabelValue(labels[key]);
  };

  const saveEditLabel = () => {
    if (editingKey && editLabelValue.trim()) {
      setLabels(prev => ({ ...prev, [editingKey]: editLabelValue.trim() }));
      setEditingKey(null);
    }
  };

  return (
    <div className="h-full flex flex-col relative gap-4 max-w-[95%] mx-auto">
      
      {/* 1. Top Bar: Total + Controls */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 flex items-center justify-between shadow-sm backdrop-blur-md">
        
        {/* Total Badge */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-gray-700 dark:text-gray-300 text-sm sm:text-base">Today's Total Entry</span>
          <div className="bg-blue-100/50 dark:bg-blue-500/10 border border-blue-500/30 text-blue-700 dark:text-blue-300 px-4 py-1 rounded-lg font-bold min-w-[50px] text-center">
            {getTotal()}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
           <button onClick={() => setShowLogs(true)} className="flex items-center gap-1.5 bg-white dark:bg-white/5 border border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-xs transition-all">
             <History size={14} /> Logs
           </button>
           <button onClick={() => setResetConfirmOpen(true)} className="flex items-center gap-1.5 bg-red-50 dark:bg-red-500/10 border border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-full font-bold text-xs transition-all">
             <RotateCcw size={14} /> Reset!
           </button>
        </div>

        {/* Close (If in SubMenu mode) */}
        <button 
          onClick={onClose} 
          className="absolute -top-3 -right-3 sm:static sm:hidden group w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center shadow-md z-50"
        >
          <X size={12} className="text-white" />
        </button>
      </div>

      {/* 2. Summary Section (6 items in one line) */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-2 shadow-sm backdrop-blur-md overflow-x-auto custom-scrollbar">
        <div className="flex items-center justify-between min-w-[600px] gap-2">
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="flex flex-col items-center justify-center flex-1 min-w-[80px] p-2 bg-blue-50/50 dark:bg-white/5 rounded-xl border border-blue-100 dark:border-white/5">
              <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 mb-1 truncate w-full text-center" title={labels[cat.key]}>
                {labels[cat.key]}
              </span>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                {counts[cat.key]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Input Grid */}
      <div className="bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-4 shadow-sm backdrop-blur-md flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          
          {CATEGORIES.map((cat) => (
            <div key={cat.key} className="flex items-center gap-2 group">
              
              {/* Edit Button (Left) */}
              <button 
                onClick={() => startEditLabel(cat.key)} 
                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                title="Edit Label"
              >
                <Edit3 size={16} />
              </button>

              {/* Input Area */}
              <div className="flex-1 relative">
                {editingKey === cat.key ? (
                   // Label Editor Mode
                   <div className="flex gap-2">
                      <input 
                        value={editLabelValue}
                        onChange={(e) => setEditLabelValue(e.target.value)}
                        className="w-full bg-white dark:bg-black border border-blue-500 rounded-full px-4 py-2 text-sm outline-none shadow-sm"
                        autoFocus
                        placeholder="Rename category..."
                      />
                      <button onClick={saveEditLabel} className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"><Check size={16}/></button>
                   </div>
                ) : (
                   // Number Input Mode
                   <input 
                    type="number"
                    value={inputs[cat.key]}
                    onChange={(e) => setInputs(prev => ({ ...prev, [cat.key]: e.target.value }))}
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd(cat.key)}
                    className="w-full bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 rounded-full py-2 px-4 text-center text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-400/50 transition-all placeholder:text-gray-400 no-spinner text-sm font-medium shadow-sm"
                    placeholder={`Enter ${labels[cat.key]}`}
                  />
                )}
              </div>

              {/* Add Button (Right) */}
              <button 
                onClick={() => handleAdd(cat.key)}
                className={`p-1.5 rounded-full border transition-all duration-300 shadow-sm
                  ${addedAnimation === cat.key 
                    ? 'bg-green-500 border-green-500 text-white scale-110' 
                    : 'bg-white dark:bg-white/10 border-green-500/50 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/20'
                  }
                `}
              >
                {addedAnimation === cat.key ? <Check size={20} /> : <CheckCircle2 size={24} strokeWidth={1.5} />}
              </button>

            </div>
          ))}

        </div>
      </div>

      {/* --- Modals --- */}
      
      {/* Logs Modal */}
      <Modal isOpen={showLogs} onClose={() => setShowLogs(false)} title="Daily Entry Logs">
        <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-1">
          {logs.length === 0 ? (
            <p className="text-center opacity-50 text-gray-500 dark:text-gray-400 italic">No logs yet.</p>
          ) : (
            [...logs].reverse().map(log => (
              <div key={log.id} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2.5 rounded-lg border border-gray-100 dark:border-white/5 text-sm group">
                <span className="text-gray-600 dark:text-gray-300">
                  Added <b className="text-blue-600 dark:text-blue-400">{log.value}</b> to <span className="font-semibold">{labels[log.catKey]}</span> <span className="text-xs opacity-60 ml-1">({log.time})</span>
                </span>
                <button 
                  onClick={() => deleteLog(log.id, log.catKey, log.value)} 
                  className="w-6 h-6 flex items-center justify-center rounded-full border border-red-200 text-red-400 hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all opacity-60 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Reset Confirmation */}
      <ConfirmModal 
        isOpen={resetConfirmOpen} 
        onClose={() => setResetConfirmOpen(false)} 
        onConfirm={handleReset} 
        message="Are you sure you want to reset all daily entries and logs?" 
      />

    </div>
  );
}
