const fs = require('fs');
const file = 'src/app/admin/carriers/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The new inputs to inject after Price
const addInputs = `</div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Post-Promo Price ($)</label>
                          <input type="number" step="0.01" name="postPromoPrice" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 79.99" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Peak Latency (ms)</label>
                          <input type="number" name="peakLatency" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 24" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Data Cap</label>
                          <input type="text" name="dataCap" className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Unlimited or 1.2TB" />`;

const editInputs = `</div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Post-Promo Price ($)</label>
                              <input type="number" step="0.01" name="postPromoPrice" defaultValue={plan.postPromoPrice || ''} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 79.99" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Peak Latency (ms)</label>
                              <input type="number" name="peakLatency" defaultValue={plan.peakLatency || ''} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 24" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Data Cap</label>
                              <input type="text" name="dataCap" defaultValue={plan.dataCap || ''} className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Unlimited or 1.2TB" />`;


// Change "Price" to "Promo Price"
content = content.replace(/>Price \(\$\)<\/label>/g, '>Promo Price ($)</label>');

// Inject new inputs for 'Add Plan' modal
content = content.replace(/name="price"\s*className="w-full.*?required \/>\s*<\/div>/, match => {
    return match.replace(/<\/div>$/, addInputs);
});

// Inject new inputs for 'Edit Plan' section
content = content.replace(/name="price"\s*defaultValue=\{plan\.price\}\s*className="w-full.*?required \/>\s*<\/div>/, match => {
    return match.replace(/<\/div>$/, editInputs);
});

fs.writeFileSync(file, content);