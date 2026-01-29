"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Check, RotateCcw, History, Compass, 
  Plus, Trash2, ChevronLeft, ChevronRight, CheckSquare, Edit3,
  User, Building, Link as LinkIcon, ArrowRight, ArrowLeft, Search, Clock, Loader2, AlertCircle
} from "lucide-react";
import { FaDiscord } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES ---
interface EmailItem {
  id: string;
  text: string;
  copied: boolean;
  selected: boolean;
}

// --- UTILS ---
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

const Modal = ({ isOpen, onClose, title, children }: any) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 rounded-3xl">
      <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-white dark:bg-gray-900 border border-white/20 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800 dark:text-white">{title}</h3>
          <button onClick={onClose}><X size={20} className="text-gray-500 dark:text-gray-400 hover:opacity-100" /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 rounded-3xl">
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

// New Alert Modal for replacing browser alert()
const AlertModal = ({ isOpen, onClose, message }: any) => {
  if (!isOpen) return null;
  return (
    <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 rounded-3xl">
      <motion.div initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} className="bg-white dark:bg-gray-900 border border-white/20 rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center flex flex-col items-center gap-4">
        <AlertCircle size={48} className="text-orange-500" />
        <p className="text-gray-800 dark:text-white font-medium text-center">{message}</p>
        <button onClick={onClose} className="px-6 py-2 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors">OK</button>
      </motion.div>
    </div>
  );
};

