import { NextRequest, NextResponse } from "next/server"

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const ADMIN_SECRET = process.env.ADMIN_API_SECRET || ""

export async function GET(req: NextRequest) {
  const session = req.cookies.get("_admin_session")?.value
  if (session !== "true") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/custom/admin/returns`, {
      headers: {
        "x-admin-secret": ADMIN_SECRET,
      },
      next: { revalidate: 0 },
    })

    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Failed to fetch returns" },
      { status: 500 }
    )
  }
}
