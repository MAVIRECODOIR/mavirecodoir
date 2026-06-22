import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = req.nextUrl.searchParams.get("token")

  if (!id) {
    return NextResponse.json({ error: "Order ID is required" }, { status: 400 })
  }

  try {
    const url = `${MEDUSA_BACKEND_URL}/custom/order/${encodeURIComponent(id)}/return-info${token ? `?token=${encodeURIComponent(token)}` : ""}`

    const res = await fetch(url, {
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      next: { revalidate: 0 },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load return info" },
      { status: 500 }
    )
  }
}
