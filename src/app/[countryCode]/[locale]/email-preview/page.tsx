"use client";

import { useState } from "react";

const LOGO_URL =
  "https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp";
const BRAND = "MAVIRE CODOIR";
const SITE = "https://mavirecodoir.com";
const YEAR = new Date().getFullYear();

/* ─── Shared pieces ─── */
const COLORS = {
  black: "#000000",
  white: "#ffffff",
  bg: "#f7f7f7",
  border: "#e5e5e5",
  textPrimary: "#000000",
  textSecondary: "#666666",
  textMuted: "#999999",
  textFaint: "#bbbbbb",
};

function header() {
  return `<tr>
    <td style="padding:32px 40px 24px;text-align:center;border-bottom:1px solid ${COLORS.border};">
      <a href="${SITE}" target="_blank" style="text-decoration:none;">
        <img src="${LOGO_URL}" alt="${BRAND}" style="max-height:28px;width:auto;" />
      </a>
    </td>
  </tr>`;
}

function footer() {
  return `<tr>
    <td style="padding:24px 40px;border-top:1px solid ${COLORS.border};text-align:center;">
      <p style="margin:0 0 8px;font-size:11px;color:${COLORS.textMuted};letter-spacing:0.04em;">
        <a href="${SITE}" style="color:${COLORS.textMuted};text-decoration:none;">${BRAND}</a>
      </p>
      <p style="margin:0;font-size:10px;color:${COLORS.textFaint};letter-spacing:0.05em;">
        &copy; ${YEAR} ${BRAND}. All rights reserved.
      </p>
      <p style="margin:8px 0 0;font-size:10px;color:${COLORS.textFaint};">
        <a href="${SITE}/privacy" style="color:${COLORS.textFaint};text-decoration:underline;">Privacy Policy</a>
        &nbsp;&middot;&nbsp;
        <a href="${SITE}/terms" style="color:${COLORS.textFaint};text-decoration:underline;">Terms &amp; Conditions</a>
        &nbsp;&middot;&nbsp;
        <a href="${SITE}/contact" style="color:${COLORS.textFaint};text-decoration:underline;">Contact Us</a>
      </p>
    </td>
  </tr>`;
}

