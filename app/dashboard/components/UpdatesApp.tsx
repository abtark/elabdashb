"use client";
import React from "react";

export default function UpdatesApp({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col relative">
      <div className="flex justify-center items-center gap-4 mb-4 shrink-0 relative">
        <div className="px-6 py-2 rounded-full bg-yellow-500 text-white font-medium text-sm shadow-lg shadow-yellow-500/20">
           ELab Updates
        </div>
         <button onClick={onClose} className="absolute right-0 top-1/2 -translate-y-1/2 group relative w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all shadow-sm">
          <span className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-black/60 leading-none">x</span>
        </button>
      </div>
       <div className="flex-1 flex items-center justify-center text-gray-500 opacity-50">
        Updates Logic Pending
      </div>
    </div>
  );
}
