import { NextRequest, NextResponse } from "next/server";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, firstName, lastName } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/brevo/subscribe`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, firstName, lastName }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.error || "Failed to subscribe" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[newsletter subscribe] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
