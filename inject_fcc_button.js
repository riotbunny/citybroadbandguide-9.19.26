const fs = require('fs');
const file = 'src/app/internet/[state]/[city]/[zip]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

const newFccHtml = `
                              {/* FCC Broadband Label Data */}
                              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-500 items-center">
                                {plan.postPromoPrice && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-400">Post-Promo:</span> <span className="text-slate-700">$\\{plan.postPromoPrice}/mo</span>
                                  </div>
                                )}
                                {plan.peakLatency && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-400">Typical Latency:</span> <span className="text-slate-700">\\{plan.peakLatency}ms</span>
                                  </div>
                                )}
                                {plan.dataCap && (
                                  <div className="flex items-center gap-1">
                                    <span className="text-slate-400">Data Cap:</span> <span className="text-slate-700">\\{plan.dataCap}</span>
                                  </div>
                                )}
                                {plan.fccLabelImage && (
                                  <a href={plan.fccLabelImage} target="_blank" rel="noopener noreferrer" className="ml-auto flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md transition-colors border border-slate-200 shadow-sm">
                                    <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                    View FCC Label
                                  </a>
                                )}
                              </div>`;

content = content.replace(/\{\/\* FCC Broadband Label Data \*\/\}[\s\S]*?<\/div>/m, newFccHtml.replace(/\\\\/g, ''));

fs.writeFileSync(file, content);