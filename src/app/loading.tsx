export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Skeleton Navbar */}
      <div className="h-20 bg-white/80 backdrop-blur border-b border-slate-100 w-full fixed top-0 z-50"></div>
      
      {/* Skeleton Header */}
      <div className="bg-slate-950 pt-32 pb-32 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 text-center animate-pulse">
          <div className="h-4 bg-slate-800 rounded w-48 mx-auto mb-8"></div>
          <div className="h-16 bg-slate-800 rounded-2xl w-3/4 mx-auto mb-6"></div>
          <div className="h-6 bg-slate-800 rounded w-1/2 mx-auto mb-10"></div>
          <div className="h-8 bg-slate-800 rounded-full w-32 mx-auto"></div>
        </div>
      </div>

      {/* Skeleton Dashboard */}
      <div className="max-w-7xl mx-auto px-4 -mt-20 relative z-20 w-full mb-8">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 mb-10 animate-pulse flex flex-col lg:flex-row items-center justify-between gap-8 h-40">
           <div className="h-16 bg-slate-100 rounded-2xl w-full"></div>
           <div className="hidden lg:block w-px h-16 bg-slate-100"></div>
           <div className="h-16 bg-slate-100 rounded-2xl w-full"></div>
           <div className="hidden lg:block w-px h-16 bg-slate-100"></div>
           <div className="h-16 bg-slate-100 rounded-2xl w-full"></div>
        </div>

        {/* Skeleton Toolbar */}
        <div className="h-12 bg-slate-100 rounded-xl w-full mb-8 animate-pulse"></div>

        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-24">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-white rounded-[2rem] shadow-lg border border-slate-100 h-96 animate-pulse p-8 flex flex-col">
              <div className="h-24 bg-slate-100 rounded-xl w-full mb-8"></div>
              <div className="h-8 bg-slate-100 rounded w-3/4 mx-auto mb-4"></div>
              <div className="h-16 bg-slate-100 rounded-xl w-full mb-6"></div>
              <div className="mt-auto h-12 bg-slate-100 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}