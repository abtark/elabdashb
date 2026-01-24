"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { 
  LogOut, Moon, Sun, X, Maximize2, Minimize2, 
  CheckSquare, Table, Clock, Zap, Coffee, User, Building, 
  Plus, Trash2, ChevronLeft, ChevronRight, Check, RotateCcw,
  History, Compass, Copy
} from "lucide-react";

// --- Types ---
type AppType = 'newtask' | 'entries' | 'tracker' | 'updates' | 'snacks';
type TabType = 'self' | 'office';

interface EmailItem {
  id: string;
  text: string;
  copied: boolean;
  selected: boolean;
}

// --- UTILITY COMPONENTS ---

const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
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

// --- LOGIC COMPONENTS ---

// 1. LINKEDIN SALES SECTION (Styled like Image 1)
const LinkedInSection = () => {
  const [totalSales, setTotalSales] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState<number | ''>('');

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
    <div className="bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-4 mb-4 backdrop-blur-md shadow-sm relative flex flex-col items-center gap-3">
      
      {/* Line 1: Title + Reset (Absolute Right) */}
      <div className="w-full relative flex justify-center items-center">
        <h3 className="font-bold text-blue-600 dark:text-blue-400 text-lg">
          LinkedIn Sales Page Calculation
        </h3>
        {(totalSales !== '' || currentPage !== '') && (
           <button 
             onClick={handleReset} 
             className="absolute right-0 top-0 text-red-500 hover:bg-red-500/10 p-1 rounded-full transition-colors"
             title="Reset"
           >
             <RotateCcw size={18} />
           </button>
        )}
      </div>

      {/* Line 2: Default Leads */}
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-blue-500/10 dark:bg-blue-500/20 px-4 py-1.5 rounded-full border border-blue-500/20">
        <Compass size={14} className="text-blue-500" />
        <span>Default Leads on SalesNav Page</span>
        <span className="text-blue-600 dark:text-blue-400">➜</span>
        <span className="font-bold text-blue-700 dark:text-blue-300">25</span>
      </div>

      {/* Line 3: Inputs & Results (Horizontal Layout) */}
      <div className="flex flex-nowrap items-center justify-center gap-3 w-full mt-1">
        
        {/* Total Input */}
        <input 
          type="number" 
          placeholder="Total Sales Results"
          value={totalSales}
          onChange={(e) => setTotalSales(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-40 bg-white/60 dark:bg-white/5 border border-blue-500/30 dark:border-blue-500/50 rounded-lg py-2 px-3 text-center text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder:text-gray-500"
        />

        {/* Approx Result */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">
          <span>Approx. Pages</span>
          <span className="font-bold text-lg text-gray-800 dark:text-white">{approx}</span>
        </div>

        <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-1"></div>

        {/* Current Page Input */}
        <input 
          type="number" 
          placeholder="Current Sales Page"
          value={currentPage}
          onChange={(e) => setCurrentPage(e.target.value === '' ? '' : Number(e.target.value))}
          className="w-40 bg-white/60 dark:bg-white/5 border border-blue-500/30 dark:border-blue-500/50 rounded-lg py-2 px-3 text-center text-sm outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white placeholder:text-gray-500"
        />

        {/* Remain Result */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm whitespace-nowrap">
          <span>Remain Pages</span>
          <span className="font-bold text-lg text-gray-800 dark:text-white">{remain}</span>
        </div>

      </div>
    </div>
  );
};

// 2. SENT LINKS SECTION (Styled like Image 2)
const SentLinksSection = () => {
  const [totalLinks, setTotalLinks] = useState(0);
  const [inputValue, setInputValue] = useState<number | ''>('');
  const [logs, setLogs] = useState<{id: number, val: number, time: string}[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const handleAdd = () => {
    const val = Number(inputValue);
    if (!val || val <= 0) return;
    const newTotal = totalLinks + val;
    setTotalLinks(newTotal);
    const now = new Date();
    setLogs(prev => [{ 
      id: Date.now(), 
      val, 
      time: `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'} - ${now.getDate()}/${now.getMonth() + 1}` 
    }, ...prev]);
    setInputValue('');
  };

  const handleReset = () => {
    if (confirm("Reset total sent links and clear logs?")) {
      setTotalLinks(0);
      setLogs([]);
    }
  };

  return (
    <div className="bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-3 mb-4 backdrop-blur-md shadow-sm flex items-center justify-center gap-3">
      
      {/* 1. Input */}
      <input 
        type="number" 
        placeholder="Enter" 
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        className="w-24 bg-white/60 dark:bg-white/5 border border-blue-500/40 rounded-lg py-2 px-3 text-center font-bold text-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 placeholder:font-normal"
      />

      {/* 2. Add Button */}
      <button onClick={handleAdd} className="bg-blue-100 hover:bg-blue-200 dark:bg-blue-500/20 dark:hover:bg-blue-500/40 text-blue-600 dark:text-blue-300 border border-blue-500/30 p-2 rounded-lg transition-colors">
        <Check size={20} strokeWidth={3} />
      </button>

      <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-1"></div>

      {/* 3. Text Label */}
      <span className="text-blue-600 dark:text-blue-400 font-medium">Total Sent Links =</span>

      {/* 4. Total Value */}
      <div className="bg-blue-100/50 dark:bg-blue-500/10 border border-blue-500/30 rounded-lg px-6 py-2">
        <span className="text-xl font-bold text-blue-700 dark:text-blue-300">{totalLinks}</span>
      </div>

      <div className="w-px h-8 bg-black/10 dark:bg-white/10 mx-1"></div>

      {/* 5. Logs Button */}
      <button onClick={() => setShowLogs(true)} className="flex items-center gap-1 bg-white/50 dark:bg-white/5 border border-blue-500/30 hover:bg-blue-50 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 px-4 py-2 rounded-lg font-bold text-sm transition-all">
        <History size={16} /> Logs
      </button>

      {/* 6. Reset Button */}
      <button onClick={handleReset} className="flex items-center gap-1 bg-red-100/50 dark:bg-red-500/10 border border-red-500/30 hover:bg-red-200 dark:hover:bg-red-500/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg font-bold text-sm transition-all">
        <RotateCcw size={16} /> Reset!
      </button>

      {/* Logs Modal */}
      <Modal isOpen={showLogs} onClose={() => setShowLogs(false)} title="Sent Link Logs">
        <div className="max-h-60 overflow-y-auto space-y-2 custom-scrollbar">
          {logs.length === 0 ? <p className="text-center opacity-50 text-gray-500 dark:text-gray-400">No logs yet.</p> : logs.map(log => (
            <div key={log.id} className="flex justify-between items-center bg-gray-100 dark:bg-white/5 p-2 rounded border border-gray-200 dark:border-white/10">
              <span className="text-sm text-gray-700 dark:text-gray-300">Added <b>{log.val}</b> at {log.time}</span>
              <button onClick={() => { setLogs(p => p.filter(l => l.id !== log.id)); setTotalLinks(p => Math.max(0, p - log.val)); }} className="text-red-400 hover:text-red-600"><X size={14}/></button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

// 3. EMAIL MANAGER SECTION (Strict Requirements)
const EmailManagerSection = () => {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [pageIndex, setPageIndex] = useState(0); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const ITEMS_PER_PAGE = 5;
  const PAGES = ['A', 'B', 'C', 'D', 'E']; // Max 25 emails -> 5 pages

  // Get current page emails
  const startIndex = pageIndex * ITEMS_PER_PAGE;
  const currentEmails = emails.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Validate Email Regex
  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAddEmails = () => {
    // 1. Parse input (newline, comma, space)
    const rawList = bulkInput.split(/[\n,\s]+/).filter(s => s.trim().length > 0);
    
    let addedCount = 0;
    const newEmails = [...emails];

    // 2. Validate and Add
    rawList.forEach(text => {
      if (newEmails.length >= 25) return; // Hard limit 25
      const cleanText = text.trim();
      
      // Check Valid & Duplicate
      if (isValidEmail(cleanText) && !newEmails.some(e => e.text === cleanText)) {
        newEmails.push({
          id: Math.random().toString(36).substr(2, 9),
          text: cleanText,
          copied: false,
          selected: false
        });
        addedCount++;
      }
    });

    if (addedCount > 0) {
      setEmails(newEmails);
      setBulkInput("");
      setIsAddModalOpen(false);
      
      // Auto-switch to the page where the new email landed
      const newLastIndex = newEmails.length - 1;
      const newPage = Math.floor(newLastIndex / ITEMS_PER_PAGE);
      setPageIndex(newPage);
    } else {
      alert("No valid or unique emails found, or capacity full.");
    }
  };

  const handleDeleteSelected = () => {
    if (confirm("Delete selected emails?")) {
      setEmails(prev => prev.filter(e => !e.selected));
    }
  };

  const toggleSelect = (id: string) => {
    setEmails(prev => prev.map(e => e.id === id ? { ...e, selected: !e.selected } : e));
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setEmails(prev => prev.map(e => e.id === id ? { ...e, copied: true } : e));
  };

  const resetPageCopies = () => {
    // Reset 'copied' status for emails on THIS page only
    const pageIds = currentEmails.map(e => e.id);
    setEmails(prev => prev.map(e => pageIds.includes(e.id) ? { ...e, copied: false } : e));
  };

  const startEdit = (email: EmailItem) => {
    setEditingId(email.id);
    setEditValue(email.text);
  };

  const saveEdit = () => {
    if (editingId && isValidEmail(editValue)) {
       // Check duplicate on edit
       if (!emails.some(e => e.text === editValue && e.id !== editingId)) {
         setEmails(prev => prev.map(e => e.id === editingId ? { ...e, text: editValue } : e));
         setEditingId(null);
       } else {
         alert("Email already exists.");
       }
    } else {
      alert("Invalid email format.");
    }
  };

  // Logic to show Reset button instead of Page Letter
  const isPageFullyCopied = currentEmails.length > 0 && currentEmails.every(e => e.copied);

  return (
    <div className="bg-white/40 dark:bg-black/20 border border-black/5 dark:border-white/10 rounded-2xl p-4 backdrop-blur-md shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
           NewTask Emails 
           <span className="text-blue-500">
             ({isPageFullyCopied ? 
               <button onClick={resetPageCopies} className="bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:scale-110 transition-transform"><RotateCcw size={12}/></button> 
               : PAGES[pageIndex]})
           </span>
        </h3>
        <div className="flex gap-2">
          <button 
            disabled={emails.length >= 25}
            onClick={() => setIsAddModalOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} />
          </button>
          <button 
            disabled={!emails.some(e => e.selected)}
            onClick={handleDeleteSelected}
            className="p-1.5 rounded-lg bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between bg-black/5 dark:bg-white/5 rounded-lg p-1 mb-3 border border-black/5 dark:border-white/5">
        <button onClick={() => setPageIndex(p => Math.max(0, p - 1))} disabled={pageIndex === 0} className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded disabled:opacity-30 text-gray-700 dark:text-white">
          <ChevronLeft size={20} />
        </button>
        <span className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
            Page {PAGES[pageIndex]}
        </span>
        <button onClick={() => setPageIndex(p => Math.min(4, p + 1))} disabled={pageIndex === 4} className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded disabled:opacity-30 text-gray-700 dark:text-white">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Email List */}
      <div className="flex-1 flex flex-col justify-start gap-2 min-h-[200px]">
        {currentEmails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-sm opacity-40 italic text-gray-500 dark:text-gray-400">
            Page {PAGES[pageIndex]} is empty
          </div>
        ) : (
          currentEmails.map(email => (
            <div key={email.id} className={`flex items-center gap-3 p-2 rounded-lg border transition-all duration-300 ${email.selected ? 'bg-red-500/10 border-red-500/30' : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10'}`}>
              
              {/* Left: Edit */}
              <button onClick={() => startEdit(email)} className="text-gray-400 hover:text-blue-500"><CheckSquare size={16} /></button>

              {/* Center: Email Text */}
              {editingId === email.id ? (
                <div className="flex-1 flex gap-2">
                  <input value={editValue} onChange={(e) => setEditValue(e.target.value)} className="flex-1 bg-white dark:bg-black border border-blue-500 rounded px-2 py-1 text-sm outline-none text-gray-900 dark:text-white" autoFocus />
                  <button onClick={saveEdit} className="text-green-500"><Check size={16} /></button>
                </div>
              ) : (
                <span 
                  onClick={() => handleCopy(email.id, email.text)}
                  className={`flex-1 text-sm cursor-pointer select-none text-center transition-all ${email.copied ? 'text-blue-600 dark:text-blue-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}
                  title="Click to copy"
                >
                  {email.text}
                </span>
              )}

              {/* Right: Select Tick */}
              <button onClick={() => toggleSelect(email.id)} className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${email.selected ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400 dark:border-gray-600 text-transparent hover:border-blue-400'}`}>
                <Check size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Emails">
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="Enter valid emails separated by new lines, commas, or spaces."
          className="w-full h-40 bg-gray-50 dark:bg-black/20 border border-gray-300 dark:border-white/10 rounded-lg p-3 text-sm outline-none focus:border-blue-500 mb-4 font-mono resize-none text-gray-800 dark:text-white"
        />
        <div className="flex justify-end gap-2">
          <button onClick={handleAddEmails} className="px-6 py-2 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500 font-medium w-full">Add Emails</button>
        </div>
      </Modal>
    </div>
  );
};

// --- NEW TASK PARENT COMPONENT ---
const NewTaskApp = () => {
  const [activeTab, setActiveTab] = useState<TabType>('self');
  
  return (
    <div className="h-full flex flex-col">
      {/* Sub-Nav Tabs */}
      <div className="flex justify-center gap-4 mb-4 shrink-0">
        <button onClick={() => setActiveTab('self')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'self' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <User size={16} /> Self
        </button>
        <button onClick={() => setActiveTab('office')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'office' ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <Building size={16} /> Office
        </button>
      </div>
      
      {/* Content Area (No Scroll on Page, only internal if needed) */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'self' ? (
           <div className="h-full flex flex-col gap-3 max-w-[90%] mx-auto">
             <LinkedInSection />
             <SentLinksSection />
             <div className="flex-1 min-h-0">
               <EmailManagerSection />
             </div>
           </div>
        ) : (
          <div className="text-center h-full flex items-center justify-center">
             <div className="bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-xl p-8 flex flex-col items-center justify-center">
               <Building className="opacity-50 w-12 h-12 mb-2" />
               <h3 className="text-xl font-bold opacity-80">Office Dashboard</h3>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN PAGE LAYOUT ---

export default function DashboardPage() {
  const { theme, setTheme } = useTheme();
  const [activeApp, setActiveApp] = useState<AppType | null>('newtask');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const menuItems = [
    { id: 'newtask', icon: CheckSquare, label: 'NewTask', color: 'text-blue-500' },
    { id: 'entries', icon: Table, label: 'Count Entries', color: 'text-green-500' },
    { id: 'tracker', icon: Clock, label: 'Tracker', color: 'text-orange-500' },
    { id: 'updates', icon: Zap, label: 'Updates', color: 'text-yellow-500' },
    { id: 'snacks', icon: Coffee, label: 'F & B', color: 'text-pink-500' },
  ];

  const handleClose = () => { setActiveApp(null); setIsMaximized(false); };
  const handleMaximize = () => setIsMaximized(true);
  const handleMinimize = () => setIsMaximized(false);

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-200 dark:bg-[#050505] transition-colors duration-500 font-ubuntu">
      
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[20%] w-96 h-96 bg-purple-500/20 dark:bg-purple-500/30 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-cyan-500/20 dark:bg-cyan-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      {/* Main Container */}
      <motion.div 
        layout
        className={`relative z-10 w-full max-w-[950px] transition-all duration-500 ease-spring
          ${isMaximized ? 'fixed inset-4 max-w-none max-h-none h-auto z-50' : 'h-[95vh] max-h-[850px]'}
          bg-white/40 dark:bg-black/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-3xl flex flex-col overflow-hidden shadow-2xl
        `}
      >
        
        {/* --- Header (Logo Only + Theme) --- */}
        <div className="flex items-center justify-between p-6 pb-2 shrink-0 select-none">
          {/* Logo (Bigger, No Edit) */}
          <div className="relative w-20 h-20 drop-shadow-2xl">
              <Image src="https://iili.io/FC3KC6g.png" alt="Logo" fill className="object-contain" />
          </div>

          <div className="flex items-center gap-4">
             {/* Page Title */}
             <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-white opacity-90 mr-4">
               {activeApp ? menuItems.find(i => i.id === activeApp)?.label : "Dashboard"}
            </h1>

            {/* Theme Toggle */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-3 rounded-full bg-white/20 dark:bg-white/5 hover:bg-white/40 transition-colors text-gray-800 dark:text-white">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* --- Body --- */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Sidebar */}
          <div className="w-24 flex flex-col items-center py-6 gap-6 border-r border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 shrink-0 z-20 backdrop-blur-md">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeApp === item.id;
              
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveApp(item.id as AppType)}
                  className={`relative group p-4 rounded-2xl transition-all duration-300
                    ${isActive ? 'bg-white/60 dark:bg-white/10 shadow-lg scale-110' : 'hover:bg-white/30 dark:hover:bg-white/5 opacity-60 hover:opacity-100'}
                  `}
                >
                  <Icon size={28} className={`${isActive ? item.color : 'text-gray-600 dark:text-gray-400'}`} />
                  {isActive && <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1.5 h-8 bg-blue-500 rounded-r-full" />}
                </button>
              )
            })}
            <div className="mt-auto mb-2">
               <Link href="/" className="p-3 block rounded-2xl hover:bg-red-500/10 text-red-500 transition-colors opacity-60 hover:opacity-100">
                  <LogOut size={26} />
               </Link>
            </div>
          </div>

          {/* App View */}
          <div className="flex-1 relative overflow-hidden bg-white/20 dark:bg-transparent backdrop-blur-sm">
            
            {/* Window Controls (Top Right of MENU PAGE) */}
            {activeApp && (
              <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-white/40 dark:bg-black/40 p-1.5 rounded-full border border-black/5 dark:border-white/10 backdrop-blur-md shadow-sm">
                
                {/* Minimize (Only show if maximized) */}
                {isMaximized && (
                  <button 
                    onClick={handleMinimize} 
                    className="group relative w-4 h-4 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center transition-all shadow-sm"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-black/60 leading-none mb-1">-</span>
                  </button>
                )}

                {/* Maximize */}
                <button 
                  onClick={handleMaximize} 
                  className="group relative w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all shadow-sm"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/60 leading-none">☐</span>
                </button>

                {/* Close */}
                <button 
                  onClick={handleClose} 
                  className="group relative w-4 h-4 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/60 leading-none">x</span>
                </button>
              </div>
            )}

            <AnimatePresence mode="wait">
              {activeApp ? (
                <motion.div 
                  key={activeApp}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="h-full w-full flex flex-col p-6 pt-12" // pt-12 to avoid overlap with window controls
                >
                   {activeApp === 'newtask' && <NewTaskApp />}
                   {/* Placeholders for other apps */}
                   {['entries','tracker','updates','snacks'].includes(activeApp) && (
                     <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400 opacity-50 font-medium">
                        Module Pending
                     </div>
                   )}
                </motion.div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                   <div className="w-24 h-24 relative mb-4 grayscale opacity-50">
                      <Image src="https://iili.io/FC3KC6g.png" fill className="object-contain" alt="Logo" />
                   </div>
                   <p className="text-gray-800 dark:text-white font-light">Select an application from the sidebar</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
