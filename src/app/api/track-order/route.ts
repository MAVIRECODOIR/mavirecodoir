import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

// Simple in-memory rate limiter
const ipMap = new Map<string, { count: number; resetAt: number }>();
const MAX_REQUESTS = 5;
const WINDOW_MS = 60_000;

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipMap.get(ip);

  if (!entry || now > entry.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1 };
  }

  entry.count++;
  if (entry.count > MAX_REQUESTS) {
    return { allowed: false, remaining: 0 };
  }

  return { allowed: true, remaining: MAX_REQUESTS - entry.count };
}

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
             req.headers.get("x-real-ip") ||
             "unknown";

  const { allowed, remaining } = getRateLimitInfo(ip);
  const res = new NextResponse();

  res.headers.set("X-RateLimit-Remaining", String(remaining));
  res.headers.set("X-RateLimit-Limit", String(MAX_REQUESTS));

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: res.headers }
    );
  }

  const displayId = req.nextUrl.searchParams.get("display_id")
  const email = req.nextUrl.searchParams.get("email")

  if (!displayId || !email) {
    return NextResponse.json(
      { error: "display_id and email are required" },
      { status: 400 }
    )
  }

  try {
    const backendRes = await fetch(
      `${MEDUSA_BACKEND_URL}/custom/track-order?display_id=${encodeURIComponent(displayId)}&email=${encodeURIComponent(email)}`,
      { next: { revalidate: 0 } }
    )

    if (!backendRes.ok) {
      const body = await backendRes.json().catch(() => ({}))
      return NextResponse.json(
        { error: body.error || "Order not found" },
        { status: backendRes.status }
      )
    }

    const data = await backendRes.json()
    return NextResponse.json(data, { headers: res.headers })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to look up order" },
      { status: 500 }
    )
  }
}
