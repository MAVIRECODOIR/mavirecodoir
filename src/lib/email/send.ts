import { Resend } from "resend";

const BRAND_NAME = "MAVIRE CODOIR";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    _resend = new Resend(key);
  }
  return _resend;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Send an email via Resend with MAVIRE CODOIR branding.
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@mavirecodoir.com";

  const { data, error } = await getResend().emails.send({
    from: `${BRAND_NAME} <${fromEmail}>`,
    to: [to],
    subject,
    html,
  });

  if (error) {
    console.error("[resend] Failed to send email:", error);
    throw new Error("Failed to send email");
  }

  return data;
}
