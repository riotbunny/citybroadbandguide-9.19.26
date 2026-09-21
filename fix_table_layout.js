const fs = require('fs');
const file = 'src/app/admin/carriers/[id]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add minimum width to Plan Name input so it stops squishing
content = content.replace(
  /w-full text-sm font-bold text-slate-800 outline-none/g, 
  'w-full min-w-[180px] text-sm font-bold text-slate-800 outline-none'
);

// 2. Adjust Table Headers to prevent column collapsing
content = content.replace(
  /<th className="p-4 border-b font-semibold text-slate-600">Plan Name<\/th>/g, 
  '<th className="p-4 border-b font-semibold text-slate-600 w-1/4 min-w-[180px]">Plan Name</th>'
);

content = content.replace(
  /<th className="p-4 border-b font-semibold text-slate-600">Speed \(DL \/ UL\)<\/th>/g, 
  '<th className="p-4 border-b font-semibold text-slate-600 min-w-[220px]">Speed (DL / UL)</th>'
);

content = content.replace(
  /<th className="p-4 border-b font-semibold text-slate-600 w-1\/3">FCC Data & Details<\/th>/g, 
  '<th className="p-4 border-b font-semibold text-slate-600 w-2/5 min-w-[350px]">FCC Data & Details</th>'
);

// 3. Wrap table in overflow-x-auto if it isn't already to allow horizontal scrolling on small screens instead of squishing
if (!content.includes('overflow-x-auto rounded-xl')) {
  content = content.replace(
    /<table className="w-full text-left border-collapse">/, 
    '<div className="overflow-x-auto rounded-xl border-x border-slate-100"><table className="w-full text-left border-collapse min-w-[1000px]">'
  );
  content = content.replace(
    /<\/table>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/main>/, 
    '</table></div></div></div></div></div></main>'
  );
}

fs.writeFileSync(file, content);