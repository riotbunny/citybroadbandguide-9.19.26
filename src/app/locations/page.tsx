import prisma from "@/lib/prisma";
import Navbar from '../../components/Navbar'
import Link from 'next/link'



export default async function LocationsDirectory() {
  const locations = await prisma.location.findMany({
    select: { state: true },
    distinct: ['state'],
    orderBy: { state: 'asc' }
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Internet Coverage by State</h1>
        <p className="text-xl text-slate-600 mb-12">Select your state below to drill down into city and zip-code level internet coverage maps and pricing.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {locations.map((loc, i) => (
            <Link key={i} href={`/internet/${loc.state.toLowerCase()}`} className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 font-black text-lg transition-all border border-slate-100">
              {loc.state.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}