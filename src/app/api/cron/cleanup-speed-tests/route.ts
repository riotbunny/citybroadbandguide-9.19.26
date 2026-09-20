import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const dynamic = 'force-dynamic'; // Prevent caching of the cron

export async function GET(request: Request) {
  // Optional: Verify Vercel Cron Secret here to prevent unauthorized execution
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    // Calculate the date exactly 60 days ago
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    // Delete all speed tests older than 60 days to maintain 'Freshness' and save DB space
    const result = await prisma.speedTestResult.deleteMany({
      where: {
        createdAt: {
          lt: sixtyDaysAgo
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: `Deleted ${result.count} stale speed tests to optimize crawl freshness.`
    });
  } catch (error) {
    console.error('Speed test cleanup cron failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}