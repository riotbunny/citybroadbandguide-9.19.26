const fs = require('fs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function parseSpeed(str) {
  if (!str || str.trim() === '') return null;
  // Convert 'Gbps' or 'Gig' to 1000s of Mbps
  const gbMatch = str.match(/([\d\.]+)\s*(?:Gbps|Gig)/i);
  if (gbMatch) {
    return Math.round(parseFloat(gbMatch[1]) * 1000);
  }
  // Try Mbps
  const mbMatch = str.match(/([\d\.]+)\s*Mbps/i);
  if (mbMatch) {
    return Math.round(parseFloat(mbMatch[1]));
  }
  return null;
}

function parsePrice(str) {
  if (!str || str.trim() === '') return { price: 0, postPromoPrice: null };
  // Find all dollar amounts
  const matches = [...str.matchAll(/\$(\d+(?:\.\d+)?)/g)];
  if (matches.length === 0) return { price: 0, postPromoPrice: null };
  
  const price1 = parseFloat(matches[0][1]);
  let price2 = null;
  
  // If there's a second dollar amount (like "thereafter" or "everyday" or "standard")
  if (matches.length > 1) {
    // If it mentions "everyday", "standard", "thereafter", use the second as postPromo
    if (/everyday|standard|thereafter/i.test(str)) {
      price2 = parseFloat(matches[1][1]);
    }
  }
  
  return { price: price1, postPromoPrice: price2 };
}

async function run() {
  const content = fs.readFileSync('plans.csv', 'utf-8');
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  
  // Skip header
  lines.shift();

  let inserted = 0;
  
  for (const line of lines) {
    // "Carrier","Plan Name",...
    // Strip leading and trailing quotes, then split by ","
    let cleanLine = line;
    if (cleanLine.startsWith('"')) cleanLine = cleanLine.substring(1);
    if (cleanLine.endsWith('"')) cleanLine = cleanLine.substring(0, cleanLine.length - 1);
    
    const parts = cleanLine.split('","');
    if (parts.length < 8) continue;
    
    const carrierName = parts[0];
    const planName = parts[1];
    const description = parts[2] + ' | Price terms: ' + parts[6];
    const rawDownload = parts[3];
    const rawUpload = parts[4];
    const rawPrice = parts[6];
    const sourceUrl = parts[7];
    
    const downloadSpeed = parseSpeed(rawDownload);
    const uploadSpeed = parseSpeed(rawUpload);
    const { price, postPromoPrice } = parsePrice(rawPrice);
    
    // Find or create carrier
    let carrier = await prisma.carrier.findFirst({
      where: { name: { contains: carrierName, mode: 'insensitive' } }
    });
    
    if (!carrier) {
      // Create it so the plan doesn't get orphaned
      carrier = await prisma.carrier.create({
        data: {
          name: carrierName,
          slug: carrierName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          affiliateUrl: sourceUrl
        }
      });
      console.log(`Created missing carrier: ${carrierName}`);
    } else {
      // Update affiliate URL if missing
      if (!carrier.affiliateUrl && sourceUrl) {
        await prisma.carrier.update({
          where: { id: carrier.id },
          data: { affiliateUrl: sourceUrl }
        });
      }
    }
    
    // Check if plan exists
    const existingPlan = await prisma.plan.findFirst({
      where: { carrierId: carrier.id, name: planName }
    });
    
    if (!existingPlan) {
      await prisma.plan.create({
        data: {
          carrierId: carrier.id,
          name: planName,
          description: description,
          downloadSpeed: downloadSpeed,
          uploadSpeed: uploadSpeed,
          price: price,
          postPromoPrice: postPromoPrice
        }
      });
      inserted++;
      console.log(`Added Plan: ${planName} for ${carrierName} ($${price}/mo, ${downloadSpeed}Mbps)`);
    } else {
      console.log(`Skipped existing plan: ${planName}`);
    }
  }
  
  console.log(`\nSuccess! Inserted ${inserted} new pricing plans into the cloud database.`);
}

run().catch(console.error).finally(() => prisma.$disconnect());
