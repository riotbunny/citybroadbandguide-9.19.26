import prisma from "@/lib/prisma";
import SaveStatusButton from '../../components/SaveStatusButton'
import { toggleCarrierStatus, quickUpdateCarrier, createNewCarrier, toggleTopPick } from './actions'
import { logout } from '../login/actions'

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminDashboard() {
  const carriers = await prisma.carrier.findMany({ 
    orderBy: { name: 'asc' },
    include: { _count: { select: { coverages: true } } }
  })

  return (
        <div className="p-8 max-w-[95%] mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
        <div className="flex items-center gap-4"><h1 className="text-3xl font-extrabold text-slate-800">CMS Dashboard</h1><form action={logout}><button className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">Log Out</button></form></div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <form action={createNewCarrier} className="flex gap-3 items-center">
            <input 
              type="text" 
              name="name" 
              required 
              placeholder="New Carrier Name (e.g. Google Fiber)" 
              className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-64 text-sm font-semibold text-slate-800" 
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-800 text-white font-bold py-2.5 px-5 rounded-lg transition shadow-sm text-sm whitespace-nowrap">
              + Create Carrier
            </button>
          </form>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse whitespace-nowrap">
          <thead className="bg-slate-50">
            <tr>
              <th className="p-4 border-b font-semibold text-slate-600">Logo</th>
              <th className="p-4 border-b font-semibold text-slate-600">Carrier Name</th>
              <th className="p-4 border-b font-semibold text-slate-600">Sales Phone</th>
              <th className="p-4 border-b font-semibold text-slate-600">Affiliate URL</th>
              <th className="p-4 border-b font-semibold text-slate-600">Coverage Map</th>
              <th className="p-4 border-b font-semibold text-slate-600">Top Pick</th>
              <th className="p-4 border-b font-semibold text-slate-600">Status</th>
              <th className="p-4 border-b font-semibold text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {carriers.map(c => (
              <tr key={c.id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="h-10 w-16 bg-white border border-slate-100 rounded flex items-center justify-center p-1">
                    {c.logoPath ? <img src={c.logoPath} alt={c.name} className="max-h-full max-w-full object-contain" /> : 'No Logo'}
                  </div>
                </td>
                <td className="p-4 font-bold text-slate-800">{c.name}</td>
                
                <td className="p-4">
                  <input 
                    type="text" 
                    name="phoneNumber" 
                    defaultValue={c.phoneNumber || ''} 
                    form={`form-${c.id}`}
                    placeholder="1-800-..."
                    className="border border-slate-300 p-2 rounded text-sm w-36 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </td>
                <td className="p-4">
                  <input 
                    type="text" 
                    name="affiliateUrl" 
                    defaultValue={c.affiliateUrl || ''} 
                    form={`form-${c.id}`}
                    placeholder="https://..."
                    className="border border-slate-300 p-2 rounded text-sm w-56 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </td>

                <td className="p-4 text-slate-600 text-sm font-medium">
                  {c.isNationwide ? (
                    <span className="text-blue-600 font-bold">Nationwide</span>
                  ) : (
                    `${c._count.coverages} Zips`
                  )}
                </td>
                <td className="p-4">
                  <form action={toggleTopPick.bind(null, c.id, !c.isTopPick)}>
                    <button type="submit" className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition cursor-pointer border ${c.isTopPick ? 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200' : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'}`} title="Click to feature this carrier globally">
                      {c.isTopPick ? '\u2605 Featured' : '\u2606 Set Top Pick'}
                    </button>
                  </form>
                </td>
                <td className="p-4">
                  <form action={toggleCarrierStatus.bind(null, c.id, !c.isActive)}>
                    <button type="submit" className={`px-3 py-1.5 rounded-full text-xs font-bold text-white shadow-sm hover:opacity-80 transition cursor-pointer ${c.isActive ? 'bg-green-500' : 'bg-red-500'}`} title="Click to instantly toggle active status">
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </form>
                </td>
                <td className="p-4 flex gap-4 items-center">
                  <form id={`form-${c.id}`} action={quickUpdateCarrier.bind(null, c.id)}>
                    <SaveStatusButton />
                  </form>
                  <a href={`/admin/carriers/${c.id}`} className="text-blue-600 font-semibold hover:text-blue-800 hover:underline">Full Edit &rarr;</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}