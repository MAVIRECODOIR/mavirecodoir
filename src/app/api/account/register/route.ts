import { NextRequest, NextResponse } from "next/server";
import { codeStore } from "@/lib/code-store";
import {
  registerCustomer,
  loginCustomer,
  createCustomer,
  getCustomer,
} from "@/lib/medusa/api";
import { sendEmail } from "@/lib/email/send";
import { welcomeEmail } from "@/lib/email/templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, firstName, lastName, phone, password, acceptsMarketing } = body;

    if (!email || !code || !firstName || !lastName || !password) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
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

    // ── Step 1: Register auth identity (or detect existing) ──
    let regToken: string | undefined;
    let wasExisting = false;

    try {
      const reg = await registerCustomer(normalizedEmail, password);
      regToken = reg.token;
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message.toLowerCase() : "";
      if (
        message.includes("already exists") ||
        message.includes("already been taken")
      ) {
        wasExisting = true;
      } else {
        throw err;
      }
    }

    // ── Step 2: Get a token usable for customer creation ──
    // For a new registration we have `regToken` with empty actor_id.
    // For an existing auth identity, login to get a token (also empty actor_id if no customer linked yet).
    let customerToken = regToken;
    if (!customerToken) {
      const login = await loginCustomer(normalizedEmail, password);
      customerToken = login.token;
    }

    // ── Step 3: Create customer if not yet linked ──
    let customerId: string | undefined;

    // First check if a customer already exists for this auth identity
    try {
      const existing = await getCustomer(customerToken!);
      const c = existing.customer as any;
      if (c?.id) {
        customerId = c.id;
      }
    } catch {
      // No customer yet — create one using the registration/login token
    }

    if (!customerId) {
      const created = await createCustomer(
        {
          first_name: firstName,
          last_name: lastName,
          phone: phone || undefined,
          email: normalizedEmail,
        },
        customerToken!
      );
      const c = created.customer as any;
      customerId = c?.id;
    }

    // ── Step 4: Login to get a fresh JWT with actor_id populated ──
    const finalLogin = await loginCustomer(normalizedEmail, password);

    // ── Step 5: Add to Brevo newsletter if opted in ──
    if (acceptsMarketing) {
      const brevoUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"}/store/brevo/subscribe`;
      fetch(brevoUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, firstName, lastName }),
      }).catch(() => {}); // fire-and-forget
    }

    // ── Step 6: Send welcome email (fire-and-forget) ──
    if (!wasExisting) {
      sendEmail({
        to: normalizedEmail,
        subject: "Welcome to MAVIRE CODOIR",
        html: welcomeEmail({ firstName }),
      }).catch((err) => console.error("[welcome email] Failed:", err));
    }

    const res = NextResponse.json({
      success: true,
      customer: { id: customerId, email: normalizedEmail, firstName, lastName },
    });

    res.cookies.set("mavire_token", finalLogin.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return res;
  } catch (err) {
    console.error("[register] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
