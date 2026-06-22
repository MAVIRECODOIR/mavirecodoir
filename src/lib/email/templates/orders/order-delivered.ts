import { wrapEmail, styles, SITE_URL, BRAND_NAME } from "../_shared/base";

interface OrderDeliveredEmailProps {
  firstName: string;
  orderNumber: string;
}

export function orderDeliveredEmail({
  firstName,
  orderNumber,
}: OrderDeliveredEmailProps): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Your order has been delivered</h2>
        <p style="${styles.p}">
          Dear ${firstName}, your order #${orderNumber} has been delivered. We hope you are delighted with your ${BRAND_NAME} pieces.
        </p>
        <p style="${styles.p}">
          Should you require any assistance with your purchase, our Client Service team is at your disposal.
        </p>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${SITE_URL}/client/my-account" style="${styles.button}">
            View Order
          </a>
        </div>

        <p style="${styles.muted}">
          We would love to hear about your experience. If you have any feedback, please do not hesitate to contact us.
        </p>
      </td>
    </tr>`);
}
