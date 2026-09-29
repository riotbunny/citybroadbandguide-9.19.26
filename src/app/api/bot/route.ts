import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: 'Invalid zip code' }, { status: 400 });
  }

  try {
    // 1. Fetch Local Coverage
    const coverages = await prisma.coverage.findMany({
      where: { zip },
      include: {
        carrier: {
          include: {
            plans: {
              where: { isActive: true },
              orderBy: { price: 'asc' },
              take: 1
            }
          }
        }
      }
    });

    const localCarriers = coverages.filter(c => c.carrier.isActive).map(c => c.carrier);

    // 2. Fetch Nationwide Coverage (AT&T Air, Verizon 5G, T-Mobile)
    const nationwideCarriers = await prisma.carrier.findMany({
      where: { isNationwide: true, isActive: true },
      include: {
        plans: {
          where: { isActive: true },
          orderBy: { price: 'asc' },
          take: 1
        }
      }
    });

    // 3. Merge and deduplicate
    const allCarriersMap = new Map();
    
    localCarriers.forEach(carrier => allCarriersMap.set(carrier.id, carrier));
    // Nationwide carriers are added. If they were somehow already in the local array, this safely overwrites them.
    nationwideCarriers.forEach(carrier => allCarriersMap.set(carrier.id, carrier));

    const results = Array.from(allCarriersMap.values()).map(carrier => {
      const cheapestPlan = carrier.plans[0];
      return {
        id: carrier.id,
        name: carrier.name,
        isTopPick: carrier.isTopPick,
        affiliateUrl: carrier.affiliateUrl,
        phoneNumber: carrier.phoneNumber,
        startingPrice: cheapestPlan?.price || null,
        speed: cheapestPlan?.downloadSpeed || null,
      };
    }).sort((a, b) => {
      // Priority 1: Top Picks
      if (a.isTopPick && !b.isTopPick) return -1;
      if (!a.isTopPick && b.isTopPick) return 1;
      // Priority 2: Cheapest Price
      const priceA = a.startingPrice || 999;
      const priceB = b.startingPrice || 999;
      return priceA - priceB;
    });

    // Return whether we found local direct fiber/cable or just relying on nationwide 5G
    const hasLocal = coverages.length > 0;

    // Return the top 4 options to give a good mix of local and nationwide
    return NextResponse.json({ 
      results: results.slice(0, 4),
      hasLocal 
    });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}