// --- LINKEDIN SALES SECTION ---
const LinkedInSection = () => {
  const [totalSales, setTotalSales] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState<number | ''>('');
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const calculate = () => {
    const total = Number(totalSales) || 0;
    const current = Number(currentPage) || 0;
    const approx = total > 0 ? (total <= 2500 ? Math.ceil(total / 25) : 100) : 0;
    const remain = approx > current ? approx - current : 0;
    return { approx, remain };
  };

  const { approx, remain } = calculate();

  const handleReset = () => {
    setTotalSales('');
    setCurrentPage('');
  };

  return (
    <>
      <div className="bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-3 backdrop-blur-md shadow-sm relative flex flex-col gap-3 w-full">
        
        {/* Title + Reset Button */}
        <div className="w-full flex justify-center items-center relative">
          <h3 className="font-bold text-blue-600 dark:text-blue-400 text-base text-center">
            LinkedIn Sales Page Calculation
          </h3>
          {(totalSales !== '' || currentPage !== '') && (
            <button 
              onClick={() => setResetConfirmOpen(true)} 
              className="absolute right-0 flex items-center gap-1 text-xs font-bold text-red-500 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors"
            >
              <RotateCcw size={12} /> Reset
            </button>
          )}
        </div>

        {/* Default Leads */}
        <div className="flex justify-center">
            <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300 bg-blue-500/10 dark:bg-blue-500/20 px-4 py-1.5 rounded-full border border-blue-500/20">
            <Compass size={12} className="text-blue-500" />
            <span>Default Leads on SalesNav Page ➜</span>
            <span className="font-bold text-blue-700 dark:text-blue-300">25</span>
            </div>
        </div>

        {/* Inputs & Results Row - Fixed Widths to prevent Jitter */}
        <div className="flex flex-nowrap items-center justify-center w-full mt-1 gap-6">
          
          {/* Group 1 */}
          <div className="flex items-center gap-3 w-[240px] justify-end">
            <input 
              type="number" 
              placeholder="Total Sales Results"
              value={totalSales}
              onChange={(e) => setTotalSales(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-28 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-1.5 px-3 text-center text-xs outline-none text-gray-800 dark:text-white placeholder:text-gray-400 no-spinner focus:border-blue-400 transition-colors"
            />
            <div className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
              <span className="w-20 text-right">Approx. Page:</span>
              <span className="font-bold text-sm text-gray-800 dark:text-white w-8 text-left tabular-nums">{approx}</span>
            </div>
          </div>

          <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>

          {/* Group 2 */}
          <div className="flex items-center gap-3 w-[240px] justify-start">
            <input 
              type="number" 
              placeholder="Current Sales Page"
              value={currentPage}
              onChange={(e) => setCurrentPage(e.target.value === '' ? '' : Number(e.target.value))}
              className="w-28 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-1.5 px-3 text-center text-xs outline-none text-gray-800 dark:text-white placeholder:text-gray-400 no-spinner focus:border-blue-400 transition-colors"
            />
            <div className="flex items-center gap-1 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
               <span className="w-20 text-right">Remain Page:</span>
               <span className="font-bold text-sm text-gray-800 dark:text-white w-8 text-left tabular-nums">{remain}</span>
            </div>
          </div>

        </div>
      </div>
      <ConfirmModal isOpen={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)} onConfirm={handleReset} message="Reset all LinkedIn calculation data?" />
    </>
  );
};

// --- SENT LINKS SECTION ---
const SentLinksSection = ({ total, setTotal }: { total: number, setTotal: (n: number) => void }) => {
  const [val, setVal] = useState<number | ''>('');
  const [logs, setLogs] = useState<{id:number, txt:string}[]>([]);
  const [showLogs, setShowLogs] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleAdd = () => {
    const v = Number(val);
    if (!v || v <= 0) return;
    setTotal(total + v);
    setLogs(p => [{ id: Date.now(), txt: `Added ${v} at ${new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}` }, ...p]);
    setVal('');
  };

  return (
    <>
      <div className="bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-3 backdrop-blur-md shadow-sm flex items-center justify-between w-full gap-3">
        
        {/* Input Group */}
        <div className="flex items-center gap-2 w-[140px]">
          <input 
            type="number" 
            placeholder="Enter" 
            value={val}
            onChange={(e) => setVal(e.target.value === '' ? '' : Number(e.target.value))}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="w-20 bg-white dark:bg-white/5 border border-blue-500/30 rounded-lg py-2 px-3 text-center font-bold text-gray-800 dark:text-white outline-none placeholder:font-normal placeholder:text-gray-400 no-spinner text-sm focus:border-blue-500 transition-colors"
          />
          <button onClick={handleAdd} className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-500/20 dark:hover:bg-blue-500/40 text-blue-600 dark:text-blue-300 border border-blue-500/30 p-2 rounded-lg transition-colors">
            <Check size={18} strokeWidth={3} />
          </button>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>

        {/* Total Display (Fixed Container to prevent Jitter) */}
        <div className="flex items-center gap-2 flex-1 justify-center">
           <span className="text-blue-600 dark:text-blue-400 font-bold text-sm whitespace-nowrap w-[120px] text-right">Total Sent Links =</span>
           {/* Fixed Width Box for Number */}
           <div className="bg-blue-100/50 dark:bg-blue-500/10 border border-blue-500/30 rounded-lg px-8 py-2 min-w-[100px] w-[100px] text-center flex justify-center">
             <span className="text-lg font-bold text-blue-700 dark:text-blue-300 tabular-nums">{total}</span>
           </div>
        </div>

        <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-[160px] justify-end">
          <button onClick={() => setShowLogs(true)} className="flex items-center gap-1 bg-white dark:bg-white/5 border border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-bold text-xs transition-all">
            <History size={14} /> Logs
          </button>
          <button onClick={() => setResetConfirmOpen(true)} className="flex items-center gap-1 bg-red-50 dark:bg-red-500/10 border border-red-500/30 hover:bg-red-100 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-bold text-xs transition-all">
            <RotateCcw size={14} /> Reset!
          </button>
        </div>

        <ConfirmModal isOpen={resetConfirmOpen} onClose={() => setResetConfirmOpen(false)} onConfirm={() => {setTotal(0); setLogs([])}} message="Reset total sent links and logs?" />
        <Modal isOpen={showLogs} onClose={() => setShowLogs(false)} title="Logs"><ul className="space-y-2 max-h-60 overflow-y-auto">{logs.map(l => <li key={l.id} className="text-sm border-b border-gray-100 dark:border-white/10 pb-1 text-gray-700 dark:text-gray-300">{l.txt}</li>)}</ul></Modal>
      </div>
    </>
  );
};

// --- EMAIL MANAGER ---
const EmailManagerSection = ({ triggerAlert }: { triggerAlert: (msg: string) => void }) => {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [pageIndex, setPageIndex] = useState(0); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  
  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('newTaskEmails');
    if (saved) setEmails(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('newTaskEmails', JSON.stringify(emails));
  }, [emails]);

  const ITEMS_PER_PAGE = 5;
  const LIMIT = 30; // UPDATED LIMIT
  const PAGES = ['A', 'B', 'C', 'D', 'E', 'F']; // UPDATED PAGES
  
  const startIndex = pageIndex * ITEMS_PER_PAGE;
  const currentEmails = emails.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddEmails = () => {
    const rawList = bulkInput.split(/[\n,\s]+/).filter(s => s.trim().length > 0);
    let addedCount = 0;
    const newEmails = [...emails];
    rawList.forEach(text => {
      if (newEmails.length >= LIMIT) return;
      const cleanText = text.trim();
      if (isValidEmail(cleanText) && !newEmails.some(e => e.text === cleanText)) {
        newEmails.push({ id: Math.random().toString(36).substr(2, 9), text: cleanText, copied: false, selected: false });
        addedCount++;
      }
    });
    if (addedCount > 0) {
      setEmails(newEmails);
      setBulkInput("");
      setIsAddModalOpen(false);
      setPageIndex(Math.floor((newEmails.length - 1) / ITEMS_PER_PAGE));
    } else {
        triggerAlert(`No valid/unique emails found or limit (${LIMIT}) reached.`);
        setIsAddModalOpen(false);
    }
  };

  const handleDeleteSelected = () => setEmails(prev => prev.filter(e => !e.selected));
  const toggleSelect = (id: string) => setEmails(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
  const handleCopy = (id: string, text: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, copied: !e.copied } : e));
    navigator.clipboard.writeText(text);
  };
  const resetPageCopies = () => {
    const pageIds = currentEmails.map(e => e.id);
    setEmails(prev => prev.map(e => pageIds.includes(e.id) ? { ...e, copied: false } : e));
  };
  const startEdit = (email: EmailItem) => { setEditingId(email.id); setEditValue(email.text); };
  const saveEdit = () => {
    if (editingId && isValidEmail(editValue)) {
       if (!emails.some(e => e.text === editValue && e.id !== editingId)) {
         setEmails(prev => prev.map(e => e.id === editingId ? { ...e, text: editValue } : e));
         setEditingId(null);
       } else triggerAlert("Email already exists.");
    }
  };
  const isPageFullyCopied = currentEmails.length > 0 && currentEmails.every(e => e.copied);

  return (
    <>
      <div className="bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-5 backdrop-blur-md shadow-sm h-full flex flex-col justify-between w-full">
        <div className="flex justify-between items-center mb-4 select-none">
          <div className="flex items-center gap-3">
            <button onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-20 text-gray-500 dark:text-gray-400 transition-colors"><ChevronLeft size={18} /></button>
            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2 text-base">NewTask Emails <span className="text-blue-600 dark:text-blue-400">({PAGES[pageIndex]})</span></h3>
          </div>
          <div className="flex items-center gap-2">
            
            {/* Reset Button (Left of Add) */}
            <AnimatePresence>
                {isPageFullyCopied && (
                    <motion.button 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={resetPageCopies} 
                        className="p-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
                        title="Reset Highlights"
                    >
                        <RotateCcw size={18} />
                    </motion.button>
                )}
            </AnimatePresence>

            <button disabled={emails.length >= LIMIT} onClick={() => setIsAddModalOpen(true)} className="p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"><Plus size={18} /></button>
            <button disabled={!emails.some(e => e.selected)} onClick={() => setDeleteConfirmOpen(true)} className="p-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"><Trash2 size={18} /></button>
            <button onClick={() => setPageIndex(p => Math.min(PAGES.length - 1, p + 1))} disabled={pageIndex === PAGES.length - 1} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-20 text-gray-500 dark:text-gray-400 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-start gap-3 min-h-[220px]">
          {currentEmails.length === 0 ? <div className="flex items-center justify-center h-full text-sm opacity-40 italic text-gray-500 dark:text-gray-400">Page {PAGES[pageIndex]} is empty</div> : 
            currentEmails.map(email => (
              <div key={email.id} className="group flex items-center gap-3 p-2.5 rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-sm transition-all hover:shadow-md">
                
                <button onClick={() => startEdit(email)} className="text-gray-400 hover:text-blue-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Edit3 size={16} /></button>
                
                {editingId === email.id ? 
                  <div className="flex-1 flex gap-2"><input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 bg-gray-50 dark:bg-black border border-blue-500 rounded px-2 py-1 text-sm outline-none text-gray-900 dark:text-white" autoFocus /><button onClick={saveEdit} className="text-green-500"><Check size={16} /></button></div> 
                  : <span onClick={() => handleCopy(email.id, email.text)} className={`flex-1 text-sm cursor-pointer select-none text-center font-medium transition-all ${email.copied ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>{email.text}</span>}
                
                <button onClick={() => toggleSelect(email.id)} className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${email.selected ? 'bg-blue-500 border-blue-500 text-white opacity-100' : 'border-gray-300 dark:border-gray-500 hover:border-blue-400 text-transparent opacity-0 group-hover:opacity-100'}`}><Check size={12} /></button>
              </div>
            ))
          }
        </div>
        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Emails"><textarea value={bulkInput} onChange={(e) => setBulkInput(e.target.value)} placeholder="Enter emails" className="w-full h-40 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg p-3 text-sm outline-none focus:border-blue-500 mb-4 font-mono resize-none text-gray-800 dark:text-white" /><button onClick={handleAddEmails} className="px-6 py-2 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500 font-medium w-full">Add Emails</button></Modal>
        <ConfirmModal isOpen={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} onConfirm={handleDeleteSelected} message="Delete selected?" />
      </div>
    </>
  );
};

