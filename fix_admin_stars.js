const fs = require('fs');

const file = 'src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Replace the corrupted strings with clean safe HTML entities
content = content.replace(/\{c\.isTopPick \? '.*? Featured' : '.*? Set Top Pick'\}/g, "{c.isTopPick ? '\\u2605 Featured' : '\\u2606 Set Top Pick'}");

fs.writeFileSync(file, content);