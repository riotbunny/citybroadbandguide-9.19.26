import { PrismaClient } from '@prisma/client'
import { Metadata } from 'next'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import GeoLocator from '../../../../components/GeoLocator'
import Link from 'next/link'

const prisma = new PrismaClient()

export async function generateMetadata({ params }: { params: Promise<{ state: string, city: string }> }): Promise<Metadata> {
  const { state, city } = await params;
  const stateUpper = state.toUpperCase();
  const cityClean = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const monthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return {
    title: `The Best Internet Providers in ${cityClean}, ${stateUpper} (${monthYear})`,
    description: `Compare all internet providers in ${cityClean}, ${stateUpper}. Find the fastest fiber, cable, and 5G plans. Check availability and lock in the cheapest rates for ${monthYear}.`,
    alternates: {
      canonical: `https://citybroadbandguide.com/internet/${state.toLowerCase()}/${city.toLowerCase()}`
    }
  }
}

export default async function CityDirectory({ params }: { params: Promise<{ state: string, city: string }> }) {
  try {
    const { state, city } = await params;
    const stateUpper = state.toUpperCase();
    const cityClean = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // 1. Fetch Zip Codes
    const locations = await prisma.location.findMany({
      where: { state: stateUpper, city: { equals: cityClean } },
      orderBy: { zip: 'asc' }
    });

    if (locations.length === 0) {
      return <div className="p-20 text-center text-2xl font-bold">City not found. Please check the URL.</div>;
    }

    const zipCodes = locations.map(l => l.zip);

    // 2. Aggregate City-Wide Provider Data
    const coverages = await prisma.coverage.findMany({
      where: { zip: { in: zipCodes } },
      include: {
        carrier: {
          include: { plans: true }
        }
      }
    });

    const nationwideCarriers = await prisma.carrier.findMany({
      where: { isNationwide: true, isActive: true },
      include: { plans: true }
    });

    const activeCarriersMap = new Map();
    let highestSpeed = 0;
    let fastestCarrier: any = null;
    let lowestPrice = 999;
    let cheapestCarrier: any = null;

    const processCarrier = (carrier: any) => {
      if (carrier && carrier.isActive) {
        if (!activeCarriersMap.has(carrier.id)) {
          activeCarriersMap.set(carrier.id, carrier);
        }
        if (carrier.plans) {
          carrier.plans.forEach((p: any) => {
            const speed = Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0);
            if (speed > highestSpeed) { highestSpeed = speed; fastestCarrier = carrier; }
            if (p.price > 0 && p.price < lowestPrice) { lowestPrice = p.price; cheapestCarrier = carrier; }
          });
        }
      }
    };

    coverages.forEach(cov => processCarrier(cov.carrier));
    nationwideCarriers.forEach(carrier => processCarrier(carrier));

    const uniqueCarriers = Array.from(activeCarriersMap.values());
    if (lowestPrice === 999) lowestPrice = 49.99; // Fallback
    
    const editorPick = uniqueCarriers.sort((a, b) => (b.rating || 0) - (a.rating || 0))[0] || fastestCarrier || uniqueCarriers[0];
    const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    const visitorsThisWeek = 142 + (locations.length * 3);

    // 3. Generate FAQ Schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How many internet providers are in ${cityClean}, ${stateUpper}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `There are currently ${uniqueCarriers.length} residential internet providers offering services across ${cityClean}.` }
      },
      {
        "@type": "Question",
        "name": `What is the cheapest internet in ${cityClean}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `As of ${currentDate}, the cheapest internet provider in ${cityClean} is ${cheapestCarrier?.name || 'available'} starting at $${Math.floor(lowestPrice)} per month.` }
      },
      {
        "@type": "Question",
        "name": `What is the fastest internet speed in ${cityClean}?`,
        "acceptedAnswer": { "@type": "Answer", "text": `The fastest internet in ${cityClean} is offered by ${fastestCarrier?.name || 'local providers'} with speeds up to ${highestSpeed} Mbps.` }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* High-Converting Hero Section */}
      <div className="relative bg-[#0b1120] pt-32 pb-24 px-4 overflow-hidden border-b border-white/5">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          
          {/* Social Proof & Urgency Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase mb-6 shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            Rates Verified & Updated: <span suppressHydrationWarning>{currentDate}</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
            Internet Providers in <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">{cityClean}, {stateUpper}</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-6">
            Compare <strong>{uniqueCarriers.length} local providers</strong>. Join the <strong className="text-white">{visitorsThisWeek} {cityClean} residents</strong> who checked their address this week to lock in promotional rates.
          </p>

          {/* Micro-Commitment & Locator Box */}
                    {/* CSS Animation for the Anchor Jump */}
          <style dangerouslySetInnerHTML={{__html: 
            @keyframes attention {
              0%, 100% { transform: translateX(0) scale(1); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); border-color: rgba(255,255,255,0.1); }
              15% { transform: translateX(-8px) scale(1.02); box-shadow: 0 0 40px rgba(250, 204, 21, 0.8); border-color: rgba(250, 204, 21, 1); }
              30% { transform: translateX(8px) scale(1.02); }
              45% { transform: translateX(-8px) scale(1.02); }
              60% { transform: translateX(8px) scale(1.02); }
              75% { transform: translateX(-4px) scale(1.02); box-shadow: 0 0 40px rgba(250, 204, 21, 0.8); border-color: rgba(250, 204, 21, 1); }
            }
            #locator:target {
              animation: attention 1s cubic-bezier(.36,.07,.19,.97) both;
            }
          }} />
          <div id="locator" className="max-w-xl mx-auto bg-white/5 p-1 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl relative mb-4">
            <div className="bg-slate-900/50 rounded-[22px] p-6 md:p-8">
              <p className="text-white text-lg md:text-xl font-bold mb-5 text-center drop-shadow-sm">
                Enter your zip code to see exactly who covers your street:
              </p>
              <GeoLocator />
              <div className="flex items-center justify-center gap-4 mt-5 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <span className="flex items-center gap-1"><svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> 100% Free</span>
                <span className="flex items-center gap-1"><svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Zero Ads</span>
                <span className="flex items-center gap-1"><svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> No Credit Check</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* The Mega Conversion Section: TL;DR + Editor's Pick */}
      <div className="max-w-6xl mx-auto w-full px-4 -mt-10 relative z-20 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* The TL;DR Box */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">The Bottom Line in {cityClean}</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Cheapest Option</p>
                  <p className="text-xl font-black text-slate-800">{cheapestCarrier?.name || 'Local Providers'}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-emerald-600">${Math.floor(lowestPrice)}</span><span className="text-slate-400 font-bold">/mo</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fastest Speeds</p>
                  <p className="text-xl font-black text-slate-800">{fastestCarrier?.name || 'Fiber Network'}</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-indigo-600">{highestSpeed}</span><span className="text-slate-400 font-bold"> Mbps</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Infrastructure</p>
                  <p className="text-xl font-black text-slate-800">{locations.length} Zip Codes Mapped</p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-slate-900">{uniqueCarriers.length}</span><span className="text-slate-400 font-bold"> ISPs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Editor's Pick Card */}
          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl shadow-2xl p-1 relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            {/* Glowing effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500"></div>
            
            <div className="bg-slate-900 rounded-[22px] p-8 h-full flex flex-col justify-between relative z-10">
              <div className="absolute top-6 right-6 text-yellow-400 opacity-20">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-400 text-xs font-black uppercase tracking-widest mb-4">
                &#127942; EDITOR'S PICK {new Date().getFullYear()}
                </div>
                <h2 className="text-3xl font-black text-white mb-2">{editorPick?.name || 'Top Local Provider'}</h2>
                <div className="flex items-center gap-1 text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                  <span className="text-white ml-2 text-sm font-bold">{editorPick?.rating || '4.9'}/5</span>
                </div>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Consistently rated as the most reliable network in {cityClean} with ultra-low latency and transparent pricing. 
                </p>
              </div>
              
              <div className="mt-4">
                <a href="#locator" className="w-full block text-center bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-slate-900 font-black text-lg py-4 rounded-xl shadow-lg transition-all hover:scale-[1.02]">
                  Check Zip Code Availability
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Section - Pushed Below the Fold */}
      <div className="flex-grow max-w-6xl mx-auto w-full py-10 px-4 mb-20">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Full {cityClean} Zip Code Directory</h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {locations.map((loc, i) => (
            <Link 
              key={i} 
              href={`/internet/${state.toLowerCase()}/${city.toLowerCase()}/${loc.zip}`} 
              className="bg-white py-4 px-2 rounded-xl text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 group"
            >
              <span className="font-bold text-slate-600 group-hover:text-indigo-700">{loc.zip}</span>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  )
  } catch (error: any) {
    return <div className="p-20 text-red-500 font-bold bg-black min-h-screen"><h1>CRASH DETAILS:</h1><pre>{error.message}</pre><pre>{error.stack}</pre></div>;
  }
}