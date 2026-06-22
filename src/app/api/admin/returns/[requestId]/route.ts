import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const ADMIN_SECRET = process.env.ADMIN_API_SECRET || ""

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ requestId: string }> }
) {
  const session = req.cookies.get("_admin_session")?.value
  if (session !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { requestId } = await params
  const { action, order_id } = await req.json()

  if (!requestId || !action) {
    return NextResponse.json({ error: "requestId and action required" }, { status: 400 })
  }

  try {
    const url = new URL(`${MEDUSA_BACKEND_URL}/custom/admin/returns/${encodeURIComponent(requestId)}`)
    if (order_id) url.searchParams.set("order_id", order_id)

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-secret": ADMIN_SECRET,
      },
      body: JSON.stringify({ action }),
      next: { revalidate: 0 },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to process return" },
      { status: 500 }
    )
  }
}
