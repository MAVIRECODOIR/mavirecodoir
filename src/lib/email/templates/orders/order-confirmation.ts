import { wrapEmail, styles, SITE_URL, BRAND_NAME, COLORS } from "../_shared/base";

interface OrderItem {
  name: string;
  variant?: string;
  quantity: number;
  price: string;
  imageUrl?: string;
}

interface OrderConfirmationEmailProps {
  firstName: string;
  orderNumber: string;
  orderDate: string;
  items: OrderItem[];
  subtotal: string;
  shipping: string;
  total: string;
  shippingAddress: string;
}

export function orderConfirmationEmail({
  firstName,
  orderNumber,
  orderDate,
  items,
  subtotal,
  shipping,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps): string {
  const itemRows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:16px 0;border-bottom:1px solid ${COLORS.border};vertical-align:top;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            <tr>
              ${
                item.imageUrl
                  ? `<td style="width:80px;vertical-align:top;padding-right:16px;">
                      <img src="${item.imageUrl}" alt="${item.name}" width="80" style="display:block;border:1px solid ${COLORS.border};" />
                    </td>`
                  : ""
              }
              <td style="vertical-align:top;">
                <p style="margin:0 0 4px;font-size:13px;font-weight:500;color:${COLORS.textPrimary};">${item.name}</p>
                ${item.variant ? `<p style="margin:0 0 4px;font-size:12px;color:${COLORS.textMuted};">${item.variant}</p>` : ""}
                <p style="margin:0;font-size:12px;color:${COLORS.textMuted};">Qty: ${item.quantity}</p>
              </td>
              <td style="vertical-align:top;text-align:right;white-space:nowrap;">
                <p style="margin:0;font-size:13px;font-weight:500;color:${COLORS.textPrimary};">${item.price}</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    )
    .join("");

  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Order confirmed</h2>
        <p style="${styles.p}">
          Dear ${firstName}, thank you for your order. We are pleased to confirm that your order has been received and is being prepared.
        </p>

        <!-- Order details -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="${styles.tdLabel}">Order</td>
            <td style="${styles.tdValue}">#${orderNumber}</td>
          </tr>
          <tr>
            <td style="${styles.tdLabel}">Date</td>
            <td style="${styles.tdValue}">${orderDate}</td>
          </tr>
          <tr>
            <td style="${styles.tdLabel}">Delivery to</td>
            <td style="${styles.tdValue}">${shippingAddress}</td>
          </tr>
        </table>

        <hr style="${styles.divider}" />

        <!-- Items -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${itemRows}
        </table>

        <!-- Totals -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 24px;">
          <tr>
            <td style="padding:6px 0;font-size:13px;color:${COLORS.textSecondary};">Subtotal</td>
            <td style="padding:6px 0;font-size:13px;color:${COLORS.textPrimary};text-align:right;">${subtotal}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:13px;color:${COLORS.textSecondary};">Shipping</td>
            <td style="padding:6px 0;font-size:13px;color:${COLORS.textPrimary};text-align:right;">${shipping}</td>
          </tr>
          <tr>
            <td style="padding:12px 0 0;font-size:14px;font-weight:600;color:${COLORS.textPrimary};border-top:1px solid ${COLORS.border};">Total</td>
            <td style="padding:12px 0 0;font-size:14px;font-weight:600;color:${COLORS.textPrimary};text-align:right;border-top:1px solid ${COLORS.border};">${total}</td>
          </tr>
        </table>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${SITE_URL}/client/my-account" style="${styles.button}">
            View Order
          </a>
        </div>

        <p style="${styles.muted}">
          You will receive a shipping confirmation once your order has been dispatched.
        </p>
      </td>
    </tr>`);
}
