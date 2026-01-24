"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { 
  LogOut, Moon, Sun, Edit3, X, Maximize2, Minimize2, 
  CheckSquare, Table, Clock, Zap, Coffee, User, Building, 
  Plus, Trash2, ChevronLeft, ChevronRight, Check, RotateCcw,
  Copy, History, Compass
} from "lucide-react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

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

// 1. Modal Component
const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-900 border border-white/10 rounded-2xl w-full max-w-md p-6 shadow-2xl"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">{title}</h3>
          <button onClick={onClose}><X size={20} className="opacity-50 hover:opacity-100" /></button>
        </div>
        {children}
      </motion.div>
    </div>
  );
};

// --- LOGIC COMPONENTS ---

// 1. LINKEDIN SALES SECTION
const LinkedInSection = () => {
  const [totalSales, setTotalSales] = useState<number | ''>('');
  const [currentPage, setCurrentPage] = useState<number | ''>('');

  const calculate = () => {
    const total = Number(totalSales) || 0;
    const current = Number(currentPage) || 0;
    
    // Logic: Approx pages (25 results per page)
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
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-blue-400 flex items-center gap-2">
          <Compass size={18} /> LinkedIn Sales Page
        </h3>
        {(totalSales !== '' || currentPage !== '') && (
          <button onClick={handleReset} className="text-red-400 hover:bg-red-500/10 p-1.5 rounded-full transition-colors">
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* Header Stat */}
        <div className="bg-black/20 rounded-lg p-2 text-center text-sm mb-2 border border-white/5">
          <span className="opacity-70">Default Leads per Page: </span>
          <span className="font-bold text-blue-400 ml-1">25</span>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Total Results"
            value={totalSales}
            onChange={(e) => setTotalSales(e.target.value === '' ? '' : Number(e.target.value))}
            className="flex-1 bg-white/10 border border-white/10 rounded-lg p-2 text-center outline-none focus:border-blue-500 transition-colors"
          />
          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] uppercase opacity-50">Approx</span>
            <span className="font-bold text-lg">{approx}</span>
          </div>
        </div>

        <div className="w-full h-px bg-white/10" />

        <div className="flex items-center gap-2">
          <input 
            type="number" 
            placeholder="Current Page"
            value={currentPage}
            onChange={(e) => setCurrentPage(e.target.value === '' ? '' : Number(e.target.value))}
            className="flex-1 bg-white/10 border border-white/10 rounded-lg p-2 text-center outline-none focus:border-blue-500 transition-colors"
          />
          <div className="flex flex-col items-center px-2">
            <span className="text-[10px] uppercase opacity-50">Remain</span>
            <span className="font-bold text-lg">{remain}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// 2. SENT LINKS SECTION
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
    const timeStr = `${now.getHours() % 12 || 12}:${String(now.getMinutes()).padStart(2, '0')} ${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    const dateStr = `${now.getDate()}/${now.getMonth() + 1}`;

    setLogs(prev => [{ id: Date.now(), val, time: `${timeStr} - ${dateStr}` }, ...prev]);
    setInputValue('');
  };

  const handleReset = () => {
    if (confirm("Reset total sent links and clear logs?")) {
      setTotalLinks(0);
      setLogs([]);
    }
  };

  const handleDeleteLog = (id: number, val: number) => {
    setLogs(prev => prev.filter(l => l.id !== id));
    setTotalLinks(prev => Math.max(0, prev - val));
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <input 
          type="number" 
          placeholder="Add Amount" 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value === '' ? '' : Number(e.target.value))}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          className="w-24 bg-transparent border-b border-blue-500/50 p-1 text-center font-mono focus:border-blue-400 outline-none"
        />
        <button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors">
          <Plus size={16} />
        </button>
        
        <div className="flex-1 text-right">
          <span className="text-sm opacity-60 mr-2">Total Sent:</span>
          <span className="text-xl font-bold text-blue-400">{totalLinks}</span>
        </div>
      </div>

      <div className="flex justify-between items-center text-xs">
        <button onClick={() => setShowLogs(true)} className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
          <History size={14} /> View Logs
        </button>
        <button onClick={handleReset} className="flex items-center gap-1 text-red-400 hover:text-red-300">
          <RotateCcw size={14} /> Reset
        </button>
      </div>

      <Modal isOpen={showLogs} onClose={() => setShowLogs(false)} title="Sent Link Logs">
        <div className="max-h-60 overflow-y-auto space-y-2">
          {logs.length === 0 ? <p className="text-center opacity-50">No logs yet.</p> : logs.map(log => (
            <div key={log.id} className="flex justify-between items-center bg-black/10 p-2 rounded">
              <span>Added <b>{log.val}</b> at {log.time}</span>
              <button onClick={() => handleDeleteLog(log.id, log.val)} className="text-red-400"><X size={14}/></button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

// 3. EMAIL MANAGER SECTION (The complex part)
const EmailManagerSection = () => {
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [pageIndex, setPageIndex] = useState(0); // 0=A, 1=B, 2=C...
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [bulkInput, setBulkInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const MAX_EMAILS = 25;
  const ITEMS_PER_PAGE = 5;
  const PAGES = ['A', 'B', 'C', 'D', 'E'];

  // Calculate current page data
  const startIndex = pageIndex * ITEMS_PER_PAGE;
  const currentEmails = emails.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // -- Actions --

  const handleAddEmails = () => {
    // Split by comma, newline, or space and filter empty
    const rawList = bulkInput.split(/[\n,\s]+/).filter(s => s.trim().length > 0);
    const availableSlots = MAX_EMAILS - emails.length;
    
    if (availableSlots <= 0) {
      alert("Maximum capacity (25) reached.");
      return;
    }

    const toAdd = rawList.slice(0, availableSlots).map(text => ({
      id: Math.random().toString(36).substr(2, 9),
      text: text.trim(),
      copied: false,
      selected: false
    }));

    setEmails(prev => [...prev, ...toAdd]);
    setBulkInput("");
    setIsAddModalOpen(false);
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
    // Reset copy status after visual feedback if desired, or keep it blue as requested
  };

  const startEdit = (email: EmailItem) => {
    setEditingId(email.id);
    setEditValue(email.text);
  };

  const saveEdit = () => {
    if (editingId) {
      setEmails(prev => prev.map(e => e.id === editingId ? { ...e, text: editValue } : e));
      setEditingId(null);
    }
  };

  // Pagination Logic
  const canGoPrev = pageIndex > 0;
  const canGoNext = pageIndex < PAGES.length - 1; // Can always browse empty pages A-E? Or limit? Let's limit to 4 (E)

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
      {/* Controls Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold flex items-center gap-2">NewTask Emails</h3>
        <div className="flex gap-2">
          <button 
            disabled={emails.length >= MAX_EMAILS}
            onClick={() => setIsAddModalOpen(true)}
            className="p-1.5 rounded-lg bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            title="Add Emails"
          >
            <Plus size={18} />
          </button>
          <button 
            disabled={!emails.some(e => e.selected)}
            onClick={handleDeleteSelected}
            className="p-1.5 rounded-lg bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            title="Delete Selected"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Pagination Bar */}
      <div className="flex items-center justify-between bg-black/20 rounded-lg p-2 mb-4">
        <button 
          onClick={() => setPageIndex(p => Math.max(0, p - 1))}
          disabled={!canGoPrev}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>
        
        <span className="font-mono font-bold text-blue-400">Page {PAGES[pageIndex]}</span>
        
        <button 
          onClick={() => setPageIndex(p => Math.min(4, p + 1))}
          disabled={!canGoNext}
          className="p-1 hover:bg-white/10 rounded disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Email List Table */}
      <div className="min-h-[220px]">
        {currentEmails.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-sm opacity-30 italic border border-dashed border-white/10 rounded-lg">
            Empty Page
          </div>
        ) : (
          <div className="space-y-2">
            {currentEmails.map(email => (
              <div 
                key={email.id} 
                className={`flex items-center gap-3 p-2 rounded-lg border transition-all duration-300
                  ${email.selected ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/5 hover:bg-white/10'}
                `}
              >
                {/* Edit Button (Left) */}
                <button 
                  onClick={() => startEdit(email)}
                  className="text-gray-500 hover:text-blue-400 p-1 opacity-60 hover:opacity-100"
                >
                  <Edit3 size={14} />
                </button>

                {/* Email Text (Center) */}
                {editingId === email.id ? (
                  <div className="flex-1 flex gap-2">
                    <input 
                      value={editValue} 
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 bg-black/40 rounded px-2 py-1 text-sm outline-none border border-blue-500"
                      autoFocus
                    />
                    <button onClick={saveEdit} className="text-green-500"><Check size={16} /></button>
                  </div>
                ) : (
                  <span 
                    onClick={() => handleCopy(email.id, email.text)}
                    className={`flex-1 text-sm cursor-pointer select-none truncate transition-all
                      ${email.copied ? 'text-blue-400 font-bold' : 'text-gray-300'}
                    `}
                    title="Click to copy"
                  >
                    {email.text}
                  </span>
                )}

                {/* Select Tick (Right) */}
                <button 
                  onClick={() => toggleSelect(email.id)}
                  className={`w-5 h-5 rounded border flex items-center justify-center transition-all
                    ${email.selected ? 'bg-blue-500 border-blue-500 text-white' : 'border-white/20 hover:border-white/50 text-transparent'}
                  `}
                >
                  <Check size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add Emails">
        <p className="text-sm opacity-60 mb-2">Paste emails separated by new lines, commas, or spaces.</p>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          placeholder="e.g. \njohn@doe.com\njane@doe.com"
          className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-3 text-sm outline-none focus:border-blue-500 mb-4 font-mono resize-none"
        />
        <div className="flex justify-end gap-2">
          <button onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm opacity-70 hover:opacity-100">Cancel</button>
          <button onClick={handleAddEmails} className="px-6 py-2 bg-blue-600 rounded-lg text-white text-sm hover:bg-blue-500 font-medium">Add Emails</button>
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
      <div className="flex justify-center gap-4 mb-6 shrink-0">
        <button onClick={() => setActiveTab('self')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium ${activeTab === 'self' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}>
          <User size={16} /> Self
        </button>
        <button onClick={() => setActiveTab('office')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium ${activeTab === 'office' ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 hover:bg-white/10 text-gray-400'}`}>
          <Building size={16} /> Office
        </button>
      </div>
      
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        {activeTab === 'self' ? (
           <div className="space-y-4 max-w-2xl mx-auto pb-10">
             {/* 1. LinkedIn Calculator */}
             <LinkedInSection />
             
             {/* 2. Task Sent Links */}
             <SentLinksSection />
             
             {/* 3. Email Manager */}
             <EmailManagerSection />
           </div>
        ) : (
          <div className="text-center space-y-4">
             <div className="bg-white/5 border border-white/10 rounded-xl p-8 flex flex-col items-center justify-center h-64">
               <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-4">
                 <Building className="opacity-50" />
               </div>
               <h3 className="text-xl font-bold opacity-80">Office Dashboard</h3>
               <p className="opacity-40 text-sm">Waiting for instructions...</p>
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
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeApp, setActiveApp] = useState<AppType | null>('newtask'); // Default to newtask for testing
  const [isMaximized, setIsMaximized] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  const menuItems = [
    { id: 'newtask', icon: CheckSquare, label: 'NewTask', color: 'text-blue-400' },
    { id: 'entries', icon: Table, label: 'Count Entries', color: 'text-green-400' },
    { id: 'tracker', icon: Clock, label: 'Tracker', color: 'text-orange-400' },
    { id: 'updates', icon: Zap, label: 'Updates', color: 'text-yellow-400' },
    { id: 'snacks', icon: Coffee, label: 'F & B', color: 'text-pink-400' },
  ];

  const handleClose = () => { setActiveApp(null); setIsMaximized(false); };
  const handleMaximize = () => setIsMaximized(true);
  const handleMinimize = () => setIsMaximized(false);

  if (!isClient) return null;

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-gray-100 dark:bg-[#050505] transition-colors duration-500">
      
      {/* Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[20%] w-96 h-96 bg-purple-500/30 rounded-full blur-[100px] animate-blob" />
        <div className="absolute top-[40%] right-[20%] w-96 h-96 bg-cyan-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
      </div>

      {/* Main Glass Container */}
      <motion.div 
        layout
        className={`relative z-10 w-full max-w-[750px] transition-all duration-500 ease-spring
          ${isMaximized ? 'fixed inset-4 max-w-none max-h-none h-auto z-50' : 'h-[95vh] max-h-[850px]'}
          glass-panel rounded-3xl flex flex-col overflow-hidden shadow-2xl border border-white/20
        `}
      >
        
        {/* --- Top Header --- */}
        <div className="flex items-center justify-between p-6 pb-2 shrink-0 select-none">
          {/* Left: Page Title & Logo */}
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-ubuntu font-bold tracking-tight opacity-90">
               {activeApp ? menuItems.find(i => i.id === activeApp)?.label : "Dashboard"}
            </h1>
          </div>

          {/* Right: Window Controls (Updated Position) */}
          <div className="flex items-center gap-3">
            {activeApp && (
              <div className="flex items-center gap-2 mr-4 bg-black/10 dark:bg-white/5 p-1.5 rounded-full border border-white/5">
                <button 
                  onClick={handleMinimize} 
                  className="group relative w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 flex items-center justify-center transition-all overflow-hidden"
                  title="Minimize"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/60 leading-none">-</span>
                </button>
                <button 
                  onClick={handleMaximize} 
                  className="group relative w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-all overflow-hidden"
                  title="Maximize"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[6px] font-bold text-black/60 leading-none">☐</span>
                </button>
                <button 
                  onClick={handleClose} 
                  className="group relative w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all overflow-hidden"
                  title="Close"
                >
                  <span className="opacity-0 group-hover:opacity-100 text-[8px] font-bold text-black/60 leading-none">x</span>
                </button>
              </div>
            )}

            {/* Logo/Edit Logic */}
            <div className="relative cursor-pointer group w-10 h-10" onClick={() => setIsEditMode(!isEditMode)}>
              <motion.div animate={{ x: isEditMode ? -30 : 0 }} className="relative z-20">
                <Image src="https://iili.io/FC3KC6g.png" alt="Logo" width={40} height={40} />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: isEditMode ? 1 : 0, x: isEditMode ? 0 : 10 }}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-blue-500 z-10"
              >
                <Edit3 size={18} />
              </motion.div>
            </div>

            {/* Theme Toggle */}
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>

        {/* --- Main Content Layout --- */}
        <div className="flex flex-1 overflow-hidden relative">
          
          {/* Sidebar Menu (Left) */}
          <div className="w-20 flex flex-col items-center py-6 gap-6 border-r border-white/10 bg-white/5 shrink-0 z-20 backdrop-blur-md">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeApp === item.id;
              
              return (
                <button 
                  key={item.id}
                  onClick={() => setActiveApp(item.id as AppType)}
                  className={`relative group p-3 rounded-2xl transition-all duration-300
                    ${isActive ? 'bg-white/20 dark:bg-white/10 shadow-lg scale-110' : 'hover:bg-white/10 opacity-60 hover:opacity-100'}
                  `}
                >
                  <Icon size={24} className={`${isActive ? item.color : 'text-gray-500 dark:text-gray-300'}`} />
                  <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    {item.label}
                  </span>
                  {isActive && <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />}
                </button>
              )
            })}
            <div className="mt-auto mb-2">
               <Link href="/" className="p-3 block rounded-2xl hover:bg-red-500/10 text-red-500 transition-colors opacity-60 hover:opacity-100">
                  <LogOut size={22} />
               </Link>
            </div>
          </div>

          {/* Application Stage */}
          <div className="flex-1 relative overflow-hidden bg-white/40 dark:bg-black/20 backdrop-blur-md">
            <AnimatePresence mode="wait">
              {activeApp ? (
                <motion.div 
                  key={activeApp}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="h-full w-full flex flex-col p-4 md:p-6"
                >
                   {activeApp === 'newtask' && <NewTaskApp />}
                   {activeApp === 'entries' && <div className="text-center opacity-40 mt-20">Entries Module Pending</div>}
                   {activeApp === 'tracker' && <div className="text-center opacity-40 mt-20">Tracker Module Pending</div>}
                   {activeApp === 'updates' && <div className="text-center opacity-40 mt-20">Updates Module Pending</div>}
                   {activeApp === 'snacks' && <div className="text-center opacity-40 mt-20">Snacks Module Pending</div>}
                </motion.div>
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                   <Image src="https://iili.io/FC3KC6g.png" width={80} height={80} className="mb-4 grayscale opacity-50" alt="Logo" />
                   <p className="text-sm">Select an app to begin</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Maximize Backdrop */}
      {isMaximized && <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-0" />}
    </div>
  );
}
