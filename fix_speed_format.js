const fs = require('fs');
const file = 'src/app/research/fastest-cities/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Filter out 50Gig commercial tiers by capping at 10Gbps
content = content.replace(
  /where: \{ downloadSpeed: \{ gt: 0 \} \},/g,
  'where: { downloadSpeed: { gt: 0, lte: 10000 } }, // Cap at 10 Gbps to filter out 50G commercial/enthusiast tiers'
);

// Fix the encoding artifact in the "Original Research" tag
content = content.replace(
  /Original Research AAA\?sAA,A Fall 2026/g,
  'Original Research — Fall 2026'
);

// Format the display to use Gbps (Gigs) instead of Mbps for 1000+
const oldSpeedHtml = /<div className="text-2xl font-black text-indigo-600">\{plan\.downloadSpeed\} <span className="text-sm text-slate-400 uppercase tracking-widest">Mbps<\/span><\/div>/g;
const newSpeedHtml = `<div className="text-2xl font-black text-indigo-600">
                    {plan.downloadSpeed >= 1000 ? (plan.downloadSpeed / 1000) : plan.downloadSpeed} 
                    <span className="text-sm text-slate-400 uppercase tracking-widest ml-1">
                      {plan.downloadSpeed >= 1000 ? 'Gbps' : 'Mbps'}
                    </span>
                  </div>`;
content = content.replace(oldSpeedHtml, newSpeedHtml);

fs.writeFileSync(file, content);