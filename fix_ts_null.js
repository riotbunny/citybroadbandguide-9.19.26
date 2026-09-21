const fs = require('fs');
const file = 'src/app/research/fastest-cities/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// The block starts with <div className="text-2xl font-black text-indigo-600">
const oldBlock = `<div className="text-2xl font-black text-indigo-600">
                    {plan.downloadSpeed >= 1000 ? (plan.downloadSpeed / 1000) : plan.downloadSpeed} 
                    <span className="text-sm text-slate-400 uppercase tracking-widest ml-1">
                      {plan.downloadSpeed >= 1000 ? 'Gbps' : 'Mbps'}
                    </span>
                  </div>`;

const newBlock = `<div className="text-2xl font-black text-indigo-600">
                    {(plan.downloadSpeed || 0) >= 1000 ? ((plan.downloadSpeed || 0) / 1000) : (plan.downloadSpeed || 0)} 
                    <span className="text-sm text-slate-400 uppercase tracking-widest ml-1">
                      {(plan.downloadSpeed || 0) >= 1000 ? 'Gbps' : 'Mbps'}
                    </span>
                  </div>`;

// Since spaces might differ, lets just replace occurrences of 'plan.downloadSpeed' in that general vicinity.
// Actually, it's safer to just do a smart regex replace just for the conditional parts inside the map.
content = content.replace(/plan\.downloadSpeed >= 1000/g, '(plan.downloadSpeed || 0) >= 1000');
content = content.replace(/\(plan\.downloadSpeed \/ 1000\)/g, '((plan.downloadSpeed || 0) / 1000)');
content = content.replace(/ : plan\.downloadSpeed\} /g, ' : (plan.downloadSpeed || 0)} ');

fs.writeFileSync(file, content);