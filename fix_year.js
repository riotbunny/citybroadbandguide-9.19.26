const fs = require('fs');
const file = 'src/app/research/fastest-cities/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Make Metadata Dynamic
const metadataOld = `export const metadata = {
  title: 'Top 10 Cities with the Fastest Internet in 2026 | City Broadband Guide',
  description: 'Original data journalism reporting on the absolute fastest gigabit connectivity hubs in the United States based on FCC data and proprietary speed tests.',
};`;
const metadataNew = `export async function generateMetadata() {
  const currentYear = new Date().getFullYear();
  return {
    title: \`Top 10 Cities with the Fastest Internet in \${currentYear} | City Broadband Guide\`,
    description: 'Original data journalism reporting on the absolute fastest gigabit connectivity hubs in the United States based on FCC data and proprietary speed tests.',
  };
}`;
content = content.replace(metadataOld, metadataNew);

// 2. Inject currentYear into the main component
content = content.replace(
  /export default async function FastestCitiesReport\(\) \{/,
  "export default async function FastestCitiesReport() {\n  const currentYear = new Date().getFullYear();"
);

// 3. Make the badge dynamic and evergreen
content = content.replace(
  /Original Research &mdash; Fall 2026/,
  'Original Research &mdash; {currentYear}'
);

// 4. Make the table header dynamic and remove parentheses
content = content.replace(
  /Highest Recorded Residential Speeds \(2026\)/,
  'Highest Recorded Residential Speeds {currentYear}'
);

fs.writeFileSync(file, content);