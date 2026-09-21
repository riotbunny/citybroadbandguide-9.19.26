const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  const rawText = fs.readFileSync('raw.txt', 'utf-8');
  
  // The known carriers in the file, exactly matching the headers
  const carriers = [
    'CenturyLink',
    'Brightspeed',
    'Breezeline',
    'Astound',
    'Frontier',
    'Spectrum',
    'AT&T'
  ];

  let currentCarrier = null;
  const data = {};

  const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  for (const line of lines) {
    if (carriers.includes(line)) {
      currentCarrier = line;
      data[currentCarrier] = [];
      continue;
    }
    
    if (currentCarrier) {
      // It's a state/city line like "Washington: Seattle, Tacoma, ..."
      // Or "Arizona / New Mexico / West Texas: Phoenix area fringe likely minimal; Tucson area possible; ..."
      const parts = line.split(':');
      if (parts.length >= 2) {
        const cityListRaw = parts.slice(1).join(':'); // everything after the first colon
        
        // Split by comma or semicolon
        const rawCities = cityListRaw.split(/[,;]/);
        
        for (let rc of rawCities) {
          // Clean the city name from extra descriptors
          let city = rc.trim();
          city = city.replace(/fringe/gi, '')
                     .replace(/likely minimal/gi, '')
                     .replace(/area possible/gi, '')
                     .replace(/outer spots possible/gi, '')
                     .replace(/suburbs possible/gi, '')
                     .replace(/possible/gi, '')
                     .replace(/area/gi, '')
                     .replace(/metro/gi, '')
                     .replace(/border towns/gi, '')
                     .replace(/IN side/gi, '')
                     .replace(/KS/gi, '')
                     .replace(/MO/gi, '')
                     .replace(/AR/gi, '')
                     .replace(/IL/gi, '')
                     .replace(/IN/gi, '')
                     .replace(/OH/gi, '')
                     .replace(/MN/gi, '')
                     .replace(/NC/gi, '')
                     .replace(/\./g, '')
                     .replace(/[\/]/g, '')
                     .trim();
          
          if (city.length > 0) {
            data[currentCarrier].push(city);
          }
        }
      }
    }
  }

  let totalInserted = 0;

  for (const [carrierName, cities] of Object.entries(data)) {
    console.log(`\n============================`);
    console.log(`Processing Carrier: ${carrierName}`);
    
    const carrier = await prisma.carrier.findFirst({
      where: { name: { contains: carrierName, mode: 'insensitive' } }
    });

    if (!carrier) {
      console.log(`[!] Carrier '${carrierName}' not found in DB. Skipping...`);
      continue;
    }

    console.log(`Found DB Carrier: ${carrier.name} (ID: ${carrier.id})`);
    
    let carrierInserted = 0;

    // Deduplicate cities to reduce DB lookups
    const uniqueCities = [...new Set(cities)];

    for (const city of uniqueCities) {
      try {
        const locations = await prisma.location.findMany({
          where: {
            city: { equals: city, mode: 'insensitive' }
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
      } catch (err) {
        console.error(`Error querying city ${city}: ${err.message}`);
      }
    }
    
    totalInserted += carrierInserted;
    console.log(`-> Inserted ${carrierInserted} coverage zones for ${carrier.name}.`);
  }

  console.log(`\n============================`);
  console.log(`SUCCESS! Total coverage zones mapped: ${totalInserted}`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
