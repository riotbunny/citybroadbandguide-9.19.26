const fs = require('fs');

let content = fs.readFileSync('src/app/admin/actions.ts', 'utf8');

// Add the import
if (!content.includes("@vercel/blob")) {
    content = content.replace("import { redirect } from 'next/navigation';", "import { redirect } from 'next/navigation';\nimport { put } from '@vercel/blob';");
}

// Replace updateCarrier logo upload
content = content.replace(
    /if \(logo && logo\.size > 0\) \{[\s\S]*?logoPathUpdate = [^;]+;/m,
    `if (logo && logo.size > 0) {\n    const safeName = logo.name.replace(/[^a-zA-Z0-9.-]/g, '');\n    const blob = await put(\`logos/\${Date.now()}-\${safeName}\`, logo, { access: 'public' });\n    logoPathUpdate = blob.url;\n  }`
);

// Replace addPlan fccLabel upload
content = content.replace(
    /if \(fccLabel && fccLabel\.size > 0\) \{[\s\S]*?fccLabelPath = [^;]+;/m,
    `if (fccLabel && fccLabel.size > 0) {\n    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');\n    const blob = await put(\`labels/fcc-\${Date.now()}-\${safeName}\`, fccLabel, { access: 'public' });\n    fccLabelPath = blob.url;\n  }`
);

// Replace updatePlan fccLabel upload
content = content.replace(
    /if \(fccLabel && fccLabel\.size > 0\) \{[\s\S]*?fccLabelPath = [^;]+;/m,
    `if (fccLabel && fccLabel.size > 0) {\n    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');\n    const blob = await put(\`labels/fcc-\${Date.now()}-\${safeName}\`, fccLabel, { access: 'public' });\n    fccLabelPath = blob.url;\n  }`
);

fs.writeFileSync('src/app/admin/actions.ts', content);