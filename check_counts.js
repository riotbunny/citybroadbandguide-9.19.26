const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const locCount = await prisma.location.count();
  const covCount = await prisma.coverage.count();
  console.log(`Locations in DB: ${locCount}`);
  console.log(`Coverages mapped: ${covCount}`);
  
  if (locCount > 0) {
    const sample = await prisma.location.findFirst();
    console.log(`Sample location: Zip ${sample.zip}, ${sample.city}, ${sample.state}`);
  }
}
check().catch(console.error).finally(() => prisma.$disconnect());