function wrap(body: string) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>${BRAND}</title></head>
<body style="margin:0;padding:0;background-color:${COLORS.bg};font-family:Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.bg};padding:40px 0;">
<tr><td align="center">
<table role="presentation" width="560" cellpadding="0" cellspacing="0" style="background-color:${COLORS.white};max-width:560px;width:100%;">
${header()}${body}${footer()}
</table></td></tr></table></body></html>`;
}

/* ─── Style tokens ─── */
const S = {
  bodyCell: `padding:40px 40px 32px;`,
  h2: `margin:0 0 16px;font-size:20px;font-weight:500;color:${COLORS.textPrimary};letter-spacing:0.02em;`,
  p: `margin:0 0 16px;font-size:13px;line-height:1.7;color:${COLORS.textSecondary};`,
  muted: `margin:0;font-size:12px;color:${COLORS.textMuted};line-height:1.6;`,
  button: `display:inline-block;background-color:${COLORS.black};color:${COLORS.white};text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:14px 32px;`,
  codeBox: `background-color:${COLORS.bg};border:1px solid ${COLORS.border};padding:20px;text-align:center;margin:0 0 24px;`,
  code: `font-size:32px;font-weight:600;letter-spacing:0.3em;color:${COLORS.black};font-family:monospace;`,
  divider: `border:none;border-top:1px solid ${COLORS.border};margin:24px 0;`,
  tdLabel: `padding:10px 0;font-size:12px;color:${COLORS.textMuted};letter-spacing:0.04em;text-transform:uppercase;vertical-align:top;width:140px;`,
  tdValue: `padding:10px 0;font-size:13px;color:${COLORS.textPrimary};vertical-align:top;`,
};

/* ─── Template definitions ─── */
interface Template {
  id: string;
  name: string;
  category: string;
  subject: string;
  html: string;
}

const templates: Template[] = [
  {
    id: "verification",
    name: "Verification Code",
    category: "Auth",
    subject: "847291 is your MAVIRE CODOIR verification code",
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Your verification code</h2>
      <p style="${S.p}">Enter the following code to verify your email address and continue with your account.</p>
      <div style="${S.codeBox}"><span style="${S.code}">847291</span></div>
      <p style="${S.muted}">This code expires in 10 minutes.</p>
      <p style="margin:4px 0 0;${S.muted}">If you did not request this code, you can safely ignore this email.</p>
    </td></tr>`),
  },
  {
    id: "welcome",
    name: "Welcome",
    category: "Auth",
    subject: `Welcome to ${BRAND}`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Welcome to ${BRAND}</h2>
      <p style="${S.p}">Dear Alexandra,</p>
      <p style="${S.p}">Thank you for creating your ${BRAND} account. You now have access to a world of refined craftsmanship and timeless design.</p>
      <p style="${S.p}">With your account you can:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">&bull;&nbsp;&nbsp;Track your orders and returns</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">&bull;&nbsp;&nbsp;Save items to your wishlist</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">&bull;&nbsp;&nbsp;Book private appointments</td></tr>
        <tr><td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">&bull;&nbsp;&nbsp;Receive tailored assistance from our Client Service</td></tr>
      </table>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/client/my-account" style="${S.button}">View Your Account</a></div>
      <p style="${S.muted}">If you have any questions, our Client Service team is always here to help.</p>
    </td></tr>`),
  },
  {
    id: "password-reset",
    name: "Password Reset",
    category: "Auth",
    subject: `Reset your ${BRAND} password`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Reset your password</h2>
      <p style="${S.p}">We received a request to reset the password for your ${BRAND} account.</p>
      <p style="${S.p}">Click the button below to choose a new password. This link will expire in 30 minutes.</p>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/client/reset?token=example" style="${S.button}">Reset Password</a></div>
      <p style="${S.muted}">If you did not request a password reset, please ignore this email. Your password will remain unchanged.</p>
      <p style="margin:8px 0 0;${S.muted}">For security, this link can only be used once.</p>
    </td></tr>`),
  },
  {
    id: "order-confirmation",
    name: "Order Confirmation",
    category: "Orders",
    subject: `${BRAND} — Order #MC-10042 Confirmed`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Order confirmed</h2>
      <p style="${S.p}">Dear Alexandra, thank you for your order. We are pleased to confirm that your order has been received and is being prepared.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="${S.tdLabel}">Order</td><td style="${S.tdValue}">#MC-10042</td></tr>
        <tr><td style="${S.tdLabel}">Date</td><td style="${S.tdValue}">18 February 2026</td></tr>
        <tr><td style="${S.tdLabel}">Delivery to</td><td style="${S.tdValue}">123 Bond Street, London W1S 4EX</td></tr>
      </table>
      <hr style="${S.divider}" />
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="padding:16px 0;border-bottom:1px solid ${COLORS.border};vertical-align:top;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:top;"><p style="margin:0 0 4px;font-size:13px;font-weight:500;color:${COLORS.textPrimary};">Tailored Wool Overcoat</p><p style="margin:0 0 4px;font-size:12px;color:${COLORS.textMuted};">Black / Size 50</p><p style="margin:0;font-size:12px;color:${COLORS.textMuted};">Qty: 1</p></td>
            <td style="vertical-align:top;text-align:right;white-space:nowrap;"><p style="margin:0;font-size:13px;font-weight:500;color:${COLORS.textPrimary};">£2,450.00</p></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:16px 0;border-bottom:1px solid ${COLORS.border};vertical-align:top;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="vertical-align:top;"><p style="margin:0 0 4px;font-size:13px;font-weight:500;color:${COLORS.textPrimary};">Leather Card Holder</p><p style="margin:0 0 4px;font-size:12px;color:${COLORS.textMuted};">Cognac</p><p style="margin:0;font-size:12px;color:${COLORS.textMuted};">Qty: 1</p></td>
            <td style="vertical-align:top;text-align:right;white-space:nowrap;"><p style="margin:0;font-size:13px;font-weight:500;color:${COLORS.textPrimary};">£195.00</p></td>
          </tr></table>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 24px;">
        <tr><td style="padding:6px 0;font-size:13px;color:${COLORS.textSecondary};">Subtotal</td><td style="padding:6px 0;font-size:13px;color:${COLORS.textPrimary};text-align:right;">£2,645.00</td></tr>
        <tr><td style="padding:6px 0;font-size:13px;color:${COLORS.textSecondary};">Shipping</td><td style="padding:6px 0;font-size:13px;color:${COLORS.textPrimary};text-align:right;">Complimentary</td></tr>
        <tr><td style="padding:12px 0 0;font-size:14px;font-weight:600;color:${COLORS.textPrimary};border-top:1px solid ${COLORS.border};">Total</td><td style="padding:12px 0 0;font-size:14px;font-weight:600;color:${COLORS.textPrimary};text-align:right;border-top:1px solid ${COLORS.border};">£2,645.00</td></tr>
      </table>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/client/my-account" style="${S.button}">View Order</a></div>
      <p style="${S.muted}">You will receive a shipping confirmation once your order has been dispatched.</p>
    </td></tr>`),
  },
  {
    id: "order-shipped",
    name: "Order Shipped",
    category: "Orders",
    subject: `${BRAND} — Order #MC-10042 Shipped`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Your order is on its way</h2>
      <p style="${S.p}">Dear Alexandra, we are pleased to let you know that your order #MC-10042 has been dispatched.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="${S.tdLabel}">Order</td><td style="${S.tdValue}">#MC-10042</td></tr>
        <tr><td style="${S.tdLabel}">Carrier</td><td style="${S.tdValue}">DHL Express</td></tr>
        <tr><td style="${S.tdLabel}">Tracking</td><td style="${S.tdValue}">1Z999AA10123456784</td></tr>
        <tr><td style="${S.tdLabel}">Est. Delivery</td><td style="${S.tdValue}">20 February 2026</td></tr>
      </table>
      <div style="text-align:center;margin:0 0 24px;"><a href="https://www.dhl.com/track" style="${S.button}">Track Your Order</a></div>
      <p style="${S.muted}">Your order has been carefully packaged with ${BRAND} signature presentation. We will notify you once it has been delivered.</p>
    </td></tr>`),
  },
  {
    id: "order-delivered",
    name: "Order Delivered",
    category: "Orders",
    subject: `${BRAND} — Order #MC-10042 Delivered`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Your order has been delivered</h2>
      <p style="${S.p}">Dear Alexandra, your order #MC-10042 has been delivered. We hope you are delighted with your ${BRAND} pieces.</p>
      <p style="${S.p}">Should you require any assistance with your purchase, our Client Service team is at your disposal.</p>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/client/my-account" style="${S.button}">View Order</a></div>
      <p style="${S.muted}">We would love to hear about your experience. If you have any feedback, please do not hesitate to contact us.</p>
    </td></tr>`),
  },
  {
    id: "order-cancelled",
    name: "Order Cancelled",
    category: "Orders",
    subject: `${BRAND} — Order #MC-10042 Cancelled`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Order cancelled</h2>
      <p style="${S.p}">Dear Alexandra, your order #MC-10042 has been cancelled as requested.</p>
      <p style="${S.p}">If a payment was made, your refund will be processed within 5–10 business days depending on your payment provider.</p>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}" style="${S.button}">Continue Shopping</a></div>
      <p style="${S.muted}">If you did not request this cancellation or have any questions, please contact our Client Service team immediately.</p>
    </td></tr>`),
  },
  {
    id: "profile-updated",
    name: "Profile Updated",
    category: "Account",
    subject: `${BRAND} — Your profile has been updated`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Profile updated</h2>
      <p style="${S.p}">Dear Alexandra, your ${BRAND} account details have been updated successfully.</p>
      <p style="margin:0 0 8px;font-size:13px;font-weight:500;color:#000000;">The following was changed:</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="padding:4px 0;font-size:13px;color:#666666;line-height:1.7;">&bull;&nbsp;&nbsp;Email address</td></tr>
        <tr><td style="padding:4px 0;font-size:13px;color:#666666;line-height:1.7;">&bull;&nbsp;&nbsp;Phone number</td></tr>
      </table>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/client/my-account" style="${S.button}">View Your Profile</a></div>
      <p style="${S.muted}">If you did not make these changes, please contact our Client Service team immediately to secure your account.</p>
    </td></tr>`),
  },
  {
    id: "newsletter-welcome",
    name: "Newsletter Welcome",
    category: "Account",
    subject: `Welcome to the ${BRAND} world`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Welcome to the ${BRAND} world</h2>
      <p style="${S.p}">Thank you for subscribing. You will now be among the first to discover new collections, exclusive events, and personalised recommendations from ${BRAND}.</p>
      <p style="${S.p}">We look forward to sharing our world of refined craftsmanship and timeless design with you.</p>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/new-arrivals" style="${S.button}">Explore New Arrivals</a></div>
      <p style="${S.muted}">You can unsubscribe at any time by updating your preferences in your account settings or by contacting our Client Service team.</p>
    </td></tr>`),
  },
  {
    id: "appointment-confirmation",
    name: "Appointment Confirmation",
    category: "Appointments",
    subject: `${BRAND} — Appointment Confirmed`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Appointment confirmed</h2>
      <p style="${S.p}">Dear Alexandra, your private appointment at ${BRAND} has been confirmed.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="${S.tdLabel}">Type</td><td style="${S.tdValue}">Personal Shopping</td></tr>
        <tr><td style="${S.tdLabel}">Date</td><td style="${S.tdValue}">25 February 2026</td></tr>
        <tr><td style="${S.tdLabel}">Time</td><td style="${S.tdValue}">2:00 PM</td></tr>
        <tr><td style="${S.tdLabel}">Location</td><td style="${S.tdValue}">MAVIRE CODOIR, Bond Street, London</td></tr>
      </table>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/client/my-account" style="${S.button}">Manage Appointment</a></div>
      <p style="${S.muted}">If you need to reschedule or cancel, please contact our Client Service team at least 24 hours in advance.</p>
    </td></tr>`),
  },
  {
    id: "appointment-reminder",
    name: "Appointment Reminder",
    category: "Appointments",
    subject: `${BRAND} — Appointment Reminder`,
    html: wrap(`<tr><td style="${S.bodyCell}">
      <h2 style="${S.h2}">Appointment reminder</h2>
      <p style="${S.p}">Dear Alexandra, this is a friendly reminder of your upcoming appointment at ${BRAND}.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
        <tr><td style="${S.tdLabel}">Type</td><td style="${S.tdValue}">Personal Shopping</td></tr>
        <tr><td style="${S.tdLabel}">Date</td><td style="${S.tdValue}">25 February 2026</td></tr>
        <tr><td style="${S.tdLabel}">Time</td><td style="${S.tdValue}">2:00 PM</td></tr>
        <tr><td style="${S.tdLabel}">Location</td><td style="${S.tdValue}">MAVIRE CODOIR, Bond Street, London</td></tr>
      </table>
      <div style="text-align:center;margin:0 0 24px;"><a href="${SITE}/client/my-account" style="${S.button}">Manage Appointment</a></div>
      <p style="${S.muted}">If you need to reschedule or cancel, please contact our Client Service team at least 24 hours in advance.</p>
    </td></tr>`),
  },
];

