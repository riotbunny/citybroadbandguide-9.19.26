import { PrismaClient } from '@prisma/client'
import { updateCarrier, addCoverage, addCoverageByCity, removeCoverageByCity, removeCoverage, addPlan, removePlan, deleteCarrier , updatePlan} from '../../actions'
import { notFound } from 'next/navigation'
import AutoDismissBanner from '../../../../components/AutoDismissBanner'

const prisma = new PrismaClient()

export default async function EditCarrierPage({ 
  params,
  searchParams
}: { 
  params: Promise<{ id: string }>,
  searchParams: Promise<{ success?: string }>
}) {
  const { id } = await params;
  const { success } = await searchParams;

  const carrier = await prisma.carrier.findUnique({
    where: { id },
    include: {
      plans: {
        orderBy: { price: 'asc' }
      },
      coverages: {
        include: { location: true },
        orderBy: [ { location: { city: 'asc' } }, { zip: 'asc' } ]
      }
    }
  });

  const totalCoverage = await prisma.coverage.count({ where: { carrierId: id } });

  if (!carrier) return notFound();

  // Group coverages by City/State for the Facebook Ads-style UI
  const groupedCoverages = carrier.coverages.reduce((acc, cov) => {
    const key = `${cov.location.city}, ${cov.location.state}`;
    if (!acc[key]) {
      acc[key] = { city: cov.location.city, state: cov.location.state, count: 0 };
    }
    acc[key].count++;
    return acc;
  }, {} as Record<string, { city: string, state: string, count: number }>);

  const groupedArray = Object.values(groupedCoverages);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <a href="/admin" className="text-blue-600 hover:underline mb-6 inline-block font-medium">&larr; Back to Dashboard</a>
      
      <div className="flex items-center space-x-6 mb-6">
        <div className="h-16 w-24 bg-white border border-slate-200 rounded p-2 flex items-center justify-center shadow-sm">
          {carrier.logoPath && <img src={carrier.logoPath} alt={carrier.name} className="max-h-full max-w-full object-contain" />}
        </div>
        <h1 className="text-3xl font-extrabold text-slate-800">Edit Carrier: {carrier.name}</h1>
      </div>

      {success && <AutoDismissBanner timestamp={success} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form encType="multipart/form-data" action={updateCarrier.bind(null, carrier.id)} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Carrier Details</h2>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Update Logo Image (Optional)</label>
            <input type="file" name="logo" accept="image/*" className="w-full border border-slate-300 p-2 rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-slate-500 mt-1">Leave blank to keep the current logo.</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Carrier Name</label>
            <input type="text" name="name" defaultValue={carrier.name} className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Brand Accent Color</label>
            <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <input type="color" name="brandColor" defaultValue={carrier.brandColor || '#4f46e5'} className="h-8 w-12 border-0 bg-transparent cursor-pointer rounded-sm" title="Choose brand color" />
              <span className="text-sm font-medium text-slate-500">Themes the conversion buttons for this specific provider.</span>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Disclaimer (Optional)</label>
            <textarea name="disclaimer" rows={2} defaultValue={carrier.disclaimer || ''} placeholder="e.g. Speeds may vary. Requires 12-month contract." className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <p className="text-xs text-slate-500 mt-1">If left blank, nothing will show on the provider card.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">About / Reviews (Optional)</label>
            <textarea name="aboutText" rows={4} defaultValue={carrier.aboutText || ''} placeholder="e.g. Write a brief paragraph about the carrier, features, or some customer reviews..." className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
            <p className="text-xs text-slate-500 mt-1">If left blank, it will not show up on the See Plans page.</p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Star Rating (1.0 to 5.0)</label>
            <input type="number" step="0.1" min="1" max="5" name="rating" defaultValue={carrier.rating || 4.5} className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            <p className="text-xs text-slate-500 mt-1">Editorial star rating shown on the provider page.</p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Affiliate URL (Tracking Link)</label>
            <input type="url" name="affiliateUrl" defaultValue={carrier.affiliateUrl || ''} placeholder="https://..." className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-1">Sales Phone Number</label>
            <input type="text" name="phoneNumber" defaultValue={carrier.phoneNumber || ''} placeholder="e.g. 1-800-555-5555" className="w-full border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="mb-4 flex items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
            <input type="checkbox" name="isActive" defaultChecked={carrier.isActive} id="activeCheck" className="mr-3 h-5 w-5 text-blue-600 rounded" />
            <label htmlFor="activeCheck" className="text-sm font-medium text-slate-700">Active (Visible on public site)</label>
          </div>
          <div className="mb-8 flex items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
            <input type="checkbox" name="isNationwide" defaultChecked={carrier.isNationwide} id="nationwideCheck" className="mr-3 h-5 w-5 text-blue-600 rounded" />
            <label htmlFor="nationwideCheck" className="text-sm font-medium text-slate-700">Nationwide Coverage (Shows on ALL zips)</label>
          </div>
          
            <div className="mb-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
              <span className="block text-sm font-bold text-slate-800 mb-3 uppercase tracking-widest">Connection Types Offered</span>
              <div className="flex flex-wrap items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasFiber" defaultChecked={carrier.hasFiber} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">Fiber Optic</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasCable" defaultChecked={carrier.hasCable} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">Cable</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="has5G" defaultChecked={carrier.has5G} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">5G Home</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="hasSatellite" defaultChecked={carrier.hasSatellite} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="text-sm font-semibold text-slate-700">Satellite</span>
                </label>
              </div>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-bold transition shadow-sm">Save Carrier Changes</button>
        </form>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Location Manager</h2>
            <form className="flex flex-col gap-4 mb-8 border-b border-slate-100 pb-8">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Add Cities (comma-separated)</label>
                  <textarea name="cities" rows={2} placeholder="e.g. Dallas, Austin, Houston" className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" required></textarea>
                </div>
                <div className="w-32">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">State (Abbr)</label>
                  <input type="text" name="state" placeholder="e.g. TX" maxLength={2} className="w-full border border-slate-300 p-2.5 rounded-lg outline-none h-fit focus:ring-2 focus:ring-blue-500" required />
                </div>
              </div>
              <div className="flex gap-4">
                <button formAction={addCoverageByCity.bind(null, carrier.id)} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-bold text-sm transition shadow-sm">+ Add Region Targeting</button>
              </div>
            </form>

            <h3 className="font-bold text-slate-800 mb-3">Active Targeted Regions <span className="font-normal text-slate-500 text-sm ml-2">({totalCoverage} total zip codes)</span></h3>
            <div className="max-h-80 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
              {groupedArray.map(group => (
                <div key={`${group.city}-${group.state}`} className="p-3 text-sm flex justify-between items-center hover:bg-slate-50 transition">
                  <span className="font-medium text-slate-800">{group.city}, {group.state} <span className="text-slate-400 font-normal ml-2">({group.count} zips)</span></span>
                  <form encType="multipart/form-data" action={removeCoverageByCity.bind(null, carrier.id)}>
                    <input type="hidden" name="cities" value={group.city} />
                    <input type="hidden" name="state" value={group.state} />
                    <button type="submit" className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md font-semibold text-xs transition border border-red-200">Remove</button>
                  </form>
                </div>
              ))}
              {groupedArray.length === 0 && <p className="p-6 text-slate-500 text-sm text-center">No regions targeted yet.</p>}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-2">Pricing Plans & Packages</h2>
        
        {carrier.plans.length > 0 ? (
          <div className="mb-8 overflow-hidden border border-slate-200 rounded-lg">
            <div className="overflow-x-auto rounded-xl border-x border-slate-100"><table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-slate-50">
                <tr>
                  <th className="p-4 border-b font-semibold text-slate-600 w-1/4 min-w-[180px]">Plan Name</th>
                  <th className="p-4 border-b font-semibold text-slate-600 min-w-[220px]">Speed (DL / UL)</th>
                  <th className="p-4 border-b font-semibold text-slate-600">Price/mo</th>
                  <th className="p-4 border-b font-semibold text-slate-600 w-2/5 min-w-[350px]">FCC Data & Details</th>
                  <th className="p-4 border-b font-semibold text-slate-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {carrier.plans.map(plan => (
                    <tr key={plan.id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <input type="text" name="name" defaultValue={plan.name} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-full min-w-[180px] text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-blue-500" />
                      </td>
                      <td className="p-4 flex items-center gap-2">
                        <input type="number" name="downloadSpeed" defaultValue={plan.downloadSpeed || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-20 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="DL" /> <span className="text-xs text-slate-500 font-bold">Mbps</span>
                        <span className="text-slate-300 mx-1">/</span>
                        <input type="number" name="uploadSpeed" defaultValue={plan.uploadSpeed || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-20 text-sm outline-none focus:ring-2 focus:ring-blue-500" placeholder="UL" /> <span className="text-xs text-slate-500 font-bold">Mbps</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-green-600 font-bold">
                          $<input type="number" step="0.01" name="price" defaultValue={plan.price > 0 ? plan.price : ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-20 text-sm font-bold text-green-600 ml-1 outline-none focus:ring-2 focus:ring-green-500" />
                        </div>
                      </td>
                      <td className="p-4 space-y-2">
                          <input type="text" name="description" defaultValue={plan.description || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-full text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Description..." />
                          <div className="flex gap-2">
                            <input type="number" step="0.01" name="postPromoPrice" defaultValue={plan.postPromoPrice || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-1/3 text-xs" placeholder="Post-Promo $" />
                            <input type="number" name="peakLatency" defaultValue={plan.peakLatency || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-1/3 text-xs" placeholder="Latency ms" />
                            <input type="text" name="dataCap" defaultValue={plan.dataCap || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-1/3 text-xs" placeholder="Data Cap" />
                          </div>
                          <div className="flex items-center gap-2 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">FCC Label Img:</span>
                            <input type="file" name="fccLabel" accept="image/*" form={"edit-plan-" + plan.id} className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            {plan.fccLabelImage && <a href={plan.fccLabelImage} target="_blank" className="text-xs font-bold text-indigo-500 underline ml-auto">View</a>}
                          </div>
                        </td>
                      <td className="p-4">
                        <div className="flex gap-4 items-center">
                          <form id={"edit-plan-" + plan.id} encType="multipart/form-data" action={updatePlan.bind(null, plan.id, carrier.id)}>
                            <button type="submit" className="text-emerald-600 hover:text-emerald-800 font-bold text-sm hover:underline">Save</button>
                          </form>
                          <form encType="multipart/form-data" action={removePlan.bind(null, plan.id, carrier.id)}>
                            <button type="submit" className="text-red-500 hover:text-red-700 font-semibold text-sm hover:underline">Remove</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody></table></div></div>) : (
          <p className="text-slate-500 mb-8 italic">No plans created for this carrier yet.</p>
        )}

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-800 mb-4 text-lg">Add New Plan</h3>
          <form encType="multipart/form-data" action={addPlan.bind(null, carrier.id)}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Plan Name *</label>
                <input type="text" name="name" required placeholder="e.g. Gig-Speed Fiber" className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Monthly Price ($) *</label>
                <input type="number" step="0.01" name="price" required placeholder="69.99" className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Download Speed (Mbps)</label>
                <input type="number" name="downloadSpeed" placeholder="1000" className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Upload Speed (Mbps)</label>
                <input type="number" name="uploadSpeed" placeholder="1000" className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-1">Description / Extra Details</label>
              <input type="text" name="description" placeholder="e.g. Includes free Wi-Fi equipment and no data caps." className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button type="submit" className="bg-slate-900 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition shadow-sm">
              + Save New Plan
            </button>
                    </form>
        </div>
        
        {/* DANGER ZONE */}
        <div className="mt-16 pt-8 border-t border-red-200">
          <h2 className="text-xl font-black text-red-600 mb-4 uppercase tracking-widest">Danger Zone</h2>
          <div className="bg-red-50 p-6 md:p-8 rounded-2xl border border-red-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-red-900 mb-1">Delete Provider Permanently</h3>
              <p className="text-sm font-medium text-red-700">This will instantly wipe this brand, all of its pricing tiers, and all of its geographic coverage mappings from the database. This action is permanent and cannot be undone.</p>
            </div>
            <form encType="multipart/form-data" action={deleteCarrier.bind(null, carrier.id)}>
              <button type="submit" className="bg-red-600 hover:bg-red-800 text-white font-black py-4 px-8 rounded-xl transition-all shadow-md whitespace-nowrap">
                DELETE PROVIDER
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}