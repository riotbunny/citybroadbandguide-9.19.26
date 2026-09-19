export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 py-20 border-t border-slate-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        {/* Brand */}
        <div className="pr-4">
          <div className="flex items-center gap-3 mb-6">
            <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            <span className="text-xl font-black text-white tracking-tighter">City Broadband Guide.</span>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed font-medium mb-6">
            We analyze millions of data points every day to help Americans find the absolute best internet providers secretly available at their exact address.
          </p>
          <div className="text-xs font-bold uppercase tracking-widest text-emerald-500 bg-emerald-500/10 inline-block px-3 py-1.5 rounded-md border border-emerald-500/20">
            Independent Coverage Data
          </div>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Tools & Resources</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-400">
            <li><a href="/" className="hover:text-indigo-400 transition">Address Coverage Map</a></li>
            <li><a href="/login" className="hover:text-indigo-400 transition">Provider CMS Portal</a></li>
          </ul>
        </div>

        {/* Top States */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Top States</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-400">
            <li><a href="/internet/tx" className="hover:text-indigo-400 transition">Texas Internet Providers</a></li>
            <li><a href="/internet/ca" className="hover:text-indigo-400 transition">California Internet Providers</a></li>
            <li><a href="/internet/fl" className="hover:text-indigo-400 transition">Florida Internet Providers</a></li>
            <li><a href="/internet/ny" className="hover:text-indigo-400 transition">New York Internet Providers</a></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="text-white font-black uppercase tracking-widest text-sm mb-6">Company & Legal</h4>
          <ul className="space-y-4 text-sm font-medium text-slate-400">
            <li><a href="/privacy-policy" className="hover:text-indigo-400 transition">Privacy Policy</a></li>
            <li><a href="/terms-of-service" className="hover:text-indigo-400 transition">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 mt-20 pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-slate-600 text-xs font-semibold">&copy; {new Date().getFullYear()} City Broadband Guide Inc. All rights reserved.</p>
        <p className="text-slate-600 text-[11px] leading-relaxed max-w-3xl text-center md:text-right font-medium">We are an independent comparison site and may receive compensation from providers when you purchase through our links. Pricing, speeds, and availability are subject to change by the provider. <a href="/terms-of-service" className="underline hover:text-slate-400">Read our full Terms of Service</a>.</p>
      </div>
    </footer>
  )
}