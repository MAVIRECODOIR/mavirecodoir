import { NextRequest, NextResponse } from "next/server";
import { codeStore } from "@/lib/code-store";
import {
  changePassword,
  loginCustomer,
  registerCustomer,
} from "@/lib/medusa/api";

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

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
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password.length < 8 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters, with 1 uppercase letter and 1 number." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    const stored = codeStore.get(normalizedEmail);
    if (!stored) {
      return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 });
    }
    if (Date.now() > stored.expires) {
      codeStore.delete(normalizedEmail);
      return NextResponse.json({ error: "Verification code has expired. Please request a new one." }, { status: 400 });
    }
    if (stored.code !== code.trim()) {
      return NextResponse.json({ error: "Invalid verification code." }, { status: 400 });
    }

    codeStore.delete(normalizedEmail);

    const otpToken = await getOtpToken(normalizedEmail);
    if (!otpToken) {
      return NextResponse.json({ error: "Failed to verify identity." }, { status: 500 });
    }

    try {
      await changePassword(password, otpToken);
    } catch {
      try {
        await registerCustomer(normalizedEmail, password);
      } catch {
        return NextResponse.json(
          { error: "Failed to reset password. Please try again later." },
          { status: 500 }
        );
      }
    }

    const login = await loginCustomer(normalizedEmail, password);

    const res = NextResponse.json({ success: true });
    res.cookies.set("mavire_token", login.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err) {
    console.error("[reset-password] Error:", err);
    const message = err instanceof Error ? err.message : "Failed to reset password";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
