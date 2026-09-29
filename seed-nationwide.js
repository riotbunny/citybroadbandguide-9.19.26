const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const nationwideCarriers = [
    {
      name: "T-Mobile 5G Home",
      slug: "tmobile-5g-home",
      isNationwide: true,
      isTopPick: true,
      has5G: true,
      brandColor: "#e20074",
      affiliateUrl: "https://t-mobile.com",
      phoneNumber: "1-800-TMOBILE",
      plans: [{ name: "5G Home Internet", price: 50.0, downloadSpeed: 245 }]
    },
    {
      name: "Verizon 5G Home",
      slug: "verizon-5g-home",
      isNationwide: true,
      isTopPick: true,
      has5G: true,
      brandColor: "#cd040b",
      affiliateUrl: "https://verizon.com",
      phoneNumber: "1-800-VERIZON",
      plans: [{ name: "5G Home Internet", price: 50.0, downloadSpeed: 300 }]
    },
    {
      name: "AT&T Internet Air",
      slug: "att-internet-air",
      isNationwide: true,
      isTopPick: false,
      has5G: true,
      brandColor: "#0057b8",
      affiliateUrl: "https://att.com",
      phoneNumber: "1-800-ATT-2020",
      plans: [{ name: "Internet Air", price: 60.0, downloadSpeed: 225 }]
    }
  ];

  for (const c of nationwideCarriers) {
    const carrier = await prisma.carrier.upsert({
      where: { slug: c.slug },
      update: { 
        isNationwide: true, 
        isTopPick: c.isTopPick, 
        has5G: true,
        affiliateUrl: c.affiliateUrl,
        phoneNumber: c.phoneNumber
      },
      create: {
        name: c.name,
        slug: c.slug,
        isNationwide: true,
        isTopPick: c.isTopPick,
        has5G: true,
        brandColor: c.brandColor,
        affiliateUrl: c.affiliateUrl,
        phoneNumber: c.phoneNumber
      }
    });

    const existingPlans = await prisma.plan.findMany({ where: { carrierId: carrier.id } });
    if (existingPlans.length === 0) {
      await prisma.plan.create({
        data: {
          carrierId: carrier.id,
          name: c.plans[0].name,
          price: c.plans[0].price,
          downloadSpeed: c.plans[0].downloadSpeed
        }
      });
      console.log(`Created plan for ${carrier.name}`);
    }
  }
  console.log('Successfully seeded AT&T Internet Air, Verizon 5G, and T-Mobile 5G into the database!');
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
