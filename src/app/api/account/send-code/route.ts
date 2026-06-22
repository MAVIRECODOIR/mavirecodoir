import { NextRequest, NextResponse } from "next/server";
import { codeStore } from "@/lib/code-store";
import { verificationEmail } from "@/lib/email/templates";
import { sendEmail } from "@/lib/email/send";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000;

    codeStore.set(normalizedEmail, { code, expires });

    if (process.env.RESEND_API_KEY) {
      const html = verificationEmail({ code });
      await sendEmail({
        to: normalizedEmail,
        subject: `${code} is your MAVIRE CODOIR verification code`,
        html,
      });
    } else {
      console.log(`[MAVIRE] Verification code for ${normalizedEmail}: ${code}`);
    }

    return NextResponse.json({
      success: true,
      ...(!process.env.RESEND_API_KEY && process.env.NODE_ENV === "development" ? { devCode: code } : {}),
    });
  } catch (err) {
    console.error("[send-code] Error:", err);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
