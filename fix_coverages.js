const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const STATE_MAP = {
  'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR', 'california': 'CA',
  'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE', 'florida': 'FL', 'georgia': 'GA',
  'hawaii': 'HI', 'idaho': 'ID', 'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA',
  'kansas': 'KS', 'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
  'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS', 'missouri': 'MO',
  'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV', 'new hampshire': 'NH', 'new jersey': 'NJ',
  'new mexico': 'NM', 'new york': 'NY', 'north carolina': 'NC', 'north dakota': 'ND', 'ohio': 'OH',
  'oklahoma': 'OK', 'oregon': 'OR', 'pennsylvania': 'PA', 'rhode island': 'RI', 'south carolina': 'SC',
  'south dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT', 'vermont': 'VT',
  'virginia': 'VA', 'washington': 'WA', 'west virginia': 'WV', 'wisconsin': 'WI', 'wyoming': 'WY'
};

function getStates(stateStr) {
  const parts = stateStr.split(/[\/\&]/).map(s => s.trim().toLowerCase());
  const matched = [];
  for (const part of parts) {
    let clean = part.replace(/east |west |north |south | area| fringe/gi, '').trim();
    
    // Explicit overrides for directionals that are real states
    if (part.includes('north carolina')) clean = 'north carolina';
    if (part.includes('south carolina')) clean = 'south carolina';
    if (part.includes('north dakota')) clean = 'north dakota';
    if (part.includes('south dakota')) clean = 'south dakota';
    if (part.includes('new mexico')) clean = 'new mexico';
    if (part.includes('new york')) clean = 'new york';
    if (part.includes('new hampshire')) clean = 'new hampshire';
    if (part.includes('new jersey')) clean = 'new jersey';
    if (part.includes('rhode island')) clean = 'rhode island';
    if (part.includes('west virginia')) clean = 'west virginia';

    if (STATE_MAP[clean]) {
      matched.push(STATE_MAP[clean]);
    }
  }
  return matched;
}

async function processFile(filename, carriersList) {
  if (!fs.existsSync(filename)) return {};
  
  const rawText = fs.readFileSync(filename, 'utf-8');
  let currentCarrier = null;
  const data = {};

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  for (const line of lines) {
    if (carriersList.includes(line)) {
      currentCarrier = line;
      if (!data[currentCarrier]) data[currentCarrier] = [];
      continue;
    }
    
    if (currentCarrier) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const stateRaw = parts[0];
        const states = getStates(stateRaw);
        
        if (states.length === 0) continue; // Skip if we couldn't parse the state

        const cityListRaw = parts.slice(1).join(':');
        const rawCities = cityListRaw.split(/[,;]/);
        
        for (let rc of rawCities) {
          let city = rc.trim();
          city = city.replace(/fringe/gi, '').replace(/likely minimal/gi, '')
                     .replace(/area possible/gi, '').replace(/outer spots possible/gi, '')
                     .replace(/suburbs possible/gi, '').replace(/possible/gi, '')
                     .replace(/area/gi, '').replace(/metro/gi, '').replace(/border towns/gi, '')
                     .replace(/IN side/gi, '').replace(/KS/gi, '').replace(/MO/gi, '')
                     .replace(/AR/gi, '').replace(/IL/gi, '').replace(/IN/gi, '')
                     .replace(/OH/gi, '').replace(/MN/gi, '').replace(/NC/gi, '')
                     .replace(/\./g, '').replace(/[\/]/g, '').trim();
          
          if (city.length > 0) {
            data[currentCarrier].push({ city, states });
          }
        }
      }
    }
  }
  return data;
}

async function run() {
  const allCarriers = ['CenturyLink', 'Brightspeed', 'Breezeline', 'Astound', 'Frontier', 'Spectrum', 'AT&T'];
  
  console.log("Parsing files...");
  const data1 = await processFile('raw.txt', allCarriers);
  const data2 = await processFile('raw2.txt', ['Spectrum', 'AT&T']); // extended overrides

  // Merge data2 into data1
  for (const c of ['Spectrum', 'AT&T']) {
    if (data2[c]) {
      data1[c] = data2[c]; // Override with the larger dataset
    }
  }

  for (const carrierName of allCarriers) {
    console.log(`\n============================`);
    console.log(`Processing Carrier: ${carrierName}`);
    
    const carrier = await prisma.carrier.findFirst({
      where: { name: { contains: carrierName, mode: 'insensitive' } }
    });

    if (!carrier) continue;
    
    console.log(`Found DB Carrier: ${carrier.name}. Deleting bad global coverages...`);
    
    // Nuke the existing bad coverages for this specific carrier
    await prisma.coverage.deleteMany({
      where: { carrierId: carrier.id }
    });
    
    console.log(`Injecting correct State-scoped coverages...`);
    
    let carrierInserted = 0;
    const items = data1[carrierName] || [];

    for (const item of items) {
      try {
        const locations = await prisma.location.findMany({
          where: {
            city: { equals: item.city, mode: 'insensitive' },
            state: { in: item.states } // STRCITLY SCOPE BY STATE!
          },
          select: { zip: true }
        });

        if (locations.length > 0) {
          const coverageData = locations.map(loc => ({
            carrierId: carrier.id,
            zip: loc.zip
          }));

          const res = await prisma.coverage.createMany({
            data: coverageData,
            skipDuplicates: true
          });
          
          carrierInserted += res.count;
        }
      } catch (err) {}
    }
    
    console.log(`-> Inserted ${carrierInserted} correct state-scoped coverage zones for ${carrier.name}.`);
  }

  console.log(`\nSUCCESS! Coverage maps have been fixed.`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
