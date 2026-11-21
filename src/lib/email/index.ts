import type { EmailMessage, EmailProvider } from "./types";
import { NodemailerGmailProvider } from "./providers/nodemailer-gmail";
import { ResendProvider } from "./providers/resend";
import { ConsoleEmailProvider } from "./providers/console";

export function getEmailProvider(): EmailProvider {
  const mode = (process.env.EMAIL_PROVIDER || "gmail").toLowerCase();

  switch (mode) {
    case "resend":
      return new ResendProvider();
    case "console":
      return new ConsoleEmailProvider();
    case "gmail":
    default:
      return new NodemailerGmailProvider();
  }
}

/**
 * Sends an email synchronously (awaited).
 * IMPORTANT: Always await this call in Vercel serverless routes/actions — never fire-and-forget.
 */
export async function sendEmail(message: EmailMessage): Promise<void> {
  const provider = getEmailProvider();
  await provider.send(message);
}

export { buildOtpEmail, buildBookingEmail } from "./templates";
