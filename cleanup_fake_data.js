const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanup() {
  console.log("Wiping all synthetic coverage data to ensure data integrity...");
  const result = await prisma.coverage.deleteMany({});
  console.log(`Deleted ${result.count} fake coverage mappings. Database is clean.`);
}

cleanup().catch(console.error).finally(() => prisma.$disconnect());