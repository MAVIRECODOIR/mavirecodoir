import { wrapEmail, styles, SITE_URL, BRAND_NAME } from "../_shared/base";

interface OrderCancelledEmailProps {
  firstName: string;
  orderNumber: string;
  reason?: string;
}

export function orderCancelledEmail({
  firstName,
  orderNumber,
  reason,
}: OrderCancelledEmailProps): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Order cancelled</h2>
        <p style="${styles.p}">
          Dear ${firstName}, your order #${orderNumber} has been cancelled as requested.
        </p>
        ${reason ? `<p style="${styles.p}">Reason: ${reason}</p>` : ""}
        <p style="${styles.p}">
          If a payment was made, your refund will be processed within 5–10 business days depending on your payment provider.
        </p>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${SITE_URL}" style="${styles.button}">
            Continue Shopping
          </a>
        </div>

        <p style="${styles.muted}">
          If you did not request this cancellation or have any questions, please contact our Client Service team immediately.
        </p>
      </td>
    </tr>`);
}
