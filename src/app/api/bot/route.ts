import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get('zip');

  if (!zip || zip.length !== 5) {
    return NextResponse.json({ error: 'Invalid zip code' }, { status: 400 });
  }

  try {
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

    if (coverages.length === 0) {
      return NextResponse.json({ results: [] });
    }

    // Map and sort: Top Picks first
    const results = coverages
      .filter(c => c.carrier.isActive)
      .map(c => {
        const carrier = c.carrier;
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
      })
      .sort((a, b) => {
        // Force Top Picks to the absolute top
        if (a.isTopPick && !b.isTopPick) return -1;
        if (!a.isTopPick && b.isTopPick) return 1;
        // Secondary sort by price if both are top picks or neither are
        const priceA = a.startingPrice || 999;
        const priceB = b.startingPrice || 999;
        return priceA - priceB;
      });

    // Return the top 3 options to keep the chat UI clean and focused
    return NextResponse.json({ results: results.slice(0, 3) });
  } catch (error) {
    console.error('Chatbot API Error:', error);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
}
