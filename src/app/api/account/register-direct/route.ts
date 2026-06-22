import { NextRequest, NextResponse } from "next/server";
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
    const { email, password, firstName, lastName, acceptsMarketing } = body;

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    let regToken: string | undefined;
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
        try {
          const login = await loginCustomer(normalizedEmail, password);
          const res = NextResponse.json({ success: true, existingAccount: true });
          res.cookies.set("mavire_token", login.token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 30,
          });
          return res;
        } catch {
          return NextResponse.json(
            { error: "An account with this email already exists. Please log in instead." },
            { status: 409 }
          );
        }
      }
      throw err;
    }

    let customerToken = regToken;
    let customerId: string | undefined;

    try {
      const existing = await getCustomer(customerToken!);
      const c = existing.customer as any;
      if (c?.id) customerId = c.id;
    } catch {}

    if (!customerId) {
      const created = await createCustomer(
        {
          first_name: firstName,
          last_name: lastName,
          email: normalizedEmail,
        },
        customerToken!
      );
      const c = created.customer as any;
      customerId = c?.id;
    }

    const finalLogin = await loginCustomer(normalizedEmail, password);

    sendEmail({
      to: normalizedEmail,
      subject: "Welcome to MAVIRE CODOIR",
      html: welcomeEmail({ firstName }),
    }).catch(() => {});

    const res = NextResponse.json({
      success: true,
      customer: { id: customerId, email: normalizedEmail },
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
    console.error("[register-direct] Error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to create account";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
