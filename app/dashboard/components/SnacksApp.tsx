"use client";
import React, { useState } from "react";
import { User, Coffee, X, Calendar, Edit2, Check } from "lucide-react";

// ... (CloseButton component reused) ...
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

export default function SnacksApp({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'person' | 'snacks'>('person');
  const [persons, setPersons] = useState(Array.from({length:16}, (_, i) => ({ id: i+1, name: `Person ${i+1}`, checked: false, editing: false })));
  const [snacksData, setSnacksData] = useState({ morning: 'Bread & Jelly', evening: 'Singara' });

  const toggleEdit = (id: number) => {
     setPersons(p => p.map(person => person.id === id ? { ...person, editing: !person.editing } : person));
  };
  const updateName = (id: number, val: string) => {
     setPersons(p => p.map(person => person.id === id ? { ...person, name: val } : person));
  };

  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-center items-center gap-4 mb-4 shrink-0 relative">
        <button onClick={() => setActiveTab('person')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border ${activeTab === 'person' ? 'bg-pink-500 border-pink-500 text-white' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400'}`}><User size={16} /> Person</button>
        <button onClick={() => setActiveTab('snacks')} className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium border ${activeTab === 'snacks' ? 'bg-yellow-500 border-yellow-500 text-white' : 'bg-white/20 border-transparent text-gray-600 dark:text-gray-400'}`}><Coffee size={16} /> Snacks</button>
        <CloseButton onClick={onClose} />
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
        {activeTab === 'person' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-[95%] mx-auto pb-4">
             {persons.map(p => (
               <div key={p.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${p.checked ? 'bg-red-500/10 border-red-500/30' : 'bg-white/40 dark:bg-white/5 border-black/5 dark:border-white/10'}`}>
                 <div className="flex items-center gap-2 flex-1">
                    <button onClick={() => toggleEdit(p.id)} className="text-gray-400 hover:text-blue-500">{p.editing ? <Check size={14}/> : <Edit2 size={14}/>}</button>
                    {p.editing ? <input className="bg-transparent border-b border-blue-500 outline-none w-full text-sm" value={p.name} onChange={e => updateName(p.id, e.target.value)} autoFocus /> : <span className="text-sm font-medium">{p.name}</span>}
                 </div>
                 <div onClick={() => setPersons(prev => prev.map(per => per.id === p.id ? { ...per, checked: !per.checked } : per))} className={`cursor-pointer w-10 h-6 rounded-full p-1 transition-colors flex items-center ${p.checked ? 'bg-red-500 justify-end' : 'bg-gray-300 dark:bg-gray-600 justify-start'}`}>
                   <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                 </div>
               </div>
             ))}
          </div>
        ) : (
          <div className="text-center p-6 bg-white/40 dark:bg-white/5 border border-black/5 dark:border-white/10 rounded-2xl mx-auto max-w-lg space-y-4">
             <div className="flex justify-between items-center bg-white/20 p-2 rounded-lg"><h3 className="font-bold text-blue-500">ELAB SNACKS</h3><span className="flex items-center gap-2 text-sm font-medium"><Calendar size={14}/> {new Date().toLocaleDateString()}</span></div>
             <div className="space-y-2 text-left">
                <div className="bg-white/30 p-3 rounded-lg"><div className="text-xs font-bold opacity-50 mb-1">Morning</div><input value={snacksData.morning} onChange={e => setSnacksData({...snacksData, morning:e.target.value})} className="w-full bg-transparent font-medium outline-none"/></div>
                <div className="bg-white/30 p-3 rounded-lg"><div className="text-xs font-bold opacity-50 mb-1">Evening</div><input value={snacksData.evening} onChange={e => setSnacksData({...snacksData, evening:e.target.value})} className="w-full bg-transparent font-medium outline-none"/></div>
             </div>
             <button className="w-full py-2 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold transition-colors shadow-lg">Send to Discord</button>
          </div>
        )}
      </div>
    </div>
  );
}
