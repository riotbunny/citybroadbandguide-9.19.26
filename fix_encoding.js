const fs = require('fs');
const file = 'src/app/research/fastest-cities/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Use a wildcard to replace the entire line containing the corrupted text
content = content.replace(
  /Original Research.*Fall 2026/g,
  'Original Research &mdash; Fall 2026'
);

fs.writeFileSync(file, content);