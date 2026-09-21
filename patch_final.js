const fs = require('fs');

let content = fs.readFileSync('src/app/admin/actions.ts', 'utf8');

// Replace the logo upload block
content = content.replace(
  /if \(logo && logo\.size > 0\) \{[\s\S]*?logoPathUpdate = `\/logos\/\$\{filename\}`;[\s\n]*\}/,
  `if (logo && logo.size > 0) {
    const safeName = logo.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const blob = await put(\`logos/\${Date.now()}-\${safeName}\`, logo, { access: 'public' });
    logoPathUpdate = blob.url;
  }`
);

// Replace the addPlan FCC Label block
content = content.replace(
  /if \(fccLabel && fccLabel\.size > 0\) \{[\s\S]*?fccLabelPath = `\/labels\/\$\{filename\}`;[\s\n]*\}/g,
  `if (fccLabel && fccLabel.size > 0) {
    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const blob = await put(\`labels/fcc-\${Date.now()}-\${safeName}\`, fccLabel, { access: 'public' });
    fccLabelPath = blob.url;
  }`
);

fs.writeFileSync('src/app/admin/actions.ts', content);