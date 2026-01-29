"use client";
import React, { useState, useEffect } from "react";
import { User, Coffee, X, Edit2, Check, Send } from "lucide-react";
import { motion } from "framer-motion";

// --- Types ---
interface Person {
  id: number;
  name: string;
  checked: boolean; // Checked = "No Snack"
  editing: boolean;
}

interface SnackRow {
  day: string;
  morning: string;
  evening: string;
  // We track selection by storing the specific "slot" selected (e.g., "Sat-Morning")
  // instead of boolean flags on every object to easily enforce single selection.
}

// --- UTILS ---
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function SnacksApp({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'person' | 'snacks'>('person');
  const [isClient, setIsClient] = useState(false);

  // --- STATE ---
  
  // 1. Person State
  const [persons, setPersons] = useState<Person[]>([]);
  
  // 2. Snacks State
  const [snackRows, setSnackRows] = useState<SnackRow[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<{ dayIndex: number, type: 'morning' | 'evening' } | null>(null);

  // --- INITIALIZATION & PERSISTENCE ---
  useEffect(() => {
    setIsClient(true);
    
    // Load Persons
    const savedPersons = localStorage.getItem('snacks_persons');
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    } else {
      setPersons(Array.from({length:16}, (_, i) => ({ id: i+1, name: `Person ${i+1}`, checked: false, editing: false })));
    }

    // Load Snacks
    const savedSnacks = localStorage.getItem('weekly_snacks_fixed');
    if (savedSnacks) {
      setSnackRows(JSON.parse(savedSnacks));
    } else {
      // Default Init (Sat - Fri)
      const defaults = DAYS.map(day => ({
        day,
        morning: 'Morning Snacks',
        evening: 'Evening Snacks'
      }));
      setSnackRows(defaults);
    }
  }, []);

  useEffect(() => {
    if (isClient && persons.length > 0) {
       localStorage.setItem('snacks_persons', JSON.stringify(persons));
    }
  }, [persons, isClient]);

  useEffect(() => {
     if (isClient && snackRows.length > 0) {
        localStorage.setItem('weekly_snacks_fixed', JSON.stringify(snackRows));
     }
  }, [snackRows, isClient]);


  // --- HANDLERS ---

  // Person Handlers
  const toggleEditPerson = (id: number) => {
     setPersons(p => p.map(person => person.id === id ? { ...person, editing: !person.editing } : person));
  };
  const updatePersonName = (id: number, val: string) => {
     setPersons(p => p.map(person => person.id === id ? { ...person, name: val } : person));
  };
  const togglePersonCheck = (id: number) => {
    setPersons(prev => prev.map(per => per.id === id ? { ...per, checked: !per.checked } : per));
  }

  // Snacks Handlers
  const updateSnackText = (index: number, field: 'morning' | 'evening', val: string) => {
    setSnackRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: val } : row));
  };

  const handleSlotClick = (index: number, type: 'morning' | 'evening') => {
    // Toggle: if clicking same slot, deselect it. Otherwise select new one.
    if (selectedSlot?.dayIndex === index && selectedSlot?.type === type) {
        setSelectedSlot(null);
    } else {
        setSelectedSlot({ dayIndex: index, type });
    }
  };

  const sendToDiscord = async () => {
    if (!selectedSlot) return;
    
    const row = snackRows[selectedSlot.dayIndex];
    const snackName = selectedSlot.type === 'morning' ? row.morning : row.evening;
    const timeLabel = selectedSlot.type === 'morning' ? 'Morning' : 'Evening';
    
    const content = `**Snack Selection:**\nDay: ${row.day}\nTime: ${timeLabel}\nItem: ${snackName}`;
    
    // User provided Webhook
    const webhookURL = "https://discord.com/api/webhooks/1414810052816011326/-dKyfHXA8f3y9LutcepbkvQIwiAkyAb_pWClYFvaiapfbmdP__KXzlYe1yd441i59qPQ";

    try {
      await fetch(webhookURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content })
      });
      alert("Sent to Discord!");
      setSelectedSlot(null); // Optional: clear selection after send
    } catch (e) {
      alert("Failed to send.");
      console.error(e);
    }
  };

  // Stats
  const totalPersons = persons.length;
  const noSnackCount = persons.filter(p => p.checked).length;
  const takingCount = totalPersons - noSnackCount;

  // Day Highlight Logic
  // JS getDay(): 0=Sun, 1=Mon ... 6=Sat.
  // Our Array: 0=Sat, 1=Sun ... 6=Fri.
  // Mapping JS Day to Array Index:
  const currentJsDay = new Date().getDay(); 
  // If Sun(0) -> Index 1. If Sat(6) -> Index 0. If Mon(1) -> Index 2.
  // Formula: (jsDay + 1) % 7
  const todayRowIndex = (currentJsDay + 1) % 7; 

  if (!isClient) return null;

  return (
    <div className="h-full flex flex-col relative gap-4 font-ubuntu">
      {/* Header Menu */}
      <div className="flex justify-center items-center gap-4 shrink-0 relative min-h-[40px]">
        <button onClick={() => setActiveTab('person')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === 'person' ? 'bg-pink-500 border-pink-500 text-white shadow-md' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400 hover:bg-white/30'}`}><User size={16} /> Person</button>
        <button onClick={() => setActiveTab('snacks')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border transition-all ${activeTab === 'snacks' ? 'bg-yellow-500 border-yellow-500 text-white shadow-md' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400 hover:bg-white/30'}`}><Coffee size={16} /> Snacks</button>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'person' ? (
          <div className="h-full flex flex-col gap-4 max-w-[95%] mx-auto">
             
             {/* Top Stats */}
             <div className="flex items-center justify-around bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-sm backdrop-blur-md text-center">
                <div><div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Total</div><div className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalPersons}</div></div>
                <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>
                <div><div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">No Snack</div><div className="text-xl font-bold text-red-500">{noSnackCount}</div></div>
                <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>
                <div><div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Taking</div><div className="text-xl font-bold text-green-500">{takingCount}</div></div>
             </div>

             {/* Person List */}
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {persons.map(p => (
                    <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all shadow-sm ${p.checked ? 'bg-red-500/10 border-red-500/30 dark:bg-red-900/10' : 'bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10'}`}>
                      <div className="flex items-center gap-3 flex-1">
                         <button onClick={() => toggleEditPerson(p.id)} className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">{p.editing ? <Check size={16} className="text-green-500"/> : <Edit2 size={16}/>}</button>
                         {p.editing ? (
                           <input className="bg-white dark:bg-black/40 border border-blue-400 rounded px-2 py-1 text-sm outline-none w-full font-medium text-gray-800 dark:text-white" value={p.name} onChange={e => updatePersonName(p.id, e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && toggleEditPerson(p.id)} />
                         ) : (
                           <span className="text-sm font-medium select-none text-gray-800 dark:text-white transition-colors">{p.name}</span>
                         )}
                      </div>
                      
                      {/* Animated Toggle Switch */}
                      <div onClick={() => togglePersonCheck(p.id)} className={`cursor-pointer w-11 h-6 rounded-full p-1 flex items-center shadow-inner transition-colors duration-300 ${p.checked ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        <motion.div 
                          layout 
                          className="w-4 h-4 bg-white rounded-full shadow-sm"
                          animate={{ x: p.checked ? 20 : 0 }}
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        ) : (
          // Snacks Tab
          <div className="h-full flex flex-col gap-4 max-w-[95%] mx-auto overflow-hidden">
            
            {/* Table Container */}
            <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm backdrop-blur-md flex flex-col">
               {/* Header */}
               <div className="grid grid-cols-[80px_1fr_1fr] bg-blue-50/80 dark:bg-white/5 border-b border-blue-100 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 text-center py-3 shrink-0">
                  <div>Day</div>
                  <div>Morning</div>
                  <div>Evening</div>
               </div>
               
               {/* Body */}
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {snackRows.map((row, index) => {
                     const isSelectedMorning = selectedSlot?.dayIndex === index && selectedSlot.type === 'morning';
                     const isSelectedEvening = selectedSlot?.dayIndex === index && selectedSlot.type === 'evening';
                     const isToday = index === todayRowIndex;

                     return (
                        <div key={row.day} className={`grid grid-cols-[80px_1fr_1fr] items-stretch text-sm border-b border-gray-100 dark:border-white/5 transition-colors min-h-[50px]
                           ${isToday ? 'bg-green-100/60 dark:bg-green-900/20' : 'hover:bg-white/30 dark:hover:bg-white/5'}
                        `}>
                           {/* Day Column */}
                           <div className={`flex items-center justify-center font-medium border-r border-gray-100 dark:border-white/5 ${isToday ? 'text-green-700 dark:text-green-400 font-bold' : 'text-gray-700 dark:text-gray-300'}`}>
                              {row.day.slice(0,3)}
                           </div>

                           {/* Morning Slot */}
                           <div 
                              onClick={(e) => {
                                 // Only select if not clicking input
                                 if(e.target instanceof HTMLInputElement) return;
                                 handleSlotClick(index, 'morning');
                              }}
                              className={`relative p-2 border-r border-gray-100 dark:border-white/5 cursor-pointer transition-all duration-200
                                 ${isSelectedMorning ? 'bg-blue-100/50 dark:bg-blue-500/20 inset-shadow' : ''}
                              `}
                           >
                              <input 
                                 value={row.morning} 
                                 onChange={e => updateSnackText(index, 'morning', e.target.value)} 
                                 className="w-full bg-transparent border-none outline-none text-center text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                                 placeholder="Enter Item"
                              />
                              {isSelectedMorning && <div className="absolute top-1 right-1 text-blue-500"><Check size={12} strokeWidth={4}/></div>}
                           </div>

                           {/* Evening Slot */}
                           <div 
                              onClick={(e) => {
                                 if(e.target instanceof HTMLInputElement) return;
                                 handleSlotClick(index, 'evening');
                              }}
                              className={`relative p-2 cursor-pointer transition-all duration-200
                                 ${isSelectedEvening ? 'bg-blue-100/50 dark:bg-blue-500/20 inset-shadow' : ''}
                              `}
                           >
                              <input 
                                 value={row.evening} 
                                 onChange={e => updateSnackText(index, 'evening', e.target.value)} 
                                 className="w-full bg-transparent border-none outline-none text-center text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                                 placeholder="Enter Item"
                              />
                              {isSelectedEvening && <div className="absolute top-1 right-1 text-blue-500"><Check size={12} strokeWidth={4}/></div>}
                           </div>
                        </div>
                     )
                  })}
               </div>
            </div>

            <button 
               disabled={!selectedSlot}
               onClick={sendToDiscord}
               className="w-full py-3 bg-[#5865F2] hover:bg-[#4752C4] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold transition-all shadow-lg flex items-center justify-center gap-2 shrink-0 active:scale-95"
            >
               <Send size={18} /> Send Selected to Discord
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
