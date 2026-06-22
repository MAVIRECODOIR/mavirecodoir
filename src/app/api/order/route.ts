import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { order_id, frontend_url } = body

    if (!order_id) {
      return NextResponse.json({ error: "order_id is required" }, { status: 400 })
    }

    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/custom/order/${encodeURIComponent(order_id)}/generate-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frontend_url }),
        next: { revalidate: 0 },
      }
    )

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to generate token" },
      { status: 500 }
    )
  }
}
