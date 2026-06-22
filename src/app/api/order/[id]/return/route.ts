import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = req.nextUrl.searchParams.get("token")
  const body = await req.json()

  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
  }

  try {
    const url = `${MEDUSA_BACKEND_URL}/custom/order/${encodeURIComponent(id)}/return${token ? `?token=${encodeURIComponent(token)}` : ""}`

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: JSON.stringify(body),
      next: { revalidate: 0 },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to submit return request" },
      { status: 500 }
    )
  }
}
