const fs = require('fs');
let data = fs.readFileSync('src/app/internet/[state]/[city]/page.tsx', 'utf8');

// Find the line with Editor's Pick
const lines = data.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("Editor's Pick {new Date().getFullYear()}")) {
    lines[i] = "                &#127942; EDITOR'S PICK {new Date().getFullYear()}";
  }
}

fs.writeFileSync('src/app/internet/[state]/[city]/page.tsx', lines.join('\n'));