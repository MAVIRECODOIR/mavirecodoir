import { wrapEmail, styles, SITE_URL, BRAND_NAME } from "../_shared/base";

export function newsletterWelcomeEmail(): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Welcome to the ${BRAND_NAME} world</h2>
        <p style="${styles.p}">
          Thank you for subscribing. You will now be among the first to discover new collections, exclusive events, and personalised recommendations from ${BRAND_NAME}.
        </p>
        <p style="${styles.p}">
          We look forward to sharing our world of refined craftsmanship and timeless design with you.
        </p>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${SITE_URL}/new-arrivals" style="${styles.button}">
            Explore New Arrivals
          </a>
        </div>

        <p style="${styles.muted}">
          You can unsubscribe at any time by updating your preferences in your account settings or by contacting our Client Service team.
        </p>
      </td>
    </tr>`);
}