// --- OFFICE PAGE ---
const OfficePage = ({ totalSentLinks }: { totalSentLinks: number }) => {
  const [target, setTarget] = useState(10000);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const hours = ['08 AM', '09 AM', '10 AM', '11 AM', '12 PM', '01 PM', '02 PM', '03 PM', '04 PM', '05 PM', '06 PM', '07 PM', '08 PM'];

  const calculateTotals = () => {
    let sales = 0, search = 0;
    Object.entries(inputs).forEach(([key, val]) => {
      const num = parseInt(val) || 0;
      if (key.startsWith('sales')) sales += num;
      if (key.startsWith('search')) search += num;
    });
    return { sales, search, officeTotal: sales + search };
  };

  const { sales, search, officeTotal } = calculateTotals();
  
  // Dynamic Total Calculation
  const grandTotal = totalSentLinks + officeTotal;
  const needed = Math.max(0, target - grandTotal);

  const handleInput = (type: 'sales' | 'search', index: number, val: string) => {
    setInputs(prev => ({ ...prev, [`${type}-${index}`]: val }));
  };

  const sendToDiscord = async () => {
    setIsSending(true);
    setIsSent(false);
    
    const content = `Sent Links: **${grandTotal.toLocaleString()}**\n\nNeed to send more **${needed.toLocaleString()}** links to reach **${target/1000}k** Milestone`;
    const webhookURL = "https://discord.com/api/webhooks/1466497164157911042/Cxc4IR1RJ0idOh-ctI5pyHYnODdHo4Hpk30qn3L7edcv960mzkg62BIaA-N0xmlIyDzV";

    try {
      await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      setIsSending(false);
      setIsSent(true);
      setTimeout(() => setIsSent(false), 2000);
    } catch (e) {
      alert("Failed to send.");
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto pr-1 pb-4 custom-scrollbar">
      {/* Target Section */}
      <div className="bg-blue-100/50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/20 rounded-2xl p-4 flex items-center justify-between">
         <div className="flex items-center gap-2 min-w-[200px]">
            <span className="font-bold text-blue-700 dark:text-blue-300">Targeted Value</span>
            <select value={target} onChange={(e) => setTarget(Number(e.target.value))} className="bg-white dark:bg-black/20 border border-blue-300 rounded-full px-3 py-1 text-sm font-bold text-blue-600 focus:outline-none cursor-pointer">
               <option value={10000}>10k</option>
               <option value={15000}>15k</option>
               <option value={20000}>20k</option>
            </select>
         </div>
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-bold">
               <LinkIcon size={16} /> <span className="whitespace-nowrap">Total Sent Links:</span> 
               {/* Fixed Width + Padding */}
               <span className="bg-white dark:bg-black/20 px-8 py-1 rounded-lg border border-blue-300 min-w-[100px] text-center tabular-nums inline-block">{grandTotal.toLocaleString()}</span>
            </div>
            
            {/* Discord Send Button */}
            <button 
               onClick={sendToDiscord} 
               disabled={isSending || isSent}
               className={`flex items-center gap-1.5 text-xs text-white px-4 py-2 rounded-lg transition-all shadow-sm
                  ${isSent ? 'bg-green-500 hover:bg-green-600' : 'bg-[#5865F2] hover:bg-[#4752C4]'}
               `}
            >
               {isSending ? <Loader2 size={14} className="animate-spin" /> : isSent ? <Check size={14} /> : <FaDiscord size={14}/>}
               {isSent ? 'Sent' : 'Send Updates'}
            </button>

            <button onClick={() => {if(confirm('Reset Office Data?')) setInputs({})}} className="flex items-center gap-1 text-xs text-red-500 border border-red-500/30 hover:bg-red-50 dark:hover:bg-red-500/10 px-3 py-2 rounded-lg transition-colors">
               <RotateCcw size={12}/> Reset
            </button>
         </div>
      </div>

      {/* Milestone */}
      <div className="bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-6 text-center shadow-sm">
         <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-1 tabular-nums">Sent Links: {grandTotal.toLocaleString()}</h3>
         <p className="text-red-500 font-medium text-sm tabular-nums">Need to send more <span className="font-bold text-red-600">{needed.toLocaleString()}</span> links to reach {target/1000}k Milestone</p>
      </div>

      {/* Grid Inputs */}
      <div className="bg-white/50 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-4 shadow-sm">
         <div className="grid grid-cols-[1fr_80px_1fr] gap-4 mb-4 text-center font-bold text-blue-600 dark:text-blue-400 text-sm">
            <div className="flex items-center justify-center gap-2">Sales <Compass size={14}/></div>
            <div><Clock size={14} className="mx-auto"/></div>
            <div className="flex items-center justify-center gap-2">Search <Search size={14}/></div>
         </div>
         
         <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
            {hours.map((time, i) => (
               <div key={i} className="grid grid-cols-[1fr_80px_1fr] gap-4 items-center">
                  <input type="number" value={inputs[`sales-${i}`] || ''} onChange={(e) => handleInput('sales', i, e.target.value)} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-1 text-center outline-none focus:border-blue-400 no-spinner tabular-nums" />
                  <div className="text-xs font-bold text-gray-500 text-center">{time}</div>
                  <input type="number" value={inputs[`search-${i}`] || ''} onChange={(e) => handleInput('search', i, e.target.value)} className="w-full bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg py-1 text-center outline-none focus:border-blue-400 no-spinner tabular-nums" />
               </div>
            ))}
         </div>

         <div className="grid grid-cols-[1fr_80px_1fr] gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-white/10">
            <div className="bg-blue-50 dark:bg-white/5 text-center py-1 rounded-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">{sales}</div>
            <div className="flex items-center justify-center gap-1 text-xs font-bold text-blue-500"><ArrowLeft size={10}/> Total <ArrowRight size={10}/></div>
            <div className="bg-blue-50 dark:bg-white/5 text-center py-1 rounded-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">{search}</div>
         </div>
      </div>
    </div>
  );
};

// --- PARENT ---
interface NewTaskAppProps {
  onClose: () => void;
  totalSentLinks: number;
  setTotalSentLinks: (n: number) => void;
}

export default function NewTaskApp({ onClose, totalSentLinks, setTotalSentLinks }: NewTaskAppProps) {
  const [activeTab, setActiveTab] = useState<'self' | 'office'>('self');
  const [alertInfo, setAlertInfo] = useState<{isOpen: boolean, message: string}>({isOpen: false, message: ''});

  const triggerAlert = (message: string) => {
      setAlertInfo({ isOpen: true, message });
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-center items-center gap-4 mb-3 shrink-0 relative">
        <button onClick={() => setActiveTab('self')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'self' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <User size={16} /> Self
        </button>
        <button onClick={() => setActiveTab('office')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'office' ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <Building size={16} /> Office
        </button>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'self' ? (
           <div className="h-full flex flex-col gap-3 max-w-[95%] mx-auto overflow-y-auto custom-scrollbar">
             <LinkedInSection />
             <SentLinksSection total={totalSentLinks} setTotal={setTotalSentLinks} />
             <div className="flex-1 min-h-[300px]">
                <EmailManagerSection triggerAlert={triggerAlert} />
             </div>
           </div>
        ) : (
          <OfficePage totalSentLinks={totalSentLinks} />
        )}
        
        {/* Custom Alert Modal */}
        <AlertModal 
            isOpen={alertInfo.isOpen} 
            onClose={() => setAlertInfo({isOpen: false, message: ''})} 
            message={alertInfo.message} 
        />
      </div>
    </div>
  );
}
