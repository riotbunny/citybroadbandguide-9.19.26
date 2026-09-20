import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import LocalRatings from '../../../../../../components/LocalRatings'
import { Metadata } from 'next'
import Navbar from '../../../../../../components/Navbar'
import SortDropdown from '../../../../../../components/SortDropdown'
import GeoLocator from '../../../../../../components/GeoLocator'

const prisma = new PrismaClient()

type Props = {
  params: Promise<{ state: string, city: string, zip: string }>;
  searchParams?: Promise<{ type?: string, sort?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state, city, zip } = await params;
  
  const location = await prisma.location.findUnique({ 
    where: { zip: zip },
    include: { coverages: { include: { carrier: true } } }
  });
  if (!location) return { title: 'Not Found' }
  const cityName = location.city;
  const stateUpper = location.state.toUpperCase();
  const activeCarriers = location.coverages.filter(c => c.carrier.isActive);
  const currentYear = new Date().getFullYear();
  
  return {
    title: `Best Internet Providers in ${cityName}, ${stateUpper} ${location.zip} | ${currentYear} Comparison`,
    description: `Compare the fastest and cheapest internet providers in ${cityName}, ${stateUpper} (${location.zip}). Find fiber and cable plans from top carriers available at your exact address.`,
    alternates: { canonical: `https://yourwebsite.com/internet/${state.toLowerCase()}/${city.toLowerCase()}/${zip}` },
    robots: activeCarriers.length > 0 ? { index: true, follow: true } : { index: false, follow: true }
  }
}

