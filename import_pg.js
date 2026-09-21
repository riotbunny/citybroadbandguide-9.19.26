const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function importData() {
  console.log("Restoring data to Neon Postgres...");
  
  const carriers = JSON.parse(fs.readFileSync('backup_carriers.json', 'utf8'));
  const locations = JSON.parse(fs.readFileSync('backup_locations.json', 'utf8'));
  
  // We can't use createMany easily if IDs need to be preserved without caring about conflicts, but wait, Neon is completely empty.
  console.log(`Inserting ${carriers.length} carriers...`);
  if (carriers.length > 0) {
    await prisma.carrier.createMany({
      data: carriers,
      skipDuplicates: true
    });
  }
  
  console.log(`Inserting ${locations.length} locations... this might take a minute...`);
  if (locations.length > 0) {
    // SQLite allows huge inserts, Neon Postgres might have a payload limit for 42k records at once.
    // Chunk the locations into batches of 5000.
    const chunkSize = 5000;
    for (let i = 0; i < locations.length; i += chunkSize) {
      const chunk = locations.slice(i, i + chunkSize);
      await prisma.location.createMany({
        data: chunk,
        skipDuplicates: true
      });
      console.log(`Inserted chunk ${i / chunkSize + 1} of ${Math.ceil(locations.length / chunkSize)}`);
    }
  }
  
  console.log("Data successfully migrated to Postgres!");
}

importData().catch(console.error).finally(() => prisma.$disconnect());