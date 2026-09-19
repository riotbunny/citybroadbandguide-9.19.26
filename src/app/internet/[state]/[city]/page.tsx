import { PrismaClient } from '@prisma/client'
import Navbar from '../../../../components/Navbar'
import Footer from '../../../../components/Footer'
import GeoLocator from '../../../../components/GeoLocator'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function CityDirectory({ params }: { params: Promise<{ state: string, city: string }> }) {
  const { state, city } = await params;
  const stateUpper = state.toUpperCase();
  const cityClean = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const locations = await prisma.location.findMany({
    where: { state: stateUpper, city: { equals: cityClean } },
    orderBy: { zip: 'asc' }
  });

  return (
    <main className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <Navbar />
      
      {/* High-Converting Hero Section */}
      <div className="relative bg-slate-900 pt-32 pb-24 px-4 overflow-hidden border-b border-white/10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-bold tracking-wide uppercase mb-6 shadow-inner">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            Local Coverage Area
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tight drop-shadow-lg">
            Internet Providers in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{cityClean}, {stateUpper}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Internet availability varies block-by-block. Enter your zip code below to find the exact fiber, cable, and 5G plans at your home.
          </p>

          <div className="max-w-md mx-auto bg-white/5 p-8 rounded-3xl border border-white/10 backdrop-blur-md shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none"></div>
            <GeoLocator />
          </div>
        </div>
      </div>

      {/* Directory Section */}
      <div className="flex-grow max-w-6xl mx-auto w-full py-20 px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Browse {cityClean} Directory</h2>
          <p className="text-slate-500 mt-3 text-lg">Or manually select your specific zip code from the localized directory below.</p>
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