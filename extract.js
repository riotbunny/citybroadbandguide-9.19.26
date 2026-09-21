const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function extract() {
  console.log("Extracting SQLite data...");
  const carriers = await prisma.carrier.findMany();
  const locations = await prisma.location.findMany();
  
  fs.writeFileSync('backup_carriers.json', JSON.stringify(carriers));
  fs.writeFileSync('backup_locations.json', JSON.stringify(locations));
  
  console.log(`Saved ${carriers.length} carriers and ${locations.length} locations to JSON backup.`);
}

extract().catch(console.error).finally(() => prisma.$disconnect());