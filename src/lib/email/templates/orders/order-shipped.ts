import { wrapEmail, styles, SITE_URL, BRAND_NAME, COLORS } from "../_shared/base";

interface OrderShippedEmailProps {
  firstName: string;
  orderNumber: string;
  trackingNumber?: string;
  trackingUrl?: string;
  carrier?: string;
  estimatedDelivery?: string;
}

export function orderShippedEmail({
  firstName,
  orderNumber,
  trackingNumber,
  trackingUrl,
  carrier,
  estimatedDelivery,
}: OrderShippedEmailProps): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Your order is on its way</h2>
        <p style="${styles.p}">
          Dear ${firstName}, we are pleased to let you know that your order #${orderNumber} has been dispatched.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="${styles.tdLabel}">Order</td>
            <td style="${styles.tdValue}">#${orderNumber}</td>
          </tr>
          ${carrier ? `<tr><td style="${styles.tdLabel}">Carrier</td><td style="${styles.tdValue}">${carrier}</td></tr>` : ""}
          ${trackingNumber ? `<tr><td style="${styles.tdLabel}">Tracking</td><td style="${styles.tdValue}">${trackingNumber}</td></tr>` : ""}
          ${estimatedDelivery ? `<tr><td style="${styles.tdLabel}">Est. Delivery</td><td style="${styles.tdValue}">${estimatedDelivery}</td></tr>` : ""}
        </table>

        ${
          trackingUrl
            ? `<div style="text-align:center;margin:0 0 24px;">
                <a href="${trackingUrl}" style="${styles.button}">Track Your Order</a>
              </div>`
            : `<div style="text-align:center;margin:0 0 24px;">
                <a href="${SITE_URL}/client/my-account" style="${styles.button}">View Order</a>
              </div>`
        }

        <p style="${styles.muted}">
          Your order has been carefully packaged with ${BRAND_NAME} signature presentation. We will notify you once it has been delivered.
        </p>
      </td>
    </tr>`);
}
