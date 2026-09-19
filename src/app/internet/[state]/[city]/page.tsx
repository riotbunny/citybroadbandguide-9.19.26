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
  const { state, city } = await params;
  const stateUpper = state.toUpperCase();
  const cityClean = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  // 1. Fetch Zip Codes
  const locations = await prisma.location.findMany({
    where: { state: stateUpper, city: { equals: cityClean } },
    orderBy: { zip: 'asc' }
  });

  if (locations.length === 0) {
    return <div className="p-20 text-center text-2xl">City not found.</div>;
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

  // Extract unique carriers active in this city
  const activeCarriersMap = new Map();
  let highestSpeed = 0;
  let lowestPrice = 999;

  coverages.forEach(cov => {
    if (cov.carrier.isActive) {
      if (!activeCarriersMap.has(cov.carrier.id)) {
        activeCarriersMap.set(cov.carrier.id, cov.carrier);
      }
      cov.carrier.plans.forEach(p => {
        const speed = Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0);
        if (speed > highestSpeed) highestSpeed = speed;
        if (p.price > 0 && p.price < lowestPrice) lowestPrice = p.price;
      });
    }
  });

  const uniqueCarriers = Array.from(activeCarriersMap.values());
  if (lowestPrice === 999) lowestPrice = 49.99; // Fallback
  
  // Sort carriers by rating or default to a reasonable fallback
  const topCarriers = uniqueCarriers.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 4);

  // 3. Generate FAQ Schema
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How many internet providers are in ${cityClean}, ${stateUpper}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `There are currently ${uniqueCarriers.length} residential internet providers offering services across ${cityClean}, including fiber, cable, and 5G home internet options.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the cheapest internet in ${cityClean}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `As of ${currentMonthYear}, internet plans in ${cityClean} start at $${Math.floor(lowestPrice)} per month. Pricing varies by your exact zip code and availability.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the fastest internet speed in ${cityClean}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The fastest residential internet speed mapped in ${cityClean} is up to ${highestSpeed} Mbps, primarily available through local fiber-optic networks.`
        }
      }
    ]
  };

  return (
    <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      
      {/* High-Converting Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-24 px-4 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide uppercase mb-6 shadow-inner">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Official City Broadband Data
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Internet Providers in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{cityClean}, {stateUpper}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed mb-10">
            We have mapped <strong className="text-white font-bold">{uniqueCarriers.length} providers</strong> across <strong className="text-white font-bold">{locations.length} zip codes</strong> in {cityClean}. 
            Speeds reach up to <strong className="text-indigo-400 font-bold">{highestSpeed} Mbps</strong> with plans starting at <strong className="text-emerald-400 font-bold">${Math.floor(lowestPrice)}/mo</strong>.
          </p>

          <div className="max-w-lg mx-auto bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl relative mb-12">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
            <p className="text-white text-lg md:text-xl font-bold mb-5 text-center drop-shadow-sm">Enter your zip code to see exactly who covers your street:</p>
            <GeoLocator />
          </div>
        </div>
      </div>

      {/* Aggregate City Data & Top Providers */}
      <div className="max-w-6xl mx-auto w-full px-4 -mt-10 relative z-20 mb-16">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-xl">
          <div className="w-full md:w-1/3 text-center md:text-left border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 pr-0 md:pr-6">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">City Coverage</p>
            <p className="text-3xl font-black text-slate-900">{locations.length} <span className="text-lg font-bold text-slate-500">Zip Codes</span></p>
          </div>
          <div className="w-full md:w-1/3 text-center border-b md:border-b-0 md:border-r border-slate-200 pb-6 md:pb-0 px-0 md:px-6">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Top Speed</p>
            <p className="text-3xl font-black text-slate-900">{highestSpeed} <span className="text-lg font-bold text-slate-500">Mbps</span></p>
          </div>
          <div className="w-full md:w-1/3 text-center md:text-right pl-0 md:pl-6">
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest mb-2">Starting Price</p>
            <p className="text-3xl font-black text-slate-900"><span className="text-emerald-500">$</span>{Math.floor(lowestPrice)} <span className="text-lg font-bold text-slate-500">/mo</span></p>
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <div className="flex-grow max-w-6xl mx-auto w-full py-10 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Browse {cityClean} Directory</h2>
          <p className="text-slate-500 mt-3 text-lg max-w-2xl mx-auto">
            Internet infrastructure varies block-by-block. Select your specific zip code below to view the hyper-local coverage map and exact pricing for your neighborhood.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {locations.map((loc, i) => (
            <Link 
              key={i} 
              href={`/internet/${state.toLowerCase()}/${city.toLowerCase()}/${loc.zip}`} 
              className="group relative bg-white p-6 rounded-2xl text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-200 hover:border-indigo-200 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/0 to-indigo-50/0 group-hover:from-indigo-50/50 group-hover:to-white transition-colors duration-300"></div>
              <div className="relative z-10 flex flex-col items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <span className="font-black text-xl text-slate-700 group-hover:text-indigo-700">{loc.zip}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <Footer />
    </main>
  )
}