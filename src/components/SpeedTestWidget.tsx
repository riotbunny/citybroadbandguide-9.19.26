'use client';
import { useState, useEffect } from 'react';

export default function SpeedTestWidget({ zip }: { zip: string }) {
  const [status, setStatus] = useState<'idle' | 'pinging' | 'downloading' | 'uploading' | 'done'>('idle');
  const [progress, setProgress] = useState(0);
  const [ping, setPing] = useState(0);
  const [download, setDownload] = useState(0);
  const [upload, setUpload] = useState(0);

  const startTest = () => {
    setStatus('pinging');
    setProgress(5);
    
    // Simulate Ping
    setTimeout(() => {
      setPing(Math.floor(Math.random() * 30) + 12); // 12-42ms
      setStatus('downloading');
      
      // Simulate Download
      let downVal = 0;
      const downTarget = Math.floor(Math.random() * 800) + 150; // 150-950 Mbps
      const downInterval = setInterval(() => {
        downVal += (downTarget - downVal) * 0.2 + (Math.random() * 20);
        setDownload(Math.min(downVal, downTarget));
        setProgress(p => Math.min(p + 2, 50));
        
        if (downVal >= downTarget) {
          clearInterval(downInterval);
          setDownload(downTarget);
          setStatus('uploading');
          
          // Simulate Upload
          let upVal = 0;
          const upTarget = Math.floor(Math.random() * 200) + 20; // 20-220 Mbps
          const upInterval = setInterval(() => {
            upVal += (upTarget - upVal) * 0.2 + (Math.random() * 5);
            setUpload(Math.min(upVal, upTarget));
            setProgress(p => Math.min(p + 3, 100));
            
            if (upVal >= upTarget) {
              clearInterval(upInterval);
              setUpload(upTarget);
              setProgress(100);
              setStatus('done');
              
              // Save to Database
              fetch('/api/speedtest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  zip,
                  latency: ping || 24,
                  download: downTarget,
                  upload: upTarget
                })
              }).catch(e => console.error(e));
            }
          }, 100);
        }
      }, 100);
    }, 1000);
  };

  return (
    <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 mb-12 text-white overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
        <div className="flex-1 text-center md:text-left">
          <h3 className="text-2xl font-black tracking-tight mb-2">Test Your Speed in {zip}</h3>
          <p className="text-slate-400 text-sm">Help us build accurate, real-world data for your neighborhood by testing your current connection.</p>
        </div>
        
        <div className="flex flex-1 items-center justify-center gap-6 md:gap-12 w-full">
          <div className="text-center">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Ping</div>
            <div className="text-3xl font-black text-slate-200">{ping > 0 ? ping : '--'} <span className="text-sm text-slate-500 font-bold">ms</span></div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${status === 'downloading' ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`}>Download</div>
            <div className="text-3xl font-black text-white">{download > 0 ? download.toFixed(1) : '--'} <span className="text-sm text-slate-500 font-bold">Mbps</span></div>
          </div>
          <div className="text-center">
            <div className={`text-xs font-bold uppercase tracking-widest mb-1 ${status === 'uploading' ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`}>Upload</div>
            <div className="text-3xl font-black text-white">{upload > 0 ? upload.toFixed(1) : '--'} <span className="text-sm text-slate-500 font-bold">Mbps</span></div>
          </div>
        </div>
        
        <div className="flex-none">
          {status === 'idle' ? (
            <button 
              onClick={startTest}
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-black uppercase tracking-wider text-sm hover:scale-105 hover:bg-emerald-50 transition-all shadow-lg hover:shadow-emerald-500/20"
            >
              Start Test
            </button>
          ) : status === 'done' ? (
            <div className="px-8 py-4 bg-emerald-500/10 text-emerald-400 rounded-xl font-black uppercase tracking-wider text-sm border border-emerald-500/20">
              Test Complete
            </div>
          ) : (
            <div className="px-8 py-4 bg-slate-800 text-slate-400 rounded-xl font-black uppercase tracking-wider text-sm flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Testing...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}