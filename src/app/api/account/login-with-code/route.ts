import { NextRequest, NextResponse } from "next/server";
import { codeStore } from "@/lib/code-store";

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
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and verification code are required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const stored = codeStore.get(normalizedEmail);
    if (!stored) {
      return NextResponse.json(
        { error: "No verification code found. Please request a new one." },
        { status: 400 }
      );
    }
    if (Date.now() > stored.expires) {
      codeStore.delete(normalizedEmail);
      return NextResponse.json(
        { error: "Verification code has expired. Please request a new one." },
        { status: 400 }
      );
    }
    if (stored.code !== code.trim()) {
      return NextResponse.json(
        { error: "Invalid verification code. Please try again." },
        { status: 400 }
      );
    }

    codeStore.delete(normalizedEmail);

    // Step 1: Get OTP token (may have empty actor_id if no customer linked)
    let token = await getOtpToken(normalizedEmail);
    if (!token) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      );
    }

    // Step 2: Check if customer exists; if not, create one
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

      // Step 3: Customer was just created → app_metadata.customer_id is now set.
      // Get a fresh JWT with proper actor_id.
      const freshToken = await getOtpToken(normalizedEmail);
      if (!freshToken) {
        return NextResponse.json(
          { error: "Failed to sign in after account setup." },
          { status: 500 }
        );
      }
      token = freshToken;
    }

    // Step 4: Final verification
    const verify = await callMedusa("/store/customers/me", { token });
    if (!verify.ok) {
      return NextResponse.json(
        { error: "Failed to verify account. Please sign in with password." },
        { status: 500 }
      );
    }

    const response = NextResponse.json({ success: true });

    response.cookies.set("mavire_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return response;
  } catch (err) {
    console.error("[login-with-code] Error:", err);
    return NextResponse.json(
      { error: "Failed to sign in" },
      { status: 500 }
    );
  }
}
