const fs = require('fs');
const file = 'src/app/internet/[state]/[city]/[zip]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// Add import
if (!content.includes('import SpeedTestWidget')) {
    content = content.replace(
        "import SortDropdown from '../../../../../components/SortDropdown'",
        "import SortDropdown from '../../../../../components/SortDropdown'\nimport SpeedTestWidget from '../../../../../components/SpeedTestWidget'"
    );
}

// Inject widget before the #providers section
const widgetHTML = `
      {/* Proprietary Data Collection Widget */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-30 w-full mb-12">
        <SpeedTestWidget zip={location.zip} />
      </div>`;

content = content.replace(/<div id="providers"/, `${widgetHTML}\n\n      <div id="providers"`);

fs.writeFileSync(file, content);