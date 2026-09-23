import prisma from "@/lib/prisma";
import { cookies, headers } from 'next/headers'
import GeoLocator from '../components/GeoLocator'
import Navbar from '../components/Navbar'
import InteractiveCoverageMap from '../components/InteractiveCoverageMap'

export const revalidate = 3600; // Cache for 1 hour to maximize Edge Cache hits

export default async function Home() {
  const carriers = await prisma.carrier.findMany({ 
    where: { isActive: true }, 
    include: { coverages: { include: { location: true } } },
    orderBy: { name: 'asc' } 
  });
  
  const mapData = carriers.map(c => {
    const uniqueStates = Array.from(new Set(c.coverages.map(cov => cov.location?.state).filter(Boolean)));
    return {
      id: c.id,
      name: c.name,
      brandColor: c.brandColor,
      states: uniqueStates,
      isNationwide: c.isNationwide
    };
  }).filter(c => c.isNationwide || c.states.length > 0);
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_session');

  const headersList = await headers();
  const geoCity = headersList.get('x-vercel-ip-city');
  const geoState = headersList.get('x-vercel-ip-country-region');
  
  const locationText = (geoCity && geoState) ? `in ${geoCity}, ${geoState}.` : "in Your Neighborhood.";

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <div className="relative overflow-hidden bg-slate-950 pt-[200px] pb-[160px]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-indigo-600/20 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-8 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-indigo-400 mr-2 animate-pulse"></span>
              Comprehensive Address-Level Analysis
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-8 leading-[1.1]">
              Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Fastest Internet</span><br/> {locationText}
            </h1>
            <p className="mt-4 text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto mb-14 font-light leading-relaxed">
              Compare blazing-fast fiber, reliable cable, and ultra-cheap 5G home internet plans secretly available at your exact address.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <GeoLocator />
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6 text-slate-400 text-xs md:text-sm font-medium uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                42,741 Zips Analyzed
              </div>
              <div className="hidden md:block w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Live Pricing Data
              </div>
              <div className="hidden md:block w-1.5 h-1.5 bg-slate-700 rounded-full"></div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Zero Hidden Fees
              </div>
            </div>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="bg-white border-b border-slate-100 py-10">
          <div className="max-w-7xl mx-auto px-4 flex justify-center items-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition duration-500 overflow-x-auto flex-wrap">
             {carriers.slice(0, 6).map(c => (
                <div key={c.id} className="h-8 flex items-center justify-center">
                   {c.logoPath ? <img src={c.logoPath} alt={c.name} className="max-h-full max-w-full object-contain" /> : <span className="font-bold text-2xl text-slate-800">{c.name}</span>}
                </div>
             ))}
          </div>
        </div>

        {/* AUTHORITY: HOW IT WORKS */}
        <div className="py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How to find the best internet.</h2>
              <p className="mt-6 text-xl text-slate-500 font-medium">Three simple steps to faster, cheaper Wi-Fi.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="text-center">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-inner">1</div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">Search Your Zip Code</h3>
                 <p className="text-slate-600 text-lg leading-relaxed">Enter your address to see exactly which providers have active lines wired directly to your neighborhood.</p>
              </div>
              <div className="text-center">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-inner">2</div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">Compare Hidden Fees</h3>
                 <p className="text-slate-600 text-lg leading-relaxed">We analyze data caps, sneaky router rental fees, and second-year price hikes so you don't get tricked.</p>
              </div>
              <div className="text-center">
                 <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center text-3xl font-black mx-auto mb-8 shadow-inner">3</div>
                 <h3 className="text-2xl font-bold text-slate-900 mb-4">Switch & Save</h3>
                 <p className="text-slate-600 text-lg leading-relaxed">Choose the best provider, lock in a promotional rate online, and start enjoying faster, reliable speeds.</p>
              </div>
            </div>
          </div>
        </div>

        
        {/* INTERACTIVE USA MAP */}
        <div className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4">
            <InteractiveCoverageMap carriers={mapData} />
          </div>
        </div>

        {/* AUTHORITY: EDUCATIONAL TECH BREAKDOWN */}
        <div className="py-32 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 leading-tight">Not all internet is<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">created equal.</span></h2>
              <p className="text-xl text-slate-400 mb-12 font-light leading-relaxed">We break down the technology behind the connection so you know exactly what you are paying for.</p>
              
              <div className="space-y-6">
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                  <h4 className="text-2xl font-black text-indigo-400 mb-3">Fiber-Optic <span className="text-sm font-bold text-indigo-200 bg-indigo-900/50 px-3 py-1 rounded-full ml-3 uppercase tracking-widest">Top Tier</span></h4>
                  <p className="text-slate-300 leading-relaxed">Uses pulses of light to transmit data. Offers symmetrical upload and download speeds. Perfect for competitive gamers, heavy Zoom users, and massive households.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                  <h4 className="text-2xl font-black text-sky-400 mb-3">5G Home Internet <span className="text-sm font-bold text-sky-200 bg-sky-900/50 px-3 py-1 rounded-full ml-3 uppercase tracking-widest">Rising Star</span></h4>
                  <p className="text-slate-300 leading-relaxed">Runs entirely on cellular towers. No underground wires, no installation appointments. Great for cord-cutters, renters, and budget-conscious users.</p>
                </div>
                <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors">
                  <h4 className="text-2xl font-black text-blue-400 mb-3">Cable <span className="text-sm font-bold text-blue-200 bg-blue-900/50 px-3 py-1 rounded-full ml-3 uppercase tracking-widest">The Standard</span></h4>
                  <p className="text-slate-300 leading-relaxed">Uses traditional coaxial TV cables. Blazing fast downloads, but significantly slower uploads. The most widely available high-speed option in America.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-blue-500 rounded-[3rem] blur-2xl opacity-20"></div>
              <div className="bg-slate-900 border border-slate-700/50 p-10 md:p-14 rounded-[3rem] relative z-10 shadow-2xl">
                <h3 className="text-3xl font-black mb-10 text-white tracking-tight">What speed do you actually need?</h3>
                <ul className="space-y-6">
                  <li className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <span className="text-slate-400 text-lg">Basic Web Browsing</span>
                    <span className="font-black text-xl text-emerald-400">25 Mbps</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <span className="text-slate-400 text-lg">Streaming 4K Netflix</span>
                    <span className="font-black text-xl text-emerald-400">100 Mbps</span>
                  </li>
                  <li className="flex justify-between items-center border-b border-slate-800 pb-6">
                    <span className="text-slate-400 text-lg">Competitive Gaming</span>
                    <span className="font-black text-xl text-emerald-400">300 Mbps</span>
                  </li>
                  <li className="flex justify-between items-center pt-2">
                    <span className="text-slate-400 text-lg">Smart Home / 5+ People</span>
                    <span className="font-black text-xl text-indigo-400">1000 Mbps <span className="text-sm text-slate-500 uppercase tracking-widest ml-1">(Gigabit)</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* AUTHORITY: FAQ */}
        <div className="py-32 bg-slate-50">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight text-center mb-16">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="p-8 md:p-10 bg-white rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <h4 className="text-2xl font-black text-slate-900 mb-4">How much should I be paying for internet?</h4>
                <p className="text-slate-600 text-lg leading-relaxed">The national average for a reliable home internet connection is between $50 and $70 per month. If you are paying over $80/month for standard cable internet, you are likely overpaying for legacy equipment and should compare promotional rates from competitors in your zip code.</p>
              </div>
              <div className="p-8 md:p-10 bg-white rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <h4 className="text-2xl font-black text-slate-900 mb-4">Do I need to rent a router from my provider?</h4>
                <p className="text-slate-600 text-lg leading-relaxed">No! Most major providers charge $10-$15/month to rent their Wi-Fi gateway. Buying your own modern router for around $150 will pay for itself in less than a year and typically provides a much stronger, wider Wi-Fi signal across your home.</p>
              </div>
              <div className="p-8 md:p-10 bg-white rounded-[2rem] shadow-sm border border-slate-200 hover:shadow-lg transition-shadow">
                <h4 className="text-2xl font-black text-slate-900 mb-4">What exactly is a data cap?</h4>
                <p className="text-slate-600 text-lg leading-relaxed">A data cap is a hard limit on how much internet you can use each month (usually around 1.2 TB). If you exceed it, legacy providers may secretly charge you $10 for every additional 50GB. We heavily recommend prioritizing Fiber and 5G providers because they typically offer unlimited data with zero caps.</p>
              </div>
            </div>
          </div>
        </div>

        {/* PSEO FOOTER MATRIX */}
        <div className="py-32 bg-slate-900 text-white">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-black text-white mb-12 text-center tracking-tight">Popular Cities for High-Speed Internet</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-y-6 gap-x-4 text-center">
              {['Dallas, TX', 'Houston, TX', 'Austin, TX', 'Brownsville, TX', 'San Antonio, TX', 'Miami, FL', 'Orlando, FL', 'Los Angeles, CA', 'San Diego, CA', 'Seattle, WA'].map((location, i) => {
                const [city, state] = location.split(', ');
                return (
                  <a 
                    key={i} 
                    href={`/internet/${state.toLowerCase()}/${city.toLowerCase().replace(/\s+/g, '-')}`} 
                    className="text-slate-400 hover:text-white transition font-bold text-sm bg-white/5 py-4 px-2 rounded-2xl border border-white/10 hover:bg-white/10"
                  >
                    {city}, {state}
                  </a>
                );
              })}

            </div>
            <div className="mt-12 text-center">
              <a href="/locations" className="inline-block bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-full border border-white/20 transition-all">
                View All States & Cities →
              </a>
            </div>
          </div>
        </div>
      </main>

    </div>
  )
}