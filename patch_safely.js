const fs = require('fs');

let content = fs.readFileSync('src/app/admin/actions.ts', 'utf8');

// Add the import
if (!content.includes("@vercel/blob")) {
    content = content.replace("import { redirect } from 'next/navigation';", "import { redirect } from 'next/navigation';\nimport { put } from '@vercel/blob';");
}

// Block 1: Logos
const logoBlockOld = `    const buffer = Buffer.from(await logo.arrayBuffer());
    const safeName = logo.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = \`\${Date.now()}-\${safeName}\`;
    const filepath = path.join(process.cwd(), 'public', 'logos', filename);
    
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    
    logoPathUpdate = \`/logos/\${filename}\`;`;

const logoBlockNew = `    const safeName = logo.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const blob = await put(\`logos/\${Date.now()}-\${safeName}\`, logo, { access: 'public' });
    logoPathUpdate = blob.url;`;

content = content.replace(logoBlockOld, logoBlockNew);

// Block 2 & 3: FCC Labels
const fccBlockOld = `    const buffer = Buffer.from(await fccLabel.arrayBuffer());
    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = \`fcc-\${Date.now()}-\${safeName}\`;
    const filepath = path.join(process.cwd(), 'public', 'labels', filename);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    fccLabelPath = \`/labels/\${filename}\`;`;

const fccBlockNew = `    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const blob = await put(\`labels/fcc-\${Date.now()}-\${safeName}\`, fccLabel, { access: 'public' });
    fccLabelPath = blob.url;`;

content = content.replaceAll(fccBlockOld, fccBlockNew);

fs.writeFileSync('src/app/admin/actions.ts', content);