export default async function LocationPage({ params, searchParams }: Props) {
  const { state, city, zip } = await params;
  const searchParamsAwaited = await searchParams;
  const activeFilter = searchParamsAwaited?.type || 'all';
  const activeSort = searchParamsAwaited?.sort || 'price_asc';

  const getFilterUrl = (type: string) => {
    const p = new URLSearchParams();
    if (type !== 'all') p.set('type', type);
    if (activeSort !== 'recommended') p.set('sort', activeSort);
    const qs = p.toString();
    return qs ? '?' + qs : '?';
  };
const location = await prisma.location.findUnique({
    where: { zip: zip },
    include: { coverages: { include: { carrier: { include: { plans: true } } } } }
  });

  
  if (!location) return notFound();
  
  const nearbyZips = await prisma.location.findMany({
    where: { city: location.city, state: location.state, zip: { not: zip } },
    take: 6,
    select: { zip: true }
  });


  const cityName = location.city;
  const stateUpper = location.state;
  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  
  const nearbyLocations = await prisma.location.findMany({
    where: { city: cityName, state: stateUpper, zip: { not: zip } },
    take: 12
  });

  const mappedCarriers = location.coverages.map(c => c.carrier).filter(c => c.isActive);
  const nationwideCarriers = await prisma.carrier.findMany({ 
    where: { isNationwide: true, isActive: true },
    include: { plans: true }
  });
  
  const allCarriersMap = new Map();
  [...mappedCarriers, ...nationwideCarriers].forEach(c => allCarriersMap.set(c.id, c));
  const availableCarriers = Array.from(allCarriersMap.values());
  
  let filteredCarriers = availableCarriers;
  if (activeFilter === 'fiber') filteredCarriers = availableCarriers.filter(c => c.hasFiber);
  if (activeFilter === 'cable') filteredCarriers = availableCarriers.filter(c => c.hasCable);
  if (activeFilter === '5g') filteredCarriers = availableCarriers.filter(c => c.has5G);
  if (activeFilter === 'satellite') filteredCarriers = availableCarriers.filter(c => c.hasSatellite);

  if (activeSort === 'price_asc') {
    filteredCarriers.sort((a, b) => {
      const validA = a.plans?.map((p: any) => p.price).filter((p: any) => p > 0) || []; const priceA = validA.length > 0 ? Math.min(...validA) : Infinity;
      const validB = b.plans?.map((p: any) => p.price).filter((p: any) => p > 0) || []; const priceB = validB.length > 0 ? Math.min(...validB) : Infinity;
      return priceA - priceB;
    });
  } else if (activeSort === 'speed_desc') {
    filteredCarriers.sort((a, b) => {
      const speedA = a.plans?.length > 0 ? Math.max(...a.plans.map((p: any) => Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0))) : 0;
      const speedB = b.plans?.length > 0 ? Math.max(...b.plans.map((p: any) => Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0))) : 0;
      return speedB - speedA;
    });
  } else {
    filteredCarriers.sort((a, b) => {
      if (a.isTopPick && !b.isTopPick) return -1;
      if (!a.isTopPick && b.isTopPick) return 1;
      return 0;
    });
  }

  const lowestOverallPrice = availableCarriers.reduce((min, c) => {
    const validPrices = c.plans?.map((p: any) => p.price).filter((price: number) => price > 0) || [];
    const minPlan = validPrices.length ? Math.min(...validPrices) : Infinity;
    return minPlan < min ? minPlan : min;
  }, Infinity);

  const highestOverallSpeed = availableCarriers.reduce((max, c) => {
    const maxPlan = c.plans?.length ? Math.max(...c.plans.map((p: any) => Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0))) : 0;
    return maxPlan > max ? maxPlan : max;
  }, 0);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": `Internet Providers in ${cityName}, ${stateUpper} ${location.zip}`,
      "description": `Comparison of internet providers available in ${location.zip}.`,
      "provider": availableCarriers.map(c => ({
        "@type": "Organization",
        "name": c.name,
        "url": c.affiliateUrl || `https://yourwebsite.com/providers/${c.slug}`
      }))
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://yourwebsite.com" },
        { "@type": "ListItem", "position": 2, "name": stateUpper, "item": `https://yourwebsite.com/internet/${state.toLowerCase()}` },
        { "@type": "ListItem", "position": 3, "name": cityName, "item": `https://yourwebsite.com/internet/${state.toLowerCase()}/${city.toLowerCase()}` },
        { "@type": "ListItem", "position": 4, "name": location.zip, "item": `https://yourwebsite.com/internet/${state.toLowerCase()}/${city.toLowerCase()}/${location.zip}` }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": `What is the fastest internet provider in ${location.zip}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `The fastest internet provider currently mapped in ${location.zip} offers speeds up to ${highestOverallSpeed} Mbps.`
          }
        },
        {
          "@type": "Question",
          "name": `How much does internet cost in ${cityName}, ${stateUpper}?`,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": `Internet plans in ${cityName} start at roughly $${Math.floor(lowestOverallPrice !== Infinity ? lowestOverallPrice : 50)} per month depending on the speed tier and connection type.`
          }
        }
      ]
    }
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      
      <div className="bg-slate-950 pt-32 pb-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          
          <nav className="flex justify-center text-xs font-bold text-slate-500 mb-8 space-x-3 uppercase tracking-widest">
            <a href="/" className="hover:text-indigo-400 transition-colors">Home</a>
            <span className="text-slate-700">/</span>
            <a href={`/internet/${state.toLowerCase()}`} className="hover:text-indigo-400 transition-colors">{stateUpper}</a>
            <span className="text-slate-700">/</span>
            <a href={`/internet/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-indigo-400 transition-colors">{cityName}</a>
            <span className="text-slate-700">/</span>
            <span className="text-white">{location.zip}</span>
          </nav>

          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6 leading-tight">
            Best Internet in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{cityName}, {stateUpper}</span>
          </h1>
          <p className="mt-4 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
            We found <strong className="text-white font-bold">{availableCarriers.length}</strong> top-rated providers offering ultra-fast internet to <strong className="text-white font-bold tracking-widest">{location.zip}</strong>.
          </p>
          <LocalRatings location={location} availableCarriers={availableCarriers} />
          <div className="mt-8 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             Rates Updated: {currentMonthYear}
          </div>
          
          <div className="mt-12 max-w-md mx-auto">
            <p className="text-slate-400 text-sm font-semibold mb-3">Not shopping in {cityName}? Change zip code:</p>
            <GeoLocator />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 w-full mb-8">
        {availableCarriers.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 mb-10 flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-xl">
            <div className="flex items-center gap-5 w-full lg:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Providers</p>
                <p className="text-3xl font-black text-slate-900">{availableCarriers.length} <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active</span></p>
              </div>
            </div>
            
            <div className="hidden lg:block w-px h-16 bg-slate-100"></div>
            
            <div className="flex items-center gap-5 w-full lg:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Starting Price</p>
                <p className="text-3xl font-black text-slate-900">{lowestOverallPrice !== Infinity ? `$${Math.floor(lowestOverallPrice)}` : '--'}<span className="text-sm font-bold text-slate-500">/mo</span></p>
              </div>
            </div>
            
            <div className="hidden lg:block w-px h-16 bg-slate-100"></div>
            
            <div className="flex items-center gap-5 w-full lg:w-auto">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Max Local Speed</p>
                <p className="text-3xl font-black text-slate-900">{highestOverallSpeed > 0 ? highestOverallSpeed : '--'} <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Mbps</span></p>
              </div>
            </div>
            
            <div className="hidden lg:block w-px h-16 bg-slate-100"></div>
            
            <div className="flex items-center gap-5 w-full lg:w-auto flex-grow">
              <div className="w-full">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Coverage Confidence</p>
                  <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">95% (High Confidence)</p>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner">
                   <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 w-[95%]"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {availableCarriers.length > 0 && (
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
             <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest mr-4">Filter:</span>
                <a href={getFilterUrl('all')} className={`text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl whitespace-nowrap transition-all ${activeFilter === 'all' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>All Connections</a>
                <a href={getFilterUrl('fiber')} className={`text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl whitespace-nowrap transition-all ${activeFilter === 'fiber' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>Fiber Only</a>
                <a href={getFilterUrl('cable')} className={`text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl whitespace-nowrap transition-all ${activeFilter === 'cable' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>Cable</a>
                <a href={getFilterUrl('5g')} className={`text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl whitespace-nowrap transition-all ${activeFilter === '5g' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>5G Home</a>
                <a href={getFilterUrl('satellite')} className={`text-xs font-black uppercase tracking-widest px-5 py-3 rounded-xl whitespace-nowrap transition-all ${activeFilter === 'satellite' ? 'bg-slate-900 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 shadow-sm'}`}>Satellite</a>
             </div>
             <div className="flex items-center gap-4 w-full md:w-auto">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Sort:</span>
<SortDropdown />
             </div>
          </div>
        )}

        {filteredCarriers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-24">
            {filteredCarriers.map((carrier, idx) => {
              const validPrices = carrier.plans?.map((p: any) => p.price).filter((p: any) => p > 0) || [];
                const lowestPrice = validPrices.length > 0 ? Math.min(...validPrices) : null;
              const highestSpeed = carrier.plans?.length > 0 ? Math.max(...carrier.plans.map((p: any) => Math.max(p.downloadSpeed || 0, p.uploadSpeed || 0))) : null;
              
              return (
                <div key={carrier.id} className="group relative bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between overflow-hidden" style={{ borderTopWidth: '6px', borderTopColor: carrier.brandColor }}>
                  {carrier.isTopPick && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-black uppercase tracking-wider py-1 px-3 rounded-bl-xl shadow-md z-20 flex items-center gap-1.5 border-b border-l border-white/20">
                      <div className="bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                        <span className="text-[13px] leading-none block -mt-[1px]">&#128293;</span>
                      </div>
                      <span className="tracking-widest pr-1">TOP PICK</span>
                    </div>
                  )}
                  
                  <div>
                    <div className="h-14 md:h-16 flex items-center justify-start mb-6">
                      {carrier.logoPath ? (
                        <img src={carrier.logoPath} alt={carrier.name} className="max-h-full max-w-[140px] object-contain group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{carrier.name}</h3>
                      )}
                    </div>
                    
                    <div className="space-y-4 mb-8 border-t border-slate-100 pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                          Max Speed
                        </span>
                        <span className="text-lg font-black text-slate-800">
                          {highestSpeed ? `${highestSpeed} Mbps` : 'Varies'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-500 flex items-center gap-2">
                          <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                          Starting at
                        </span>
                        <span className="text-lg font-black text-green-600">
                          {lowestPrice ? `$${lowestPrice}/mo` : 'Call'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-3">
                    {carrier.disclaimer && (
                      <p className="text-[11px] leading-tight text-slate-500 italic text-center px-2 mb-1">
                        {carrier.disclaimer}
                      </p>
                    )}
                    <a href={`/providers/${carrier.slug}?city=${encodeURIComponent(location.city)}&state=${encodeURIComponent(location.state)}`} className="w-full py-3.5 px-4 rounded-xl font-black uppercase tracking-wider text-center text-sm transition-all shadow-md active:scale-[0.98] border-2 bg-white hover:bg-slate-50" style={{ borderColor: carrier.brandColor || '#4f46e5', color: carrier.brandColor || '#4f46e5' }}>
                        See Plans
                      </a>
                  </div>
                </div>
              );
            })}
          </div>
        ) : availableCarriers.length > 0 ? (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-16 md:p-24 text-center mb-24 relative overflow-hidden">
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
                No {activeFilter === 'fiber' ? 'Fiber Optic' : activeFilter === 'cable' ? 'Cable' : activeFilter === '5g' ? '5G Home' : 'Satellite'} Providers Found
              </h3>
              <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg mb-10 leading-relaxed">
                We couldn't find any {activeFilter === 'fiber' ? 'Fiber Optic' : activeFilter === 'cable' ? 'Cable' : activeFilter === '5g' ? '5G Home' : 'Satellite'} internet options in <strong className="text-slate-800">{location.zip}</strong>. However, there are other great high-speed providers available in your area.
              </p>
              <a href="?" className="bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg py-4 px-10 rounded-xl transition-all shadow-md active:scale-[0.98]">
                View All Available Providers
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-16 md:p-24 text-center mb-24 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-50 via-white to-white pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center mb-8 border border-slate-100 shadow-inner">
                <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Unmapped Territory</h3>
              <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg mb-10 leading-relaxed">
                Our engineering team is currently negotiating with ISPs and indexing high-speed coverage maps for <strong className="text-slate-800">{location.zip}</strong>. 
              </p>
              
              <button className="bg-slate-900 hover:bg-indigo-600 text-white font-black text-lg py-4 px-10 rounded-xl transition-all shadow-md hover:shadow-indigo-500/30 active:scale-[0.98]">
                Notify Me When Updated
              </button>
            </div>
          </div>
        )}

        <article className="bg-white rounded-3xl shadow-lg border border-slate-100 p-10 md:p-16 mb-16 max-w-4xl mx-auto mt-8">
          <h2 className="text-4xl font-black text-slate-900 mb-8 tracking-tight">Internet Availability in {cityName}, {stateUpper}</h2>
          <div className="prose prose-lg text-slate-600">
            <p className="mb-6 leading-relaxed">
              Residents of <strong className="text-slate-900">{cityName} ({location.zip})</strong> have access to {availableCarriers.length > 0 ? availableCarriers.length : 'several'} primary internet service providers. Whether you are looking for blazing-fast fiber optics for competitive gaming, or a budget-friendly reliable cable connection for remote work, comparing your local options is the best way to secure a competitive rate.
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-10 mb-4">Finding the Fastest Speeds in {location.zip}</h3>
            <p className="mb-6 leading-relaxed">
              Internet speeds can vary drastically even block-by-block in {cityName}. Fiber-optic networks typically offer the fastest symmetrical upload and download speeds, which are essential for heavy data users. When reviewing the providers above, pay close attention to the maximum Mbps (Megabits per second) offered in your specific neighborhood.
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-10 mb-4">How to Choose the Right Provider</h3>
            <ul className="list-disc pl-6 mb-6 space-y-3 font-medium">
              <li><strong className="text-slate-900">Speed Requirements:</strong> A household of 4 streaming 4K video simultaneously will benefit from speeds of 500 Mbps or higher.</li>
              <li><strong className="text-slate-900">Data Caps:</strong> Ensure your chosen plan in {stateUpper} does not include restrictive data caps if you download large files frequently.</li>
              <li><strong className="text-slate-900">Contract Terms:</strong> Look for providers that offer month-to-month flexibility without early termination fees.</li>
            </ul>
          </div>
        </article>

        {nearbyLocations.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-10 border border-slate-100 max-w-5xl mx-auto">
            <h3 className="text-2xl font-black text-slate-900 mb-8 text-center">Explore Nearby Areas in {cityName}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {nearbyLocations.map(loc => (
                <a 
                  key={loc.zip} 
                  href={`/internet/${loc.state.toLowerCase()}/${loc.city.toLowerCase().replace(/\s+/g, '-')}/${loc.zip}`}
                  className="bg-slate-50 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-transparent font-bold text-center py-3 px-2 rounded-xl transition-all"
                >
                  {loc.zip}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}