/* ─── Categories ─── */
const categories = ["All", "Auth", "Orders", "Account", "Appointments"];

export default function EmailPreviewPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeTemplate, setActiveTemplate] = useState(templates[0]);

  const filtered =
    activeCategory === "All"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Helvetica, Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 280,
          borderRight: "1px solid #e5e5e5",
          background: "#fafafa",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        <div style={{ padding: "20px 20px 12px", borderBottom: "1px solid #e5e5e5" }}>
          <h1 style={{ margin: 0, fontSize: 13, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Email Templates
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: 11, color: "#999" }}>
            {BRAND} — {templates.length} templates
          </p>
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, padding: "12px 20px 8px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: activeCategory === cat ? 600 : 400,
                background: activeCategory === cat ? "#000" : "transparent",
                color: activeCategory === cat ? "#fff" : "#666",
                border: "1px solid",
                borderColor: activeCategory === cat ? "#000" : "#ddd",
                cursor: "pointer",
                letterSpacing: "0.02em",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
          {filtered.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTemplate(t)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                padding: "10px 8px",
                margin: "2px 0",
                background: activeTemplate.id === t.id ? "#fff" : "transparent",
                border: activeTemplate.id === t.id ? "1px solid #e5e5e5" : "1px solid transparent",
                cursor: "pointer",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: 12,
                  fontWeight: activeTemplate.id === t.id ? 600 : 400,
                  color: "#000",
                }}
              >
                {t.name}
              </span>
              <span style={{ display: "block", fontSize: 10, color: "#999", marginTop: 2 }}>
                {t.category}
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* Preview area */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", background: "#e8e8e8" }}>
        {/* Toolbar */}
        <div
          style={{
            padding: "12px 20px",
            background: "#fff",
            borderBottom: "1px solid #e5e5e5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{activeTemplate.name}</h2>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#999" }}>
              Subject: {activeTemplate.subject}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => {
                const blob = new Blob([activeTemplate.html], { type: "text/html" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${activeTemplate.id}.html`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: "6px 14px",
                fontSize: 11,
                fontWeight: 500,
                background: "#000",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Download HTML
            </button>
          </div>
        </div>

        {/* Email iframe */}
        <div style={{ flex: 1, overflow: "auto", padding: 24, display: "flex", justifyContent: "center" }}>
          <iframe
            srcDoc={activeTemplate.html}
            title={activeTemplate.name}
            style={{
              width: 640,
              height: "100%",
              border: "none",
              background: "#f7f7f7",
              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            }}
          />
        </div>
      </main>
    </div>
  );
}
