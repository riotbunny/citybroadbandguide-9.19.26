const fs = require('fs');
const file = 'src/app/internet/[state]/[city]/page.tsx';
let content = fs.readFileSync(file, 'utf8');

if (!content.includes('import SpeedTestWidget')) {
    content = content.replace(
        "import Navbar from '../../../../components/Navbar'",
        "import Navbar from '../../../../components/Navbar'\nimport SpeedTestWidget from '../../../../components/SpeedTestWidget'"
    );
}

const widgetHTML = `
      {/* Proprietary Data Collection Widget */}
      <div className="max-w-6xl mx-auto px-4 -mt-10 relative z-30 w-full mb-6">
        <SpeedTestWidget zip={cityClean} />
      </div>`;

content = content.replace(
  /\{\/\* The Mega Conversion Section: TL;DR \+ Editor's Pick \*\/\}/, 
  `${widgetHTML}\n\n      {/* The Mega Conversion Section: TL;DR + Editor's Pick */}`
);

// We also need to fix the margin-top of the Mega Conversion Section so they don't overlap awkwardly.
content = content.replace(
  /<div className="max-w-6xl mx-auto w-full px-4 -mt-10 relative z-20 mb-16">/,
  '<div className="max-w-6xl mx-auto w-full px-4 relative z-20 mb-16">'
);

fs.writeFileSync(file, content);