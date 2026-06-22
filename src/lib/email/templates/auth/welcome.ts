import { wrapEmail, styles, SITE_URL, BRAND_NAME } from "../_shared/base";

interface WelcomeEmailProps {
  firstName: string;
}

export function welcomeEmail({ firstName }: WelcomeEmailProps): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Welcome to ${BRAND_NAME}</h2>
        <p style="${styles.p}">
          Dear ${firstName},
        </p>
        <p style="${styles.p}">
          Thank you for creating your ${BRAND_NAME} account. You now have access to a world of refined craftsmanship and timeless design.
        </p>
        <p style="${styles.p}">
          With your account you can:
        </p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">
              &bull;&nbsp;&nbsp;Track your orders and returns
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">
              &bull;&nbsp;&nbsp;Save items to your wishlist
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">
              &bull;&nbsp;&nbsp;Book private appointments
            </td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#666666;line-height:1.7;">
              &bull;&nbsp;&nbsp;Receive tailored assistance from our Client Service
            </td>
          </tr>
        </table>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${SITE_URL}/client/my-account" style="${styles.button}">
            View Your Account
          </a>
        </div>

        <p style="${styles.muted}">
          If you have any questions, our Client Service team is always here to help.
        </p>
      </td>
    </tr>`);
}
