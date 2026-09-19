import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import Navbar from '../../../components/Navbar'
import GeoLocator from '../../../components/GeoLocator'

const prisma = new PrismaClient()

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const stateUpper = state.toUpperCase();
  return {
    title: `Internet Providers in ${stateUpper} | City Broadband Guide`,
    description: `Compare the fastest and most affordable internet providers across ${stateUpper}. Find coverage by city and zip code.`
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
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Internet Providers in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{stateUpper}</span>
          </h1>
          <div className="mt-8 max-w-md mx-auto">
             <GeoLocator />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto w-full py-16 px-4">
        <h2 className="text-2xl font-black text-slate-900 mb-8 text-center">Select your city</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {cities.map(loc => (
            <a 
              key={loc.city} 
              href={`/internet/${state.toLowerCase()}/${loc.city.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-white border border-slate-200 p-4 rounded-xl text-center font-bold text-slate-700 shadow-sm hover:shadow-md hover:border-indigo-400 hover:text-indigo-600 transition-all"
            >
              {loc.city}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}