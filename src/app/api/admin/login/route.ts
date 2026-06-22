import { NextRequest, NextResponse } from "next/server"

const ADMIN_SECRET = process.env.ADMIN_API_SECRET || ""

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 })
  }

  const panelPassword = process.env.ADMIN_PANEL_PASSWORD || "admin"
  if (password !== panelPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  // Set admin session cookie (just indicates they're authenticated)
  const response = NextResponse.json({ ok: true })
  response.cookies.set("_admin_session", "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 4, // 4 hours
  })
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set("_admin_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  })
  return response
}
