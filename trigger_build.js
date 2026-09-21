const fs = require('fs');
let content = fs.readFileSync('src/app/admin/actions.ts', 'utf8');
content += '\n// Triggering fresh Vercel build to lock in environment variables.\n';
fs.writeFileSync('src/app/admin/actions.ts', content);