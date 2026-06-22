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
    const url = `${MEDUSA_BACKEND_URL}/custom/order/${encodeURIComponent(id)}${token ? `?token=${encodeURIComponent(token)}` : ""}`

    const cookies = req.headers.get("cookie") || ""
    const mavireToken = cookies.split(";").find(c => c.trim().startsWith("mavire_token="))?.split("=").slice(1).join("=") || ""

    const res = await fetch(url, {
      headers: {
        cookie: cookies,
        ...(mavireToken ? { authorization: `Bearer ${mavireToken}` } : {}),
      },
      next: { revalidate: 0 },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to load order" },
      { status: 500 }
    )
  }
}
