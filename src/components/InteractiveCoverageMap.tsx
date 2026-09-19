"use client";

import React, { useState } from 'react';
import USAMap from 'react-usa-map';

interface CarrierData {
  id: string;
  name: string;
  brandColor: string;
  states: string[];
  isNationwide: boolean;
}

const ALL_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA",
  "HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

export default function InteractiveCoverageMap({ carriers }: { carriers: CarrierData[] }) {
  const [selectedCarrierId, setSelectedCarrierId] = useState<string>(carriers[0]?.id || "");

  const activeCarrier = carriers.find(c => c.id === selectedCarrierId);

  // Build the customization object for the map
  
  const handleMapClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const customizeMap = () => {
    if (!activeCarrier) return {};
    
    const fillState = activeCarrier.isNationwide ? ALL_STATES : activeCarrier.states;
    const config: Record<string, { fill: string }> = {};
    
    fillState.forEach(state => {
      config[state.toUpperCase()] = {
        fill: activeCarrier.brandColor || "#4f46e5"
      };
    });
    
    return config;
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 mb-4">Live Coverage Map</h2>
        <p className="text-slate-500 mb-6">Select a provider below to view their estimated coverage footprint.</p>
        
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {carriers.map(carrier => (
            <button
              key={carrier.id}
              onClick={() => setSelectedCarrierId(carrier.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all border ${
                selectedCarrierId === carrier.id 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
              }`}
            >
              {carrier.name}
            </button>
          ))}
        </div>
      </div>

            <style>{`
        .usa-map-wrapper svg {
          filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
        }
        .usa-map-wrapper svg path {
          transition: all 0.2s ease-in-out;
          cursor: pointer;
          stroke: #ffffff;
          stroke-width: 1px;
          transform-origin: center;
        }
        .usa-map-wrapper svg path:hover {
          filter: brightness(1.15) drop-shadow(0 0px 8px rgba(0,0,0,0.4));
          stroke-width: 2px;
          opacity: 0.9;
        }
      `}</style>
      <div className="flex justify-center max-w-3xl mx-auto overflow-hidden">
        {/* We use a wrapper to scale the map responsively on mobile */}
        <div className="w-full usa-map-wrapper" style={{ minWidth: '300px' }}>
          <USAMap customize={customizeMap()} onClick={handleMapClick} defaultFill="#e2e8f0" width="100%" />
        </div>
      </div>
      
      {activeCarrier && (
        <div className="mt-8 text-center bg-slate-50 p-6 rounded-2xl border border-slate-100">
          <h3 className="font-black text-lg text-slate-800 flex items-center justify-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: activeCarrier.brandColor || "#4f46e5" }}></span>
            {activeCarrier.name} Coverage
          </h3>
          <p className="text-sm text-slate-500 mt-2">
            {activeCarrier.isNationwide 
              ? "This provider offers nationwide coverage. Actual speeds and availability vary by neighborhood." 
              : `Currently available in ${activeCarrier.states.length} states based on our location database.`}
          </p>
        </div>
      )}
    </div>
  );
}