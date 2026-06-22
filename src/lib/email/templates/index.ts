/* ─── Auth ─── */
export { verificationEmail } from "./auth/verification";
export { welcomeEmail } from "./auth/welcome";
export { passwordResetEmail } from "./auth/password-reset";

/* ─── Orders ─── */
export { orderConfirmationEmail } from "./orders/order-confirmation";
export { orderShippedEmail } from "./orders/order-shipped";
export { orderDeliveredEmail } from "./orders/order-delivered";
export { orderCancelledEmail } from "./orders/order-cancelled";

/* ─── Account ─── */
export { profileUpdatedEmail } from "./account/profile-updated";
export { newsletterWelcomeEmail } from "./account/newsletter-welcome";

/* ─── Appointments ─── */
export { appointmentConfirmationEmail } from "./appointments/appointment-confirmation";
export { appointmentReminderEmail } from "./appointments/appointment-reminder";
