const fs = require('fs');
const file = 'src/app/admin/actions.ts';
let content = fs.readFileSync(file, 'utf8');

// Fix the NaN issue in updatePlan when speeds are left blank
content = content.replace(
  /const downloadSpeed = parseInt\(formData\.get\('downloadSpeed'\) as string\);/g,
  "const downloadSpeedStr = formData.get('downloadSpeed') as string;\n  const downloadSpeed = downloadSpeedStr ? parseInt(downloadSpeedStr) : null;"
);
content = content.replace(
  /const uploadSpeed = parseInt\(formData\.get\('uploadSpeed'\) as string\);/g,
  "const uploadSpeedStr = formData.get('uploadSpeed') as string;\n  const uploadSpeed = uploadSpeedStr ? parseInt(uploadSpeedStr) : null;"
);

fs.writeFileSync(file, content);