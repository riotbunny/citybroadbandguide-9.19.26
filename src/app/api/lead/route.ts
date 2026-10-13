import { NextResponse } from "next/server";

const DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbyzannOBD2M1g1U4QBBLQLTRgj6RpzfA66KhJMnDFnlaG-KV0qE1EZb1u2AduI_7obV/exec";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const webhookUrl =
      process.env.GOOGLE_SHEETS_WEBHOOK_URL || DEFAULT_GOOGLE_SHEETS_WEBHOOK_URL;

    const lead = {
      ...body,
      dob: body.dateOfBirth || body.dob || "",
      submittedAt: body.submittedAt || new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(lead),
    });

    if (!response.ok) {
      throw new Error(`Google Sheets webhook failed with status ${response.status}`);
    }

    const result = await response.text();
    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Failed to submit lead" }, { status: 500 });
  }
}
