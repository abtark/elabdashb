"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Check, RotateCcw, History, Compass, 
  Plus, Trash2, ChevronLeft, ChevronRight, CheckSquare, Edit3,
  User, Building 
} from "lucide-react";
import { motion } from "framer-motion";

// ... (Copy previous interfaces: EmailItem, Modal, ConfirmModal, LinkedInSection, SentLinksSection, EmailManagerSection code from previous turn exactly as is, just update the Parent Component return statement below) ...

// *** PASTE UTILITY COMPONENTS AND LOGIC SECTIONS FROM PREVIOUS TURN HERE *** // (To save space I am showing the Parent Component update which handles the button)

// ... [LinkedInSection code] ...
// ... [SentLinksSection code] ...
// ... [EmailManagerSection code] ...

// --- PARENT COMPONENT ---
interface NewTaskAppProps {
  onClose: () => void;
}

export default function NewTaskApp({ onClose }: NewTaskAppProps) {
  const [activeTab, setActiveTab] = useState<'self' | 'office'>('self');

  return (
    <div className="h-full flex flex-col relative">
      
      {/* Sub-Menu Header */}
      <div className="flex justify-center items-center gap-4 mb-3 shrink-0 relative">
        <button onClick={() => setActiveTab('self')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'self' ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <User size={16} /> Self
        </button>
        <button onClick={() => setActiveTab('office')} className={`flex items-center gap-2 px-6 py-2 rounded-full transition-all text-sm font-medium border ${activeTab === 'office' ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-500/20' : 'bg-white/20 dark:bg-white/5 border-transparent hover:bg-white/40 dark:hover:bg-white/10 text-gray-600 dark:text-gray-400'}`}>
          <Building size={16} /> Office
        </button>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full font-bold text-xs transition-all shadow-md ml-4"
        >
          Close <X size={14} />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {/* ... [Content remains same] ... */}
         {/* Placeholder for content logic from previous turn */}
         <div className="h-full flex flex-col gap-3 max-w-[95%] mx-auto">
             {/* Use your previous sections here */}
             <div className="flex-1 bg-white/5 rounded-lg flex items-center justify-center">Content Placeholder</div>
         </div>
      </div>
    </div>
  );
}
