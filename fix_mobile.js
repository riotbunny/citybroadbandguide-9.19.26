const fs = require('fs');

// 1. Fix SpeedTestWidget Mobile CSS
let file1 = 'src/components/SpeedTestWidget.tsx';
let content1 = fs.readFileSync(file1, 'utf8');

// Container padding
content1 = content1.replace(
  /bg-slate-900 rounded-3xl shadow-2xl p-8 mb-12/,
  'bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 mb-12'
);
// Metrics gap
content1 = content1.replace(
  /flex flex-1 items-center justify-center gap-6 md:gap-12 w-full/,
  'flex flex-1 items-center justify-center gap-4 md:gap-12 w-full'
);
// Metrics Text sizing (do this carefully)
content1 = content1.replace(/text-3xl font-black text-slate-200/g, 'text-2xl md:text-3xl font-black text-slate-200');
content1 = content1.replace(/text-3xl font-black text-white/g, 'text-2xl md:text-3xl font-black text-white');

// Button sizing
content1 = content1.replace(/px-8 py-4 bg-white/g, 'px-6 md:px-8 py-4 bg-white');

fs.writeFileSync(file1, content1);

// 2. Fix Zip Page Mobile UI (Check Availability Button & Wrap tightness)
let file2 = 'src/app/internet/[state]/[city]/[zip]/page.tsx';
let content2 = fs.readFileSync(file2, 'utf8');

// Upgrade the button to look like a premium affiliate button
content2 = content2.replace(
  /<a href=\{`\/providers\/\$\{carrier\.slug\}\?city=\$\{encodeURIComponent\(location\.city\)\}&state=\$\{encodeURIComponent\(location\.state\)\}`\} className="w-full py-3\.5 px-4 rounded-xl font-black uppercase tracking-wider text-center text-sm transition-all shadow-md active:scale-\[0\.98\] border-2 bg-white hover:bg-slate-50".*?See Plans\s*<\/a>/s,
  `<a href={\`/providers/\${carrier.slug}?city=\${encodeURIComponent(location.city)}&state=\${encodeURIComponent(location.state)}\`} className="w-full py-4 px-4 rounded-xl font-black uppercase tracking-wider text-center text-[13px] md:text-sm transition-all shadow-lg active:scale-[0.98] border-2 bg-indigo-600 hover:bg-indigo-700 text-white border-transparent flex items-center justify-center gap-2">
    Check Availability
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
  </a>`
);

fs.writeFileSync(file2, content2);