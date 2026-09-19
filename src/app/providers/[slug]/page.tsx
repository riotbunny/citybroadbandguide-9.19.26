import { PrismaClient } from '@prisma/client'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import Navbar from '../../../components/Navbar'
import InteractiveCoverageMap from '../../../components/InteractiveCoverageMap'

const prisma = new PrismaClient()

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const carrier = await prisma.carrier.findUnique({ where: { slug } });
  if (!carrier) return { title: 'Not Found' }
  return {
    title: `${carrier.name} Internet Plans & Pricing | 2026 Reviews`,
    description: `Compare ${carrier.name} high-speed internet plans, hidden fees, and data caps. Call ${carrier.phoneNumber || 'today'} to check availability at your address.`,
    alternates: { canonical: `https://citybroadbandguide.com/providers/${slug}` }
  }
}

export default async function ProviderPage({ params, searchParams }: { params: Promise<{ slug: string }>, searchParams: Promise<{ city?: string, state?: string }> }) {
  const { slug } = await params;
  const sp = await searchParams;
  const city = sp.city ? sp.city.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) : 'your area';
  const state = sp.state ? sp.state.toUpperCase() : '';
  const locationString = sp.city ? `${city}, ${state}` : 'your area';
  
  const carrier = await prisma.carrier.findUnique({
    where: { slug },
    include: { plans: { orderBy: { price: 'asc' } }, coverages: { include: { location: true } } }
  });

  if (!carrier) return notFound();

  const uniqueStates = Array.from(new Set(carrier.coverages.map(cov => cov.location?.state).filter(Boolean)));
  const mapData = [{
    id: carrier.id,
    name: carrier.name,
    brandColor: carrier.brandColor,
    states: uniqueStates,
    isNationwide: carrier.isNationwide
  }];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-32 pb-16 px-4 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        
        
        {/* Header Profile */}
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 mb-12 flex flex-col md:flex-row items-center gap-10">
          <div className="w-64 h-40 flex items-center justify-center p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner">
            {carrier.logoPath ? <img src={carrier.logoPath} alt={carrier.name} className="max-h-full max-w-full object-contain" /> : <span className="font-black text-4xl text-slate-800">{carrier.name}</span>}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">{carrier.name} Internet Plans</h1>
            <p className="text-xl text-slate-500 mb-8 font-light max-w-2xl">View the latest high-speed internet packages, promotional pricing, and speed tiers available in your area.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4">
              {carrier.affiliateUrl && (
                <a href={carrier.affiliateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-white font-black text-lg px-8 py-4 rounded-2xl shadow-md hover:opacity-90 transition-opacity active:scale-95" style={{ backgroundColor: carrier.brandColor || '#4f46e5' }}>
                  Sign Up Online
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </a>
              )}
              {carrier.phoneNumber && (
                <a href={`tel:${carrier.phoneNumber.replace(/[^0-9]/g, '')}`} className={`inline-flex items-center font-black text-lg px-8 py-4 rounded-2xl border-2 transition-all active:scale-95 ${carrier.affiliateUrl ? 'bg-white hover:bg-slate-50' : 'text-white shadow-md hover:opacity-90'}`} style={carrier.affiliateUrl ? { borderColor: carrier.brandColor || '#4f46e5', color: carrier.brandColor || '#4f46e5' } : { backgroundColor: carrier.brandColor || '#4f46e5', borderColor: carrier.brandColor || '#4f46e5' }}>
                  <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                  Order by Phone: {carrier.phoneNumber}
                </a>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Available Plans & Pricing</h2>
        
        {carrier.plans.length > 0 ? (
          <div className="space-y-6">
            {carrier.plans.map(plan => (
              <div key={plan.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 hover:shadow-xl hover:-translate-y-1 hover:border-indigo-100 transition-all duration-300">
                <div className="flex-grow text-center md:text-left">
                  <h3 className="text-2xl font-black text-slate-900 mb-2">{plan.name}</h3>
                  {plan.description && <p className="text-slate-500 text-lg leading-relaxed">{plan.description}</p>}
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-8 w-full md:w-auto bg-slate-50 p-6 rounded-2xl">
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Max Speed</p>
                    <p className="text-3xl font-black text-slate-800">{Math.max(plan.downloadSpeed || 0, plan.uploadSpeed || 0)} <span className="text-base font-bold">Mbps</span></p>
                  </div>
                  <div className="hidden sm:block w-px h-12 bg-slate-200"></div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                    {plan.price > 0 ? (
                      <p className="text-3xl font-black text-emerald-500">${plan.price.toFixed(2)}<span className="text-base font-bold text-slate-400">/mo</span></p>
                    ) : (
                      <p className="text-lg font-black text-emerald-600 leading-tight pt-1">Call for<br/>Availability</p>
                    )}
                  </div>
                                    <div className="ml-4 flex flex-col gap-2.5">
                    {carrier.affiliateUrl && (
                      <a 
                        href={carrier.affiliateUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white font-black text-sm md:text-base py-3 px-6 rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap text-center flex items-center justify-center gap-2 hover:opacity-90" style={{ backgroundColor: carrier.brandColor || "#4f46e5" }}
                      >
                        Sign Up Online
                      </a>
                    )}
                    {carrier.phoneNumber && (
                      <a 
                        href={`tel:${carrier.phoneNumber.replace(/[^0-9]/g, '')}`} 
                        className={`font-black text-sm md:text-base py-3 px-6 rounded-xl transition-all active:scale-95 whitespace-nowrap text-center flex items-center justify-center gap-2 ${carrier.affiliateUrl ? 'bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900' : 'text-white shadow-md hover:opacity-90'}`}
                        style={!carrier.affiliateUrl ? { backgroundColor: carrier.brandColor || "#0f172a" } : {}}
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                        {carrier.affiliateUrl ? 'Call Instead' : 'Call to Order'}
                      </a>
                    )}
                    {!carrier.affiliateUrl && !carrier.phoneNumber && (
                      <button disabled className="bg-slate-200 text-slate-400 font-black text-sm md:text-base py-3 px-6 rounded-xl whitespace-nowrap text-center cursor-not-allowed">
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-16 rounded-3xl border border-slate-100 text-center shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-4">No specific plans listed online yet.</h3>
            <p className="text-slate-500 text-lg">Please call <strong className="text-indigo-600">{carrier.phoneNumber || 'the provider directly'}</strong> to check current promotional rates and hidden fees for your exact address.</p>
          </div>
        )}

        {carrier.aboutText && (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 p-8 md:p-12 mt-12 mb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                About {carrier.name} in {city}
              </h2>
              <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-100">
                <span className="font-black text-yellow-600 text-lg">{carrier.rating?.toFixed(1) || '4.5'}</span>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className={`w-5 h-5 ${i < Math.floor(carrier.rating || 4.5) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300 fill-slate-200'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
                  ))}
                </div>
              </div>
            </div>
            <div className="prose prose-lg prose-slate max-w-none">
              {carrier.aboutText.replace(/\{\{city\}\}/g, city).replace(/\{\{state\}\}/g, state).replace(/\{\{location\}\}/g, locationString).split('\n').map((paragraph, i) => (
                <p key={i} className="mb-4 text-slate-600 leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {/* INTERACTIVE USA MAP FOR PSEO */}
        <div className="mt-12 mb-12">
          <InteractiveCoverageMap carriers={mapData} />
        </div>

      </div>
    </main>
  )
}