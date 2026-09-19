'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getRouteByZip } from '../app/actions/geo';

export default function GeoLocator() {
  const [zip, setZip] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleZipSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (zip.length < 5) return;
    setLoading(true);
    setError('');
    
    const res = await getRouteByZip(zip);
    if (res.url) {
      router.push(res.url);
    } else {
      setError(res.error || 'Location not found.');
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto relative group">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
      
      <form onSubmit={handleZipSubmit} className="relative bg-white rounded-2xl shadow-2xl flex flex-col sm:flex-row p-2 border border-slate-100 gap-2">
        
        <input 
          type="text" inputMode="numeric" pattern="[0-9]*" onFocus={(e) => { setTimeout(() => e.target.closest("form")?.scrollIntoView({ behavior: "smooth", block: "center" }), 300) }} 
          value={zip} 
          onChange={(e) => setZip(e.target.value.replace(/[^0-9]/g, ''))} 
          placeholder="Enter Zip Code" 
          maxLength={5}
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 font-extrabold text-2xl px-4 py-4 sm:py-3.5 outline-none tracking-widest text-center"
        />

        <button 
          type="submit" 
          disabled={loading || zip.length < 5}
          className="w-full sm:w-auto flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-black text-lg py-4 sm:py-3.5 px-8 sm:px-10 rounded-xl transition-all shadow-md whitespace-nowrap uppercase tracking-widest active:scale-95"
        >
          {loading ? 'Searching...' : 'Find Providers'}
        </button>
      </form>
      
      {error && (
        <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-full text-center">
          <span className="inline-block bg-red-100 text-red-700 text-xs font-bold px-4 py-2 rounded-full border border-red-200 shadow-sm animate-in fade-in slide-in-from-top-2">
            {error}
          </span>
        </div>
      )}
    </div>
  );
}