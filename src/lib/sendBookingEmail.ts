// lib/sendBookingEmail.ts
import { resend } from "./resend";

export async function sendBookingEmail({
  to,
  guestName
}: {
  to: string;
  guestName: string;
}) {
  return resend.emails.send({
    from: "Hotel <onboarding@resend.dev>", 
    to,
    subject: "Booking Confirmation",
    html: `
      <h2>Booking Confirmed</h2>
      <p>Hello ${guestName},</p>
      <p>Your booking has been successfully confirmed.</p>
      <p>We look forward to hosting you.</p>
    `,
  });
}