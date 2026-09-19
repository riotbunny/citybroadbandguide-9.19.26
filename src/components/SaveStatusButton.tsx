'use client';

import { useFormStatus } from 'react-dom';
import { useEffect, useState, useRef } from 'react';

export default function SaveStatusButton() {
  const { pending } = useFormStatus();
  const [saved, setSaved] = useState(false);
  const wasPending = useRef(false);

  useEffect(() => {
    if (pending) {
      wasPending.current = true;
      setSaved(false);
    } else if (wasPending.current && !pending) {
      // The server action just finished
      setSaved(true);
      wasPending.current = false;
      
      // Clear the "Saved!" message after 2.5 seconds
      const timer = setTimeout(() => setSaved(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [pending]);

  if (saved) {
    return (
      <button type="button" disabled className="text-emerald-500 font-bold flex items-center gap-1 transition-all">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        Saved!
      </button>
    );
  }

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className={`font-semibold transition ${pending ? 'text-slate-400 cursor-not-allowed' : 'text-green-600 hover:text-green-800 hover:underline'}`}
    >
      {pending ? 'Saving...' : 'Save Inputs'}
    </button>
  );
}