import { PrismaClient } from '@prisma/client'
import Navbar from '../../../../components/Navbar'
import Link from 'next/link'

const prisma = new PrismaClient()

export default async function CityDirectory({ params }: { params: Promise<{ state: string, city: string }> }) {
  const { state, city } = await params;
  const stateUpper = state.toUpperCase();
  const cityClean = city.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  const locations = await prisma.location.findMany({
    where: { state: stateUpper, city: { equals: cityClean } }, // In production, might need case-insensitive matching depending on DB Collation
    orderBy: { zip: 'asc' }
  });

  return (
    <main className="min-h-screen bg-slate-50 pt-32 pb-16 px-4 font-sans">
      <Navbar />
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-8">Internet Providers in {cityClean}, {stateUpper}</h1>
        <p className="text-xl text-slate-600 mb-12">Select your zip code below to find fiber, cable, and 5G providers available at your exact address.</p>
        
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {locations.map((loc, i) => (
            <Link key={i} href={`/internet/${state.toLowerCase()}/${city.toLowerCase()}/${loc.zip}`} className="bg-white p-4 rounded-xl text-center shadow-sm hover:shadow-md hover:bg-indigo-50 hover:text-indigo-600 font-black text-lg transition-all border border-slate-100">
              {loc.zip}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}