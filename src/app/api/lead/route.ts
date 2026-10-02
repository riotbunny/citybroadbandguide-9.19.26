import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Send to Google Sheets from the server (bypasses browser CORS completely)
    const response = await fetch('https://script.google.com/macros/s/AKfycbykqvHQS1VzqB_WHTlO0aJbSr8hvMkgtMC0-1KEuWmLkxitC_H2D_sasdAEwhJnoNoI/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(body)
    });

    const result = await response.text();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('Lead submission error:', error);
    return NextResponse.json({ error: 'Failed to submit lead' }, { status: 500 });
  }
}
