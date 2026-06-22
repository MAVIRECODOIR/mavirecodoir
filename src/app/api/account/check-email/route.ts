import { NextRequest, NextResponse } from "next/server";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const medusaRes = await fetch(`${MEDUSA_BACKEND_URL}/custom/check-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    let data: { exists?: boolean };
    try {
      data = await medusaRes.json() as { exists?: boolean };
    } catch {
      data = { exists: false };
    }

    return NextResponse.json({ exists: !!data.exists });
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to check email" },
      { status: 500 }
    );
  }
}
