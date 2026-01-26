"use client";
import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  color: string;
  bgColor: string; // Used for the active indicator line
}

interface SidebarProps {
  menuItems: MenuItem[];
  activeApp: string | null;
  setActiveApp: (id: string) => void;
}

export default function Sidebar({ menuItems, activeApp, setActiveApp }: SidebarProps) {
  return (
    <div className="w-24 flex flex-col items-center py-6 gap-6 border-r border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 shrink-0 z-20 backdrop-blur-md">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeApp === item.id;
        
        return (
          <button 
            key={item.id}
            onClick={() => setActiveApp(item.id)}
            className={`relative group p-4 rounded-2xl transition-all duration-300
              ${isActive ? 'bg-white/60 dark:bg-white/10 shadow-lg scale-110' : 'hover:bg-white/30 dark:hover:bg-white/5 opacity-60 hover:opacity-100'}
            `}
          >
            <Icon size={28} className={`${isActive ? item.color : 'text-gray-600 dark:text-gray-400'}`} />
            
            {/* Dynamic Active Indicator Line using item.bgColor */}
            {isActive && (
              <div className={`absolute -left-[1px] top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full ${item.bgColor}`} />
            )}
          </button>
        )
      })}
      
      <div className="mt-auto mb-2">
         <Link href="/" className="p-3 block rounded-2xl hover:bg-red-500/10 text-red-500 transition-colors opacity-60 hover:opacity-100">
            <LogOut size={26} />
         </Link>
      </div>
    </div>
  );
}
