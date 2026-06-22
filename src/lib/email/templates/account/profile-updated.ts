import { wrapEmail, styles, SITE_URL, BRAND_NAME } from "../_shared/base";

interface ProfileUpdatedEmailProps {
  firstName: string;
  changedFields: string[];
}

export function profileUpdatedEmail({
  firstName,
  changedFields,
}: ProfileUpdatedEmailProps): string {
  const fieldList = changedFields
    .map(
      (field) =>
        `<tr><td style="padding:4px 0;font-size:13px;color:#666666;line-height:1.7;">&bull;&nbsp;&nbsp;${field}</td></tr>`
    )
    .join("");

  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Profile updated</h2>
        <p style="${styles.p}">
          Dear ${firstName}, your ${BRAND_NAME} account details have been updated successfully.
        </p>

        <p style="margin:0 0 8px;font-size:13px;font-weight:500;color:#000000;">The following was changed:</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          ${fieldList}
        </table>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${SITE_URL}/client/my-account" style="${styles.button}">
            View Your Profile
          </a>
        </div>

        <p style="${styles.muted}">
          If you did not make these changes, please contact our Client Service team immediately to secure your account.
        </p>
      </td>
    </tr>`);
}
