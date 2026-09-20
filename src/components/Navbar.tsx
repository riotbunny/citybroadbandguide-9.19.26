import { cookies } from 'next/headers';

export default async function Navbar() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.has('admin_session');

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-slate-950/60 backdrop-blur-2xl border-b border-white/10 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-indigo-500/20 group-hover:scale-105 group-hover:rotate-3 transition-transform duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <span className="font-black text-2xl tracking-tighter text-white">City<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Broadband</span>Guide</span>
          </a>
          
          <div className="hidden md:flex items-center space-x-10">
            <a href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Find Internet</a>
            <a href="/" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Top Providers</a>
            <a href="/resources" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">Resource Center</a>
          </div>

          <div className="flex items-center gap-4">
            <a href={isAdmin ? "/admin" : "/login"} className="text-xs font-black text-indigo-200 hover:text-white transition-colors uppercase tracking-widest bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full border border-white/10">
              {isAdmin ? "Dashboard \u2192" : "Admin \u2192"}
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}