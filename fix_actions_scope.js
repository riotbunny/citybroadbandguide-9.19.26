const fs = require('fs');
const file = 'src/app/admin/actions.ts';
let content = fs.readFileSync(file, 'utf8');

const fileUploadLogic = `
  let fccLabelPath = undefined;
  const fccLabel = formData.get('fccLabel') as File | null;
  if (fccLabel && fccLabel.size > 0) {
    const buffer = Buffer.from(await fccLabel.arrayBuffer());
    const safeName = fccLabel.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = \`fcc-\${Date.now()}-\${safeName}\`;
    const filepath = path.join(process.cwd(), 'public', 'labels', filename);
    await fs.mkdir(path.dirname(filepath), { recursive: true });
    await fs.writeFile(filepath, buffer);
    fccLabelPath = \`/labels/\${filename}\`;
  }`;

// Find updatePlan block
const updatePlanStart = content.indexOf('export async function updatePlan');
const updatePlanDataCap = content.indexOf("const dataCap = formData.get('dataCap') as string;", updatePlanStart);

if (updatePlanDataCap !== -1) {
    content = content.slice(0, updatePlanDataCap + 50) + fileUploadLogic + content.slice(updatePlanDataCap + 50);
}

fs.writeFileSync(file, content);