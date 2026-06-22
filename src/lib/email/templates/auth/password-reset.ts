import { wrapEmail, styles, BRAND_NAME } from "../_shared/base";

interface PasswordResetEmailProps {
  resetUrl: string;
}

export function passwordResetEmail({ resetUrl }: PasswordResetEmailProps): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Reset your password</h2>
        <p style="${styles.p}">
          We received a request to reset the password for your ${BRAND_NAME} account.
        </p>
        <p style="${styles.p}">
          Click the button below to choose a new password. This link will expire in 30 minutes.
        </p>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${resetUrl}" style="${styles.button}">
            Reset Password
          </a>
        </div>

        <p style="${styles.muted}">
          If you did not request a password reset, please ignore this email. Your password will remain unchanged.
        </p>
        <p style="margin:8px 0 0;${styles.muted}">
          For security, this link can only be used once.
        </p>
      </td>
    </tr>`);
}
