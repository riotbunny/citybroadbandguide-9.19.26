import { PrismaClient } from '@prisma/client'
import Navbar from '../../../components/Navbar'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function StateDirectory({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const stateUpper = state.toUpperCase();

  const locations = await prisma.location.findMany({
    where: { state: stateUpper },
    select: { city: true },
    distinct: ['city'],
    orderBy: { city: 'asc' }
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Internet Providers in {stateUpper}</h1>
        <p className="text-xl text-slate-600 mb-12">Select your city below to compare local high-speed internet plans and pricing.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {locations.map((loc, i) => (
            <Link key={i} href={`/internet/${state.toLowerCase()}/${loc.city.toLowerCase().replace(/\s+/g, '-')}`} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md hover:text-indigo-600 font-bold transition-all border border-slate-100">
              {loc.city}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}