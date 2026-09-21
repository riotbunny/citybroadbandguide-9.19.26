const fs = require('fs');
const file = 'src/app/internet/[state]/[city]/[zip]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const aggFccHTML = `
                    {/* FCC Regulatory Data (PSEO Value Injection) */}
                    <div className="mt-5 pt-5 border-t border-slate-100 flex flex-wrap gap-x-4 gap-y-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {(() => {
                        const allLatencies = carrier.plans?.map((p: any) => p.peakLatency).filter(Boolean) || [];
                        const allDataCaps = [...new Set(carrier.plans?.map((p: any) => p.dataCap).filter(Boolean))] || [];
                        const allPostPromos = carrier.plans?.map((p: any) => p.postPromoPrice).filter(Boolean) || [];
                        
                        const minLat = allLatencies.length ? Math.min(...allLatencies) : null;
                        const minPost = allPostPromos.length ? Math.min(...allPostPromos) : null;
                        const capDisplay = allDataCaps.length ? allDataCaps.join(', ') : null;

                        if (!minLat && !minPost && !capDisplay) return null;

                        return (
                          <>
                            {minPost && <span className="flex items-center gap-1"><span className="text-slate-400">Post-Promo:</span><span className="text-slate-800">From $\\{minPost}/mo</span></span>}
                            {minLat && <span className="flex items-center gap-1"><span className="text-slate-400">Peak Latency:</span><span className="text-slate-800">~\\{minLat}ms</span></span>}
                            {capDisplay && <span className="flex items-center gap-1"><span className="text-slate-400">Data Cap:</span><span className="text-slate-800">\\{capDisplay}</span></span>}
                          </>
                        );
                      })()}
                    </div>`;

// Insert the new FCC HTML right before the disclaimer or the View Plans button
content = content.replace(/\{carrier\.disclaimer && \(/g, `${aggFccHTML.replace(/\\\\/g, '')}\n                    {carrier.disclaimer && (`);

fs.writeFileSync(file, content);