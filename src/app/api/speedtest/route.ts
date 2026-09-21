import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";



export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { zip, download, upload, latency } = body;
    
    // Fallback zip if none provided
    const safeZip = zip || '00000';

    await prisma.speedTestResult.create({
      data: {
        zip: safeZip,
        download,
        upload,
        latency
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Speed test save error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}