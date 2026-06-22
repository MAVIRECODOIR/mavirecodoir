import { wrapEmail, styles, SITE_URL, BRAND_NAME } from "../_shared/base";

interface AppointmentConfirmationEmailProps {
  firstName: string;
  date: string;
  time: string;
  location: string;
  type?: string;
  notes?: string;
}

export function appointmentConfirmationEmail({
  firstName,
  date,
  time,
  location,
  type,
  notes,
}: AppointmentConfirmationEmailProps): string {
  return wrapEmail(`
    <tr>
      <td style="${styles.bodyCell}">
        <h2 style="${styles.h2}">Appointment confirmed</h2>
        <p style="${styles.p}">
          Dear ${firstName}, your private appointment at ${BRAND_NAME} has been confirmed.
        </p>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;">
          ${type ? `<tr><td style="${styles.tdLabel}">Type</td><td style="${styles.tdValue}">${type}</td></tr>` : ""}
          <tr>
            <td style="${styles.tdLabel}">Date</td>
            <td style="${styles.tdValue}">${date}</td>
          </tr>
          <tr>
            <td style="${styles.tdLabel}">Time</td>
            <td style="${styles.tdValue}">${time}</td>
          </tr>
          <tr>
            <td style="${styles.tdLabel}">Location</td>
            <td style="${styles.tdValue}">${location}</td>
          </tr>
          ${notes ? `<tr><td style="${styles.tdLabel}">Notes</td><td style="${styles.tdValue}">${notes}</td></tr>` : ""}
        </table>

        <div style="text-align:center;margin:0 0 24px;">
          <a href="${SITE_URL}/client/my-account" style="${styles.button}">
            Manage Appointment
          </a>
        </div>

        <p style="${styles.muted}">
          If you need to reschedule or cancel, please contact our Client Service team at least 24 hours in advance.
        </p>
      </td>
    </tr>`);
}
