import { wrapEmail, styles } from "../_shared/base";

interface VerificationEmailProps {
  code: string;
}

export function verificationEmail({ code }: VerificationEmailProps): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Your verification code</h2>
        <p style="${styles.p}">
          Enter the following code to verify your email address and continue with your account.
        </p>

        <div style="${styles.codeBox}">
          <span style="${styles.code}">${code}</span>
        </div>

        <p style="${styles.muted}">
          This code expires in 10 minutes.
        </p>
        <p style="margin:4px 0 0;${styles.muted}">
          If you did not request this code, you can safely ignore this email.
        </p>
      </td>
    </tr>`);
}
