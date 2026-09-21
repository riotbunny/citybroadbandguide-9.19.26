const fs = require('fs');

function injectAuthor(file) {
    let content = fs.readFileSync(file, 'utf8');
    const authorBlock = `
            {/* E-E-A-T Author Signal */}
            <div className="flex items-center justify-center md:justify-start gap-3 mt-6 mb-2">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                <span className="text-indigo-800 font-bold text-sm">JS</span>
              </div>
              <div className="text-left text-xs">
                <p className="font-bold text-slate-200">Expert Reviewed by <span className="text-white">James Sullivan</span></p>
                <p className="text-slate-400">Lead Telecom Analyst • <a href="/editorial-policy" className="underline hover:text-indigo-300">Read our Editorial Policy</a></p>
              </div>
            </div>`;
    
    // Insert under the dynamic subtitle on Hub pages
    content = content.replace(/<\/p>\s*(<div className="flex flex-col sm:flex-row)/, `</p>${authorBlock}\n            $1`);
    fs.writeFileSync(file, content);
}

injectAuthor('src/app/internet/[state]/page.tsx');
injectAuthor('src/app/internet/[state]/[city]/page.tsx');
injectAuthor('src/app/internet/[state]/[city]/[zip]/page.tsx');