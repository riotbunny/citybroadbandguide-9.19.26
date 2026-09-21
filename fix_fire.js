const fs = require('fs');
let data = fs.readFileSync('src/app/internet/[state]/[city]/[zip]/page.tsx', 'utf8');

// The mangled emoji is between <span className="text-[13px] leading-none block -mt-[1px]"> and </span>
// We will use regex to safely replace whatever is inside that span.
data = data.replace(/<span className="text-\[13px\] leading-none block -mt-\[1px\]">.*?<\/span>/g, '<span className="text-[13px] leading-none block -mt-[1px]">&#128293;</span>');

fs.writeFileSync('src/app/internet/[state]/[city]/[zip]/page.tsx', data);