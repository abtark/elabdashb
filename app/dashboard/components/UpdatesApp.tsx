"use client";
import React, { useState } from "react";
import { X, RotateCcw, Copy, Hourglass } from "lucide-react";

// ... (CloseButton component reused) ...
const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="absolute right-0 top-1/2 -translate-y-1/2 group flex items-center bg-transparent border border-white/20 dark:border-white/10 rounded-full p-1.5 hover:bg-red-500 hover:border-red-500 hover:pr-3 transition-all duration-300 text-gray-500 dark:text-gray-400 hover:text-white">
    <X size={16} />
    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold ml-0 group-hover:ml-1 whitespace-nowrap">Close</span>
  </button>
);

export default function UpdatesApp({ onClose, totalSentLinks, totalDailyEntry, generalElapsed, newTaskElapsed }: any) {
  const [otInput, setOtInput] = useState<string>('');
  const [toggles, setToggles] = useState({ fileDrive: false, fileHandling: false, fileDownload: false, fileCheck: false });

  const generalHour = generalElapsed / 3600000;
  const ntHour = newTaskElapsed / 3600000;
  const otHour = Math.max(0, generalHour - (parseFloat(otInput) || 0));

  const summary = `LA/FC/FL/Others ${totalDailyEntry} + New Task (${totalSentLinks}) ${toggles.fileCheck ? '+ [File Check]' : ''}`;

  return (
    <div className="h-full flex flex-col relative gap-4 max-w-[95%] mx-auto overflow-y-auto custom-scrollbar">
      <div className="relative flex justify-center items-center mb-0 shrink-0 min-h-[40px]">
         <div className="px-6 py-2 rounded-full bg-yellow-500 text-white font-medium text-sm shadow-lg shadow-yellow-500/20">ELab Updates</div>
         <CloseButton onClick={onClose} />
      </div>

      <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-4 flex justify-between items-center text-sm font-bold">
         <div>Total Sent Links = <span className="text-blue-600">{totalSentLinks}</span></div>
         <div className="h-4 w-px bg-gray-400"></div>
         <div>Today's Total Entry = <span className="text-blue-600">{totalDailyEntry}</span></div>
      </div>

      <div className="flex gap-4">
         <div className="flex-1 bg-white/40 dark:bg-black/20 rounded-2xl p-4 text-center">
            <div className="text-xs font-bold mb-2 flex items-center justify-center gap-2"><Hourglass size={12}/> General Hour</div>
            <div className="text-2xl font-bold">{generalHour.toFixed(2)}</div>
         </div>
         <div className="flex-1 bg-white/40 dark:bg-black/20 rounded-2xl p-4 text-center">
            <div className="text-xs font-bold mb-2 flex items-center justify-center gap-2"><Hourglass size={12}/> NewTask Hour</div>
            <div className="text-2xl font-bold">{ntHour.toFixed(2)}</div>
         </div>
      </div>

      <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-4 flex items-center gap-4">
         <input type="number" placeholder="Enter General Hour" value={otInput} onChange={(e) => setOtInput(e.target.value)} className="flex-1 bg-white/50 border border-gray-200 rounded-full px-4 py-2 text-center outline-none" />
         <div className="font-bold text-sm">OT Hour <span className="text-blue-600 ml-2 text-lg">{otHour.toFixed(2)}</span></div>
      </div>

      <div className="grid grid-cols-2 gap-2">
         {Object.keys(toggles).map(key => (
            <div key={key} onClick={() => setToggles(p => ({...p, [key]: !p[key]}))} className={`cursor-pointer p-3 rounded-xl border flex justify-between items-center transition-all ${toggles[key] ? 'bg-green-100 border-green-300' : 'bg-white/20 border-white/20'}`}>
               <span className="text-xs font-bold capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
               <div className={`w-8 h-4 rounded-full relative transition-colors ${toggles[key] ? 'bg-green-500' : 'bg-gray-400'}`}><div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-all ${toggles[key] ? 'right-0.5' : 'left-0.5'}`}/></div>
            </div>
         ))}
      </div>

      <div className="bg-white/40 dark:bg-black/20 rounded-2xl p-4 flex items-center gap-2 cursor-pointer hover:bg-white/50 transition-colors" onClick={() => navigator.clipboard.writeText(summary)}>
         <div className="flex-1 text-center font-medium text-sm opacity-80">{summary}</div>
         <Copy size={16} className="text-blue-500"/>
      </div>
    </div>
  );
}
