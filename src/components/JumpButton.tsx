"use client";
import React from 'react';

export default function JumpButton() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('locator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Force CSS animation restart
      el.classList.remove('animate-pulse-glow');
      void el.offsetWidth; // trigger browser reflow
      el.classList.add('animate-pulse-glow');
    }
  };

  return (
    <button 
      onClick={handleClick} 
      className="w-full block text-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-black text-lg py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02]"
    >
      Check Zip Code Availability
    </button>
  );
}