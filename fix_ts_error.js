const fs = require('fs');
const file = 'src/app/internet/[state]/[city]/[zip]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/const allDataCaps = \[\.\.\.new Set\(carrier\.plans\?\.map\(\(p: any\) => p\.dataCap\)\.filter\(Boolean\)\)\] \|\| \[\];/g, 'const allDataCaps = Array.from(new Set(carrier.plans?.map((p: any) => p.dataCap).filter(Boolean)));');

fs.writeFileSync(file, content);