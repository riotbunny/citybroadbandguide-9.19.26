const fs = require('fs');

// --- UPDATE PAGE.TSX ---
const pageFile = 'src/app/admin/carriers/[id]/page.tsx';
let pageContent = fs.readFileSync(pageFile, 'utf8');

// 1. Add encType to the hidden edit forms
pageContent = pageContent.replace(/<form id=\{"edit-plan-" \+ plan\.id\} action=\{/g, '<form id={"edit-plan-" + plan.id} encType="multipart/form-data" action={');

// 2. Change 'Details' table header to 'FCC Data & Details'
pageContent = pageContent.replace(
  /<th className="p-4 border-b font-semibold text-slate-600">Details<\/th>/g, 
  '<th className="p-4 border-b font-semibold text-slate-600 w-1/3">FCC Data & Details</th>'
);

// 3. Replace the details td cell with the expanded FCC fields
const detailsOld = /<td className="p-4">\s*<input type="text" name="description" defaultValue=\{plan\.description \|\| ''\} form=\{"edit-plan-" \+ plan\.id\} className="border border-slate-200 p-2 rounded w-full text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Details\.\.\." \/>\s*<\/td>/;
const detailsNew = `<td className="p-4 space-y-2">
                          <input type="text" name="description" defaultValue={plan.description || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-full text-sm text-slate-600 outline-none focus:ring-2 focus:ring-blue-500" placeholder="Description..." />
                          <div className="flex gap-2">
                            <input type="number" step="0.01" name="postPromoPrice" defaultValue={plan.postPromoPrice || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-1/3 text-xs" placeholder="Post-Promo $" />
                            <input type="number" name="peakLatency" defaultValue={plan.peakLatency || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-1/3 text-xs" placeholder="Latency ms" />
                            <input type="text" name="dataCap" defaultValue={plan.dataCap || ''} form={"edit-plan-" + plan.id} className="border border-slate-200 p-2 rounded w-1/3 text-xs" placeholder="Data Cap" />
                          </div>
                          <div className="flex items-center gap-2 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-400 uppercase">FCC Label Img:</span>
                            <input type="file" name="fccLabel" accept="image/*" form={"edit-plan-" + plan.id} className="text-xs text-slate-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                            {plan.fccLabelImage && <a href={plan.fccLabelImage} target="_blank" className="text-xs font-bold text-indigo-500 underline ml-auto">View</a>}
                          </div>
                        </td>`;
pageContent = pageContent.replace(detailsOld, detailsNew);

// 4. Update the "Add New Plan" form
pageContent = pageContent.replace(/<form action=\{/g, '<form encType="multipart/form-data" action={');

const addPlanOld = /<div>\s*<label className="block text-sm font-semibold text-slate-700 mb-1">Description<\/label>\s*<textarea name="description" rows=\{2\} placeholder="Bonus features\.\.\." className="w-full border border-slate-300 p-2\.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"><\/textarea>\s*<\/div>/;
const addPlanNew = `<div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Description</label>
                  <textarea name="description" rows={2} placeholder="Bonus features..." className="w-full border border-slate-300 p-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>
                <div className="col-span-full mt-4 border-t pt-4">
                  <h4 className="font-bold text-slate-800 mb-4">FCC Broadband Nutrition Label Data</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Post-Promo Price ($)</label>
                      <input type="number" step="0.01" name="postPromoPrice" placeholder="e.g. 79.99" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Peak Latency (ms)</label>
                      <input type="number" name="peakLatency" placeholder="e.g. 24" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Data Cap</label>
                      <input type="text" name="dataCap" placeholder="e.g. Unlimited" className="w-full border border-slate-300 p-2.5 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Upload FCC Label Screenshot</label>
                    <input type="file" name="fccLabel" accept="image/*" className="w-full border border-slate-300 p-2 rounded-lg text-sm bg-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                </div>`;
pageContent = pageContent.replace(addPlanOld, addPlanNew);

fs.writeFileSync(pageFile, pageContent);

// --- UPDATE ACTIONS.TS ---
const actionsFile = 'src/app/admin/actions.ts';
let actionsContent = fs.readFileSync(actionsFile, 'utf8');

// Add path/fs imports if not present
if (!actionsContent.includes("import { promises as fs }")) {
    actionsContent = actionsContent.replace("import prisma", "import { promises as fs }\nimport path from 'path'\nimport prisma");
}

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

actionsContent = actionsContent.replace(
  /const dataCap = formData\.get\('dataCap'\) as string;/,
  `const dataCap = formData.get('dataCap') as string;\n${fileUploadLogic}`
);

actionsContent = actionsContent.replace(
  /data: \{\n\s*carrierId,\n\s*name,\n\s*price,\n\s*postPromoPrice,\n\s*peakLatency,\n\s*dataCap,\n\s*downloadSpeed,\n\s*uploadSpeed,\n\s*description\n\s*\}/,
  `data: {
      carrierId,
      name,
      price,
      postPromoPrice,
      peakLatency,
      dataCap,
      downloadSpeed,
      uploadSpeed,
      description,
      fccLabelImage: fccLabelPath
    }`
);

actionsContent = actionsContent.replace(
  /data: \{ name, price, postPromoPrice, peakLatency, dataCap, downloadSpeed, uploadSpeed, description \}/g,
  `data: { name, price, postPromoPrice, peakLatency, dataCap, downloadSpeed, uploadSpeed, description, ...(fccLabelPath && { fccLabelImage: fccLabelPath }) }`
);

fs.writeFileSync(actionsFile, actionsContent);
