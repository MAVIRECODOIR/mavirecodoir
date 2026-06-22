import { NextRequest, NextResponse } from "next/server";
import { loginCustomer } from "@/lib/medusa/api";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_API_KEY || "";

async function callMedusa(path: string, options: { method?: string; body?: unknown; token?: string } = {}) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "x-publishable-api-key": PUBLISHABLE_KEY,
  };
  if (options.token) headers["Authorization"] = `Bearer ${options.token}`;
  const res = await fetch(`${MEDUSA_BACKEND_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, body };
}

async function getOtpToken(email: string) {
  const res = await fetch(`${MEDUSA_BACKEND_URL}/custom/otp-login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const body = await res.json().catch(() => ({})) as { token?: string };
  return body.token;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Step 1: Login via Medusa standard auth
    const result = await loginCustomer(normalizedEmail, password);
    let token = result.token;

    // Step 2: Try to fetch customer; if missing, create and get fresh JWT
    const check = await callMedusa("/store/customers/me", { token });
    if (!check.ok) {
      const created = await callMedusa("/store/customers", {
        method: "POST",
        body: { email: normalizedEmail },
        token,
      });
      if (!created.ok) {
        return NextResponse.json(
          { error: "Failed to set up account. Please contact support." },
          { status: 500 }
        );
      }

      // Customer created → app_metadata.customer_id is now set. Get fresh JWT.
      const freshToken = await getOtpToken(normalizedEmail);
      if (!freshToken) {
        return NextResponse.json(
          { error: "Failed to sign in after account setup." },
          { status: 500 }
        );
      }
      token = freshToken;
    }

    // Step 3: Final verification
    const verify = await callMedusa("/store/customers/me", { token });
    if (!verify.ok) {
      return NextResponse.json(
        { error: "Failed to verify account." },
        { status: 500 }
      );
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set("mavire_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : "Invalid email or password";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
