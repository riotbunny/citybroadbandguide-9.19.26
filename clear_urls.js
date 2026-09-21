const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Clearing all affiliate URLs from the database...');
  
  const result = await prisma.carrier.updateMany({
    data: {
      affiliateUrl: null
    }
  });

  console.log(`Successfully cleared URLs from ${result.count} carriers.`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
