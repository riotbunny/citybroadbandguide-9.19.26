const fs = require('fs');
const file = 'src/components/Footer.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the literal string `n with actual newlines
content = content.replace(/`n/g, '\n');

fs.writeFileSync(file, content);