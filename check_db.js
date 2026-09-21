const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const count = await prisma.carrier.count();
  const carriers = await prisma.carrier.findMany({ select: { name: true }});
  console.log(`Total Carriers: ${count}`);
  console.log(carriers.map(c => c.name).join(', '));
}
check().catch(console.error).finally(() => prisma.$disconnect());