/**
 * Shared email template components for MAVIRE CODOIR.
 * All templates use these building blocks for consistency.
 */

const BRAND_NAME = "MAVIRE CODOIR";
const LOGO_URL =
  "https://pub-cb269c46bd284333bcafb48988f70133.r2.dev/brand/logos/png/1771394628214-zkowej-Mavire%20Codoir%20-%20LOGO.webp";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mavirecodoir.com";

/* ─── Colour palette ─── */
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

/* ─── Shared inline styles ─── */
export const styles = {
  body: `margin:0;padding:0;background-color:${COLORS.bg};font-family:Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;`,
  wrapper: `background-color:${COLORS.bg};padding:40px 0;`,
  container: `background-color:${COLORS.white};max-width:560px;width:100%;`,
  headerCell: `padding:32px 40px 24px;text-align:center;border-bottom:1px solid ${COLORS.border};`,
  logo: `max-height:28px;width:auto;`,
  bodyCell: `padding:40px 40px 32px;`,
  footerCell: `padding:24px 40px;border-top:1px solid ${COLORS.border};text-align:center;`,
  h2: `margin:0 0 16px;font-size:20px;font-weight:500;color:${COLORS.textPrimary};letter-spacing:0.02em;`,
  p: `margin:0 0 16px;font-size:13px;line-height:1.7;color:${COLORS.textSecondary};`,
  pLast: `margin:0;font-size:13px;line-height:1.7;color:${COLORS.textSecondary};`,
  muted: `margin:0;font-size:12px;color:${COLORS.textMuted};line-height:1.6;`,
  mutedSmall: `margin:0;font-size:10px;color:${COLORS.textFaint};letter-spacing:0.05em;`,
  button: `display:inline-block;background-color:${COLORS.black};color:${COLORS.white};text-decoration:none;font-size:12px;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:14px 32px;`,
  codeBox: `background-color:${COLORS.bg};border:1px solid ${COLORS.border};padding:20px;text-align:center;margin:0 0 24px;`,
  code: `font-size:32px;font-weight:600;letter-spacing:0.3em;color:${COLORS.black};font-family:monospace;`,
  divider: `border:none;border-top:1px solid ${COLORS.border};margin:24px 0;`,
  tableRow: `border-bottom:1px solid ${COLORS.border};`,
  tdLabel: `padding:10px 0;font-size:12px;color:${COLORS.textMuted};letter-spacing:0.04em;text-transform:uppercase;vertical-align:top;width:140px;`,
  tdValue: `padding:10px 0;font-size:13px;color:${COLORS.textPrimary};vertical-align:top;`,
};

/* ─── Header ─── */
export function emailHeader(): string {
  return `
    <tr>
      <td style="${styles.headerCell}">
        <a href="${SITE_URL}" target="_blank" style="text-decoration:none;">
          <img src="${LOGO_URL}" alt="${BRAND_NAME}" style="${styles.logo}" />
        </a>
      </td>
    </tr>`;
}

/* ─── Footer ─── */
export function emailFooter(): string {
  const year = new Date().getFullYear();
  return `
    <tr>
      <td style="${styles.footerCell}">
        <p style="margin:0 0 8px;font-size:11px;color:${COLORS.textMuted};letter-spacing:0.04em;">
          <a href="${SITE_URL}" style="color:${COLORS.textMuted};text-decoration:none;">${BRAND_NAME}</a>
        </p>
        <p style="${styles.mutedSmall}">
          &copy; ${year} ${BRAND_NAME}. All rights reserved.
        </p>
        <p style="margin:8px 0 0;font-size:10px;color:${COLORS.textFaint};">
          <a href="${SITE_URL}/privacy" style="color:${COLORS.textFaint};text-decoration:underline;">Privacy Policy</a>
          &nbsp;&middot;&nbsp;
          <a href="${SITE_URL}/terms" style="color:${COLORS.textFaint};text-decoration:underline;">Terms &amp; Conditions</a>
          &nbsp;&middot;&nbsp;
          <a href="${SITE_URL}/contact" style="color:${COLORS.textFaint};text-decoration:underline;">Contact Us</a>
        </p>
      </td>
    </tr>`;
}

/* ─── Full page wrapper ─── */
export function wrapEmail(bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND_NAME}</title>
</head>
<body style="${styles.body}">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="${styles.wrapper}">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="${styles.container}">
          ${emailHeader()}
          ${bodyContent}
          ${emailFooter()}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export { BRAND_NAME, LOGO_URL, SITE_URL, COLORS };
