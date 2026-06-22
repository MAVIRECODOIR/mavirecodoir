import { NextRequest, NextResponse } from "next/server";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || "";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, product_id, variant_id, product_title, variant_title } = body;

    if (!email || !product_id) {
      return NextResponse.json({ error: "Email and product_id are required" }, { status: 400 });
    }

    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/stock-interest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PUBLISHABLE_KEY,
      },
      body: JSON.stringify({ email, product_id, variant_id, product_title, variant_title }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return NextResponse.json(
        { error: err.message || "Failed to register interest" },
        { status: res.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[stock-interest] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
