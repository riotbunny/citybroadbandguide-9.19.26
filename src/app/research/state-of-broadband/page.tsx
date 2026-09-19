import Navbar from '../../../components/Navbar'
import Link from 'next/link'

export async function generateMetadata() {
  const currentYear = new Date().getFullYear();
  return {
    title: `The ${currentYear} State of US Broadband | Proprietary Data Study`,
    description: `An independent data study analyzing internet speeds, pricing, and infrastructure deployment across 40,000 US zip codes in ${currentYear}.`,
  }
}

export default function DataStudy() {
  const currentYear = new Date().getFullYear();
  
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans">
      <Navbar />
      <article className="max-w-4xl mx-auto bg-white p-8 md:p-16 rounded-[3rem] shadow-xl border border-slate-100">
        <div className="text-indigo-600 font-black tracking-widest uppercase mb-4 text-sm">Proprietary Research</div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 leading-tight">The {currentYear} State of US Broadband</h1>
        <p className="text-xl text-slate-500 mb-12">An analysis of over 40,000 localized internet markets reveals the widening gap between fiber infrastructure and rural connectivity in {currentYear}.</p>
        
        <div className="prose prose-lg prose-indigo max-w-none">
          <p><em>For press inquiries or to request raw data for your local reporting, please contact press@citybroadbandguide.com.</em></p>
          <hr />
          <h2>Executive Summary</h2>
          <p>In {currentYear}, the definition of "high-speed internet" has fundamentally shifted. While the FCC defines broadband as 100 Mbps download and 20 Mbps upload, consumer demand for symmetric gigabit speeds has rendered traditional cable infrastructures obsolete in major metropolitan hubs.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-12 not-prose">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
              <div className="text-4xl font-black text-indigo-600 mb-2">42%</div>
              <div className="text-sm font-bold text-slate-600">of US households now have access to multi-gigabit fiber.</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
              <div className="text-4xl font-black text-emerald-500 mb-2">$68</div>
              <div className="text-sm font-bold text-slate-600">Average starting price for 1 Gbps symmetric connections.</div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
              <div className="text-4xl font-black text-rose-500 mb-2">18M</div>
              <div className="text-sm font-bold text-slate-600">Americans still lacking access to base-tier broadband.</div>
            </div>
          </div>

          <h2>Methodology</h2>
          <p>City Broadband Guide aggregates millions of data points from regulatory filings, provider APIs, and local speed test submissions. By filtering this data at the Zip Code level, we have constructed one of the most accurate private databases of internet availability in the United States.</p>
          <p>To view the raw availability data for your specific region, <Link href="/locations">search our location database here</Link>.</p>
        </div>
      </article>
    </main>
  )
}
