"use client";

import React, { useState, useEffect } from "react";
import { X, Check, RotateCcw, History, Edit3, Plus, Table, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

type CategoryKey = 'cat1' | 'cat2' | 'cat3' | 'cat4' | 'cat5' | 'cat6';
interface DailyLog { id: number; catKey: CategoryKey; value: number; time: string; date: string; }
interface CategoryConfig { key: CategoryKey; }
const CATEGORIES: CategoryConfig[] = [{ key: 'cat1' }, { key: 'cat2' }, { key: 'cat3' }, { key: 'cat4' }, { key: 'cat5' }, { key: 'cat6' }];
const DEFAULT_LABELS: Record<CategoryKey, string> = { cat1: 'LA', cat2: 'FC', cat3: 'FL', cat4: 'Others', cat5: 'Chk Name', cat6: 'Urgent Task' };

interface EntriesAppProps { onClose: () => void; counts: Record<string, number>; setCounts: React.Dispatch<React.SetStateAction<Record<string, number>>>; resetSignal: number; }

const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-gray-300 dark:border-white/20 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-white hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

const Modal = ({ isOpen, onClose, title, children }: any) => { if (!isOpen) return null; return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"><motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-white dark:bg-gray-900 border border-white/20 rounded-2xl w-full max-w-md p-6 shadow-2xl relative"><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold dark:text-white">{title}</h3><button onClick={onClose}><X size={20}/></button></div>{children}</motion.div></div>; };
const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: any) => { if (!isOpen) return null; return <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"><motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="bg-white dark:bg-gray-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center"><h3 className="text-lg font-bold dark:text-white mb-2">Confirmation</h3><p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p><div className="flex justify-center gap-4"><button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-800 font-medium">No</button><button onClick={() => { onConfirm(); onClose(); }} className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium">Yes</button></div></motion.div></div>; };

export default function EntriesApp({ onClose, counts, setCounts, resetSignal }: EntriesAppProps) {
  const [labels, setLabels] = useState<Record<CategoryKey, string>>(DEFAULT_LABELS);
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [inputs, setInputs] = useState<Record<CategoryKey, string>>({ cat1: '', cat2: '', cat3: '', cat4: '', cat5: '', cat6: '' });
  
  const [showLogs, setShowLogs] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<CategoryKey | null>(null);
  const [editLabelValue, setEditLabelValue] = useState("");
  const [addedAnimation, setAddedAnimation] = useState<CategoryKey | null>(null);

  useEffect(() => { if (resetSignal > 0) setLogs([]); }, [resetSignal]);

  useEffect(() => {
    const savedLabels = localStorage.getItem('dailyEntryLabels');
    const savedLogs = localStorage.getItem('dailyEntryLogs');
    const savedCounts = localStorage.getItem('dailyEntryCounts'); 
    const savedInputs = localStorage.getItem('dailyEntryInputs'); // Draft inputs
    if (savedLabels) setLabels(JSON.parse(savedLabels));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    if (savedCounts) setCounts(JSON.parse(savedCounts));
    if (savedInputs) setInputs(JSON.parse(savedInputs));
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyEntryCounts', JSON.stringify(counts));
    localStorage.setItem('dailyEntryLabels', JSON.stringify(labels));
    localStorage.setItem('dailyEntryLogs', JSON.stringify(logs));
    localStorage.setItem('dailyEntryInputs', JSON.stringify(inputs)); // Save draft inputs
  }, [counts, labels, logs, inputs]);

  const getTotal = () => Object.values(counts).reduce((a, b) => a + b, 0);

  const handleAdd = (key: CategoryKey) => {
    const val = parseInt(inputs[key]);
    if (!isNaN(val) && val !== 0) {
      const now = new Date();
      setCounts(prev => ({ ...prev, [key]: prev[key] + val }));
      setLogs(prev => [...prev, { id: Date.now(), catKey: key, value: val, time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }), date: now.toLocaleDateString('en-GB') }]);
      setInputs(prev => ({ ...prev, [key]: '' }));
      setAddedAnimation(key);
      setTimeout(() => setAddedAnimation(null), 300);
    }
  };

  const handleReset = () => { setCounts({ cat1: 0, cat2: 0, cat3: 0, cat4: 0, cat5: 0, cat6: 0 }); setLogs([]); };
  const deleteLog = (logId: number, catKey: CategoryKey, val: number) => { setLogs(prev => prev.filter(l => l.id !== logId)); setCounts(prev => ({ ...prev, [catKey]: prev[catKey] - val })); };
  const startEditLabel = (key: CategoryKey) => { setEditingKey(key); setEditLabelValue(labels[key]); };
  const saveEditLabel = () => { if (editingKey && editLabelValue.trim()) { setLabels(prev => ({ ...prev, [editingKey]: editLabelValue.trim() })); setEditingKey(null); } };

  return (
    <div className="h-full flex flex-col relative gap-4 w-full px-2 font-ubuntu select-none">
      <div className="relative flex justify-center items-center shrink-0 min-h-[40px]">
         <div className="px-6 py-2 rounded-full bg-green-500 text-white font-medium text-sm shadow-lg shadow-green-500/20 cursor-default flex items-center gap-2"><Table size={16} /> Count Entries</div>
         <CloseButton onClick={onClose} />
      </div>

      <div className="flex justify-between items-center bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-4 shadow-sm backdrop-blur-md shrink-0">
         <div className="flex items-center gap-3"><span className="font-bold text-gray-700 dark:text-gray-300 text-sm">Today's Total Entries:</span><div className="h-10 flex items-center justify-center bg-green-100/50 dark:bg-green-500/10 border border-green-500/30 text-[#22C55E] dark:text-green-400 px-10 rounded-lg font-bold text-lg min-w-[80px]">{getTotal()}</div></div>
         <div className="flex gap-3"><button onClick={() => setShowLogs(true)} className="h-10 flex items-center gap-1 bg-white dark:bg-white/5 border border-green-500/30 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/20 px-5 rounded-lg text-xs font-bold transition-all shadow-sm"><History size={14}/> Logs</button><button onClick={() => setResetConfirmOpen(true)} className="h-10 flex items-center gap-1 bg-red-50/50 dark:bg-red-500/10 border border-red-500/30 text-red-600 hover:bg-red-100 dark:hover:bg-red-500/30 px-5 rounded-lg text-xs font-bold transition-all shadow-sm"><RotateCcw size={14}/> Reset!</button></div>
      </div>

      <div className="bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-3 shadow-sm backdrop-blur-md shrink-0">
         <div className="grid grid-cols-3 gap-3 mb-3">{['cat1','cat2','cat3'].map(k => (<div key={k} className="flex flex-col items-center p-3 bg-green-50/50 dark:bg-white/5 rounded-xl border border-green-100 dark:border-white/5 shadow-sm"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{labels[k as CategoryKey]}</span><span className="text-xl font-bold text-[#22C55E] dark:text-green-400">{counts[k as CategoryKey]}</span></div>))}</div>
         <div className="grid grid-cols-3 gap-3">{['cat4','cat5','cat6'].map(k => (<div key={k} className="flex flex-col items-center p-3 bg-green-50/50 dark:bg-white/5 rounded-xl border border-green-100 dark:border-white/5 shadow-sm"><span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{labels[k as CategoryKey]}</span><span className="text-xl font-bold text-[#22C55E] dark:text-green-400">{counts[k as CategoryKey]}</span></div>))}</div>
      </div>

      <div className="flex-1 bg-white/40 dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-2xl p-5 shadow-sm backdrop-blur-md flex flex-col justify-center gap-4">
         <div className="text-center flex flex-col items-center opacity-70"><span className="text-sm font-bold text-gray-600 dark:text-gray-300">Enter Entries Below</span><ChevronDown size={16} className="text-gray-500 dark:text-gray-400 mt-1" /></div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {CATEGORIES.map((cat) => (
               <div key={cat.key} className="group flex items-center gap-4 bg-white/60 dark:bg-white/5 p-1 rounded-xl border border-transparent hover:border-gray-300 dark:hover:border-white/30 transition-all">
                  <button onClick={() => startEditLabel(cat.key)} className="p-2 text-gray-400 hover:text-green-500 opacity-0 group-hover:opacity-100 transition-all"><Edit3 size={16}/></button>
                  <div className="flex-1 relative">
                    {editingKey === cat.key ? (<div className="flex gap-2"><input value={editLabelValue} onChange={(e) => setEditLabelValue(e.target.value)} className="w-full bg-white dark:bg-black border border-green-500 rounded-lg px-3 py-2 text-sm outline-none" autoFocus /><button onClick={saveEditLabel} className="bg-green-500 text-white p-2 rounded-lg"><Check size={16}/></button></div>) : (<input type="number" value={inputs[cat.key]} onChange={(e) => setInputs(prev => ({ ...prev, [cat.key]: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && handleAdd(cat.key)} className="w-full bg-white dark:bg-black/20 border border-gray-200 dark:border-white/10 rounded-lg py-3 px-4 text-center text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-400/50 no-spinner text-base font-medium" placeholder={`${labels[cat.key]} Entry`} />)}
                  </div>
                  <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleAdd(cat.key)} className={`p-3 rounded-xl border transition-all duration-200 shadow-sm flex items-center justify-center min-w-[44px] ${addedAnimation === cat.key ? 'bg-green-500 border-green-500 text-white' : 'bg-white dark:bg-white/10 border-gray-200 dark:border-white/10 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-500/20'}`}>{addedAnimation === cat.key ? <Check size={20} /> : <Plus size={20} strokeWidth={3} />}</motion.button>
               </div>
            ))}
         </div>
      </div>
      <Modal isOpen={showLogs} onClose={() => setShowLogs(false)} title="Daily Entry Logs"><div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar pr-1">{logs.length === 0 ? <p className="text-center opacity-50 italic">No logs yet.</p> : [...logs].reverse().map(log => (<div key={log.id} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-2.5 rounded-lg border text-sm"><span className="text-gray-600 dark:text-gray-300">{log.value > 0 ? 'Added' : 'Removed'} <b className={log.value > 0 ? "text-green-600" : "text-red-600"}>{Math.abs(log.value)}</b> to <span className="font-semibold">{labels[log.catKey]}</span> ({log.time})</span><button onClick={() => deleteLog(log.id, log.catKey, log.value)} className="text-red-400 hover:text-red-500"><X size={12}/></button></div>))}</div></Modal>
      <ConfirmModal isOpen={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)} onConfirm={handleReset} message="Reset all daily entries and logs?" />
    </div>
  );
}
