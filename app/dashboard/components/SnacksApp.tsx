"use client";
import React, { useState } from "react";
import { User, Coffee, Check } from "lucide-react";

export default function SnacksApp({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'person' | 'snacks'>('person');

  // Logic from your HTML reference
  const [persons, setPersons] = useState([
    { id: 1, name: 'Naimul Hasnat', checked: false },
    { id: 2, name: 'Nazmul Alam', checked: false },
    { id: 3, name: 'Tawhid Jihad', checked: false },
    { id: 4, name: 'Tariqul Rizvi', checked: false },
    { id: 5, name: 'Shahed Evan', checked: false },
    // Add rest of your list...
  ]);

  const togglePerson = (id: number) => {
    setPersons(prev => prev.map(p => p.id === id ? { ...p, checked: !p.checked } : p));
  };

  return (
    <div className="h-full flex flex-col relative">
      {/* Header Menu */}
      <div className="flex justify-center items-center gap-4 mb-4 shrink-0 relative">
        <button onClick={() => setActiveTab('person')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'person' ? 'bg-pink-500 border-pink-500 text-white shadow-lg shadow-pink-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <User size={16} /> Person
        </button>
        <button onClick={() => setActiveTab('snacks')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'snacks' ? 'bg-yellow-500 border-yellow-500 text-white shadow-lg shadow-yellow-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <Coffee size={16} /> Snacks
        </button>

        {/* Close Button Top Right of Sub-Menu */}
        <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2 group relative w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm">
          <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-black/60 leading-none">x</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {activeTab === 'person' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[95%] mx-auto">
             {persons.map(p => (
               <div key={p.id} onClick={() => togglePerson(p.id)} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${p.checked ? 'bg-red-500/10 border-red-500/30' : 'bg-white/40 dark:bg-white/5 border-black/5 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10'}`}>
                 <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{p.name}</span>
                 <div className={`w-10 h-6 rounded-full p-1 transition-colors flex items-center ${p.checked ? 'bg-red-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                   <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                 </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl mx-auto max-w-lg">
             <Coffee className="w-12 h-12 mx-auto mb-4 text-yellow-500 opacity-80" />
             <h3 className="text-lg font-bold text-gray-800 dark:text-white">Snacks Table</h3>
             <p className="text-sm text-gray-500 dark:text-gray-400">Snacks menu content from HTML reference goes here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
