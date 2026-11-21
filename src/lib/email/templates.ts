import type { EmailMessage } from "./types";

export function buildOtpEmail(to: string, otp: string): EmailMessage {
  return {
    to,
    subject: `${otp} is your RentParking login code`,
    text: `Your RentParking verification code is: ${otp}\n\nThis code expires in 10 minutes. If you did not request this code, you can safely ignore this email.`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 460px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 16px;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 28px;">
          <p style="margin: 0 0 8px; font-size: 13px; font-weight: 600; color: #059669; text-transform: uppercase; letter-spacing: 0.06em;">RentParking</p>
          <h1 style="margin: 0 0 12px; font-size: 20px; color: #0f172a;">Your login verification code</h1>
          <p style="margin: 0 0 20px; font-size: 14px; color: #475569; line-height: 1.5;">
            Enter the 6-digit code below to sign in to your society parking account. It expires in <strong>10 minutes</strong>.
          </p>
          <div style="background: #f1f5f9; border-radius: 10px; padding: 16px; text-align: center; letter-spacing: 0.35em; font-size: 28px; font-weight: 700; color: #0f172a;">
            ${otp}
          </div>
          <p style="margin: 20px 0 0; font-size: 12px; color: #94a3b8;">
            If you did not request this login code, please ignore this email.
          </p>
        </div>
      </div>
    `,
  };
}

export interface BookingEmailDetails {
  to: string;
  recipientRole: "OWNER" | "RENTER";
  societyName: string;
  slotLabel: string;
  vehicleNumber: string;
  startFormatted: string;
  endFormatted: string;
  estimatedAmount: number;
  counterpartyName: string;
  counterpartyFlat: string;
  counterpartyPhone: string;
}

export function buildBookingEmail(details: BookingEmailDetails): EmailMessage {
  const isOwner = details.recipientRole === "OWNER";
  const subject = isOwner
    ? `New booking for ${details.slotLabel} (${details.vehicleNumber})`
    : `Booking confirmed: ${details.slotLabel}`;

  const headline = isOwner
    ? "Someone booked your parking slot"
    : "Your parking slot is confirmed";

  const text = [
    headline,
    `Society: ${details.societyName}`,
    `Slot: ${details.slotLabel}`,
    `Vehicle: ${details.vehicleNumber}`,
    `Time: ${details.startFormatted} -> ${details.endFormatted}`,
    `Estimated Amount: Rs. ${details.estimatedAmount} (settle directly between residents)`,
    `${isOwner ? "Renter" : "Owner"}: ${details.counterpartyName} (Flat ${details.counterpartyFlat}, Phone ${details.counterpartyPhone})`,
    "",
    "Note: RentParking is only a community listing platform. Payment, security, and vehicle safety are solely between the parking owner and renter.",
  ].join("\n");

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 16px;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px;">
        <p style="margin: 0 0 6px; font-size: 12px; font-weight: 600; color: #059669; text-transform: uppercase;">${details.societyName}</p>
        <h2 style="margin: 0 0 16px; font-size: 19px; color: #0f172a;">${headline}</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #334155;">
          <tr><td style="padding: 6px 0; color: #64748b;">Slot</td><td style="padding: 6px 0; font-weight: 600; text-align: right;">${details.slotLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Vehicle</td><td style="padding: 6px 0; font-weight: 600; text-align: right;">${details.vehicleNumber}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">From</td><td style="padding: 6px 0; text-align: right;">${details.startFormatted}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">To</td><td style="padding: 6px 0; text-align: right;">${details.endFormatted}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Estimated Total</td><td style="padding: 6px 0; font-weight: 700; color: #059669; text-align: right;">₹${details.estimatedAmount}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">${isOwner ? "Renter" : "Owner"}</td><td style="padding: 6px 0; text-align: right;">${details.counterpartyName} · Flat ${details.counterpartyFlat}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Phone</td><td style="padding: 6px 0; text-align: right;">${details.counterpartyPhone}</td></tr>
        </table>
        <div style="margin-top: 16px; padding: 12px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; font-size: 12px; color: #92400e; line-height: 1.45;">
          <strong>Disclaimer:</strong> RentParking only connects society residents for convenience. Payments are settled directly between residents. The platform is not responsible for security, damages, or disputes.
        </div>
      </div>
    </div>
  `;

  return { to: details.to, subject, text, html };
}
