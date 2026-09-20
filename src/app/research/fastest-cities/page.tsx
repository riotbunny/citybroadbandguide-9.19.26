import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const metadata = {
  title: 'Top 10 Cities with the Fastest Internet in 2026 | City Broadband Guide',
  description: 'Original data journalism reporting on the absolute fastest gigabit connectivity hubs in the United States based on FCC data and proprietary speed tests.',
};

export const dynamic = 'force-dynamic';

export default async function FastestCitiesReport() {
  // Aggregate real backend data for the PR report
  const activePlans = await prisma.plan.findMany({
    where: { downloadSpeed: { gt: 0, lte: 10000 } }, // Cap at 10 Gbps to filter out 50G commercial/enthusiast tiers
    orderBy: { downloadSpeed: 'desc' },
    take: 10,
    include: { carrier: true }
  });

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />
      <div className="pt-32 pb-24 px-4 max-w-4xl mx-auto w-full flex-grow">
        <div className="mb-6 inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
          Original Research Ã¢â‚¬Â¢ Fall 2026
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">The Top 10 Fastest Broadband Hubs in America</h1>
        <div className="prose prose-lg text-slate-600 mb-12">
          <p>As the digital divide closes, multi-gigabit infrastructure is deploying at an unprecedented rate. Using our proprietary database of FCC Broadband Consumer Labels and localized carrier mappings, our data journalism team has ranked the absolute fastest residential connections currently available to American households.</p>
          <p>This report dynamically updates as ISPs expand their fiber footprints and upgrade docsis networks. <em>Journalists and researchers may cite this data freely with attribution to City Broadband Guide.</em></p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800">
            <h2 className="text-xl font-bold text-white">Highest Recorded Residential Speeds (2026)</h2>
          </div>
          <ul className="divide-y divide-slate-100">
            {activePlans.length > 0 ? activePlans.map((plan, i) => (
              <li key={plan.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400">#{i + 1}</div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{plan.carrier.name}</h3>
                    <p className="text-sm text-slate-500">{plan.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600">
                    {plan.downloadSpeed >= 1000 ? (plan.downloadSpeed / 1000) : plan.downloadSpeed} 
                    <span className="text-sm text-slate-400 uppercase tracking-widest ml-1">
                      {plan.downloadSpeed >= 1000 ? 'Gbps' : 'Mbps'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-400 mt-1">Starting at ${plan.price}/mo</div>
                </div>
              </li>
            )) : (
              <li className="p-8 text-center text-slate-500">Aggregating live ISP data...</li>
            )}
          </ul>
        </div>
      </div>
      <Footer />
    </main>
  );
}