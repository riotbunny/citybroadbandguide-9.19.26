import Navbar from '../../components/Navbar'
import Link from 'next/link'

export const metadata = {
  title: 'Broadband Resource Center & Research | City Broadband Guide',
  description: 'Expert guides, internet speed recommendations, and proprietary data studies on US broadband infrastructure.',
}

export default function ResourcesHub() {
  const currentYear = new Date().getFullYear();
  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Resource Center & Data Studies</h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">Everything you need to know about home internet, plus our proprietary data research on digital connectivity.</p>
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 mb-6 border-b pb-4">Proprietary Data Studies (Digital PR)</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <Link href="/research/state-of-broadband" className="group bg-white p-8 rounded-3xl shadow-sm border border-indigo-100 hover:shadow-xl transition-all">
            <div className="bg-indigo-50 text-indigo-600 text-xs font-black px-3 py-1 rounded-full inline-block mb-4 uppercase tracking-widest">Original Research</div>
            <h3 className="text-2xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{`The ${currentYear} State of US Broadband Report`}</h3>
            <p className="text-slate-600">Our comprehensive analysis of internet speeds, pricing trends, and the digital divide across 40,000+ zip codes.</p>
          </Link>
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-6 border-b pb-4">Expert Guides</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Link href="/resources/fiber-vs-cable" className="group bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all flex flex-col h-full">
            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600">Fiber vs. Cable Internet: Which Do You Actually Need?</h3>
            <p className="text-slate-600 text-sm flex-grow">A deep dive into latency, symmetric speeds, and why fiber usually wins for gamers and remote workers.</p>
          </Link>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-70">
            <h3 className="text-xl font-bold text-slate-900 mb-3">How Much Internet Speed Do You Really Need?</h3>
            <p className="text-slate-600 text-sm">Stop overpaying for gigabit. Calculate your exact household bandwidth requirements. (Coming Soon)</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 opacity-70">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Understanding Hidden ISP Fees</h3>
            <p className="text-slate-600 text-sm">Equipment rentals, data cap overages, and installation fees exposed. (Coming Soon)</p>
          </div>
        </div>
      </div>
    </main>
  )
}