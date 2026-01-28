"use client";
import React, { useState, useEffect } from "react";
import { User, Coffee, X, Edit2, Check, Calendar, Send } from "lucide-react";

// --- Types ---
interface Person {
  id: number;
  name: string;
  checked: boolean;
  editing: boolean;
}

interface SnackDay {
  day: string;
  dateStr: string; // For display and matching
  morning: string;
  evening: string;
  selected: boolean;
  isToday: boolean;
}

// --- UTILS ---
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

// Helper to get current week (Sun-Thu)
const getCurrentWeek = (): SnackDay[] => {
  const now = new Date();
  const todayStr = now.toDateString();
  const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
  const startOffset = dayOfWeek; // Ensure we start on Sunday
  const startDate = new Date(now.setDate(now.getDate() - startOffset));

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const weekData: SnackDay[] = [];

  for (let i = 0; i < 5; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    weekData.push({
      day: days[i],
      dateStr: currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
      morning: '',
      evening: '',
      selected: false,
      isToday: currentDate.toDateString() === todayStr
    });
  }
  return weekData;
};


export default function SnacksApp({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'person' | 'snacks'>('person');
  const [isClient, setIsClient] = useState(false);

  // --- STATE WITH PERSISTENCE ---
  
  // 1. Person State
  const [persons, setPersons] = useState<Person[]>([]);
  
  useEffect(() => {
    setIsClient(true);
    const savedPersons = localStorage.getItem('snacks_persons');
    if (savedPersons) {
      setPersons(JSON.parse(savedPersons));
    } else {
      // Default initialize if empty
      setPersons(Array.from({length:16}, (_, i) => ({ id: i+1, name: `Person ${i+1}`, checked: false, editing: false })));
    }
  }, []);

  useEffect(() => {
    if (isClient && persons.length > 0) {
       localStorage.setItem('snacks_persons', JSON.stringify(persons));
    }
  }, [persons, isClient]);


  // 2. Snacks Data State (Weekly)
  const [weeklySnacks, setWeeklySnacks] = useState<SnackDay[]>([]);

  useEffect(() => {
    if (!isClient) return;
    const currentWeekBase = getCurrentWeek();
    const savedSnacks = localStorage.getItem('weekly_snacks_menu');
    
    if (savedSnacks) {
      const parsedSaved: SnackDay[] = JSON.parse(savedSnacks);
      // Merge saved data with current date structure (to handle week changes)
      const merged = currentWeekBase.map(day => {
        const savedDay = parsedSaved.find(s => s.day === day.day);
        return savedDay ? { ...day, morning: savedDay.morning, evening: savedDay.evening, selected: savedDay.selected } : day;
      });
      setWeeklySnacks(merged);
    } else {
      setWeeklySnacks(currentWeekBase);
    }
  }, [isClient]);

  useEffect(() => {
     if (isClient && weeklySnacks.length > 0) {
        localStorage.setItem('weekly_snacks_menu', JSON.stringify(weeklySnacks));
     }
  }, [weeklySnacks, isClient]);


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
  const updateSnack = (index: number, field: 'morning' | 'evening', val: string) => {
    setWeeklySnacks(prev => prev.map((day, i) => i === index ? { ...day, [field]: val } : day));
  };
  const toggleSnackSelect = (index: number) => {
    setWeeklySnacks(prev => prev.map((day, i) => i === index ? { ...day, selected: !day.selected } : day));
  };

  // Stats Calculation based on HTML logic pattern
  const totalPersons = persons.length;
  const noSnackCount = persons.filter(p => p.checked).length; // Checked means "No Snack" based on previous context
  const takingCount = totalPersons - noSnackCount;


  if (!isClient) return null; // Prevent hydration mismatch

  return (
    <div className="h-full flex flex-col relative gap-4">
      {/* Header Menu */}
      <div className="flex justify-center items-center gap-4 shrink-0 relative min-h-[40px]">
        <button onClick={() => setActiveTab('person')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border ${activeTab === 'person' ? 'bg-pink-500 border-pink-500 text-white shadow-md' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400 hover:bg-white/30'}`}><User size={16} /> Person</button>
        <button onClick={() => setActiveTab('snacks')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border ${activeTab === 'snacks' ? 'bg-yellow-500 border-yellow-500 text-white shadow-md' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400 hover:bg-white/30'}`}><Coffee size={16} /> Snacks</button>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'person' ? (
          <div className="h-full flex flex-col gap-4 max-w-[95%] mx-auto">
             
             {/* Top Stats Section */}
             <div className="flex items-center justify-around bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-sm backdrop-blur-md text-center">
                <div>
                   <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Total</div>
                   <div className="text-xl font-bold text-blue-600 dark:text-blue-400">{totalPersons}</div>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>
                <div>
                   <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">No Snack</div>
                   <div className="text-xl font-bold text-red-500">{noSnackCount}</div>
                </div>
                <div className="w-px h-8 bg-gray-300 dark:bg-white/10"></div>
                <div>
                   <div className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Taking</div>
                   <div className="text-xl font-bold text-green-500">{takingCount}</div>
                </div>
             </div>

             {/* Person List Grid */}
             <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 pb-2">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {persons.map(p => (
                    <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all shadow-sm ${p.checked ? 'bg-red-500/10 border-red-500/30 dark:bg-red-900/20' : 'bg-white/60 dark:bg-white/5 border-white/40 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10'}`}>
                      {/* Left: Edit & Name */}
                      <div className="flex items-center gap-3 flex-1">
                         <button onClick={() => toggleEditPerson(p.id)} className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-blue-50 dark:hover:bg-white/5 transition-colors">{p.editing ? <Check size={16} className="text-green-500"/> : <Edit2 size={16}/>}</button>
                         {p.editing ? (
                           <input className="bg-white dark:bg-black/20 border border-blue-400 rounded px-2 py-1 text-sm outline-none w-full font-medium" value={p.name} onChange={e => updatePersonName(p.id, e.target.value)} autoFocus onKeyDown={e => e.key === 'Enter' && toggleEditPerson(p.id)} />
                         ) : (
                           <span className={`text-sm font-medium select-none ${p.checked ? 'text-red-600 dark:text-red-400 line-through opacity-70' : 'text-gray-800 dark:text-gray-200'}`}>{p.name}</span>
                         )}
                      </div>
                      {/* Right: Toggle Switch */}
                      <div onClick={() => togglePersonCheck(p.id)} className={`cursor-pointer w-11 h-6 rounded-full p-1 transition-colors flex items-center shadow-inner ${p.checked ? 'bg-red-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                        <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                    </div>
                  ))}
               </div>
             </div>
          </div>
        ) : (
          // Snacks Tab - Weekly Table View
          <div className="h-full flex flex-col gap-4 max-w-[95%] mx-auto overflow-hidden">
            
            <div className="flex justify-between items-center bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl p-3 shadow-sm backdrop-blur-md shrink-0">
                <h3 className="font-bold text-blue-600 dark:text-blue-400 flex items-center gap-2"><Coffee size={18}/> Weekly Menu</h3>
                <span className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white/20 dark:bg-white/5 px-3 py-1 rounded-full"><Calendar size={14}/> {new Date().toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}</span>
            </div>

            {/* Table Container */}
            <div className="flex-1 bg-white/40 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm backdrop-blur-md flex flex-col">
               {/* Table Header */}
               <div className="grid grid-cols-[80px_80px_1fr_1fr_60px] bg-blue-50/80 dark:bg-white/5 border-b border-blue-100 dark:border-white/10 text-xs font-bold text-gray-600 dark:text-gray-300 text-center py-3 shrink-0">
                  <div>Day</div>
                  <div>Date</div>
                  <div>Morning</div>
                  <div>Evening</div>
                  <div>Select</div>
               </div>
               
               {/* Table Body scrollable */}
               <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {weeklySnacks.map((item, index) => (
                     <div key={item.day} className={`grid grid-cols-[80px_80px_1fr_1fr_60px] items-center text-sm border-b border-gray-100 dark:border-white/5 transition-colors py-2
                        ${item.isToday ? 'bg-green-100/60 dark:bg-green-900/20' : 'hover:bg-white/30 dark:hover:bg-white/5'}
                     `}>
                        <div className={`font-medium text-center ${item.isToday ? 'text-green-700 dark:text-green-400 font-bold' : ''}`}>{item.day.slice(0,3)}</div>
                        <div className="text-gray-500 dark:text-gray-400 text-xs text-center">{item.dateStr}</div>
                        <div className="px-2">
                           <input value={item.morning} onChange={e => updateSnack(index, 'morning', e.target.value)} placeholder="Morning Menu" className={`w-full bg-transparent border-b ${item.isToday ? 'border-green-300 placeholder:text-green-700/50' : 'border-gray-200 dark:border-white/10 placeholder:text-gray-400'} py-1 px-1 outline-none focus:border-blue-400 transition-colors text-center`} />
                        </div>
                        <div className="px-2">
                           <input value={item.evening} onChange={e => updateSnack(index, 'evening', e.target.value)} placeholder="Evening Menu" className={`w-full bg-transparent border-b ${item.isToday ? 'border-green-300 placeholder:text-green-700/50' : 'border-gray-200 dark:border-white/10 placeholder:text-gray-400'} py-1 px-1 outline-none focus:border-blue-400 transition-colors text-center`} />
                        </div>
                        <div className="flex justify-center">
                           <input type="checkbox" checked={item.selected} onChange={() => toggleSnackSelect(index)} className="w-4 h-4 accent-blue-500 cursor-pointer" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>

            <button 
               disabled={!weeklySnacks.some(s => s.selected)}
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
