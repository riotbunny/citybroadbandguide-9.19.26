import prisma from "@/lib/prisma";
import { notFound } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import GeoLocator from '../../../components/GeoLocator'



export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const stateUpper = state.toUpperCase();
  const currentYear = new Date().getFullYear();
  return {
    title: `Best Internet Providers in ${stateUpper} | ${currentYear} Comparison`,
    description: `Compare the fastest and most affordable internet providers across ${stateUpper}. Find coverage by city and zip code to lock in the lowest promotional rates.`,
    alternates: { canonical: `https://citybroadbandguide.com/internet/${state.toLowerCase()}` }
  }
}

export default async function StateHub({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const stateUpper = state.toUpperCase();

  const cities = await prisma.location.findMany({
    where: { state: stateUpper },
    distinct: ['city'],
    orderBy: { city: 'asc' },
    select: { city: true }
  });
  
  const totalZips = await prisma.location.count({
    where: { state: stateUpper }
  });

  if (cities.length === 0) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <Navbar />
      
      <div className="bg-slate-950 pt-32 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-slate-950 to-slate-950"></div>
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <nav className="flex justify-center text-xs font-bold text-slate-500 mb-8 space-x-3 uppercase tracking-widest">
            <a href="/" className="hover:text-blue-400 transition-colors">Home</a>
            <span className="text-slate-700">/</span>
            <span className="text-white">{stateUpper}</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg leading-tight">
            Internet Providers in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{stateUpper}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed mb-6">
            We have aggressively mapped connection data across <strong>{totalZips} zip codes</strong> in <strong>{cities.length} cities</strong> to help {stateUpper} residents find the absolute best rates.
          </p>
          <div className="mt-8 max-w-md mx-auto">
             <GeoLocator />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full py-16 px-4">
        <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Select your city</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {cities.map(loc => (
            <a 
              key={loc.city} 
              href={`/internet/${state.toLowerCase()}/${loc.city.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white border border-slate-200 p-4 rounded-xl text-center font-bold text-slate-700 shadow-sm hover:shadow-md hover:border-indigo-400 hover:text-indigo-600 transition-all text-sm md:text-base"
            >
              {loc.city}
            </a>
          ))}
        </div>
      </div>

      {/* Programmatic SEO (PSEO) Text Block */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-slate-600 space-y-6">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Navigating Internet Options in {stateUpper}</h2>
        <p className="leading-relaxed">
          Finding a reliable and affordable internet connection in {stateUpper} can be overwhelming due to the massive variation in infrastructure from city to city. While metropolitan hubs often benefit from hyper-competitive fiber-optic networks offering symmetrical gigabit speeds, many suburban and rural communities are limited to a single legacy cable provider, DSL line, or satellite connection. 
        </p>
        <p className="leading-relaxed">
          At <strong>City Broadband Guide</strong>, we believe {stateUpper} residents shouldn't have to guess what networks are actually installed on their street. We've aggregated coverage maps, promotional pricing, and real-world connection speeds across <strong>{cities.length} cities</strong> and <strong>{totalZips} local zip codes</strong> to eliminate the guesswork. 
        </p>
        <p className="leading-relaxed">
          Because pricing and availability are strictly determined by hyper-local infrastructureâ€”sometimes changing from one side of the street to the otherâ€”we highly recommend selecting your city from the directory above or entering your exact zip code into the locator. This ensures you are viewing the most accurate, up-to-date promotional rates and active internet service providers for your specific neighborhood.
        </p>
      </div>

          </main>
  );
}