import nodemailer from "nodemailer";
import type { EmailMessage, EmailProvider } from "../types";

/**
 * Serverless-safe Gmail SMTP provider using Nodemailer.
 * - Uses pool: false so sockets do not linger across Vercel invocations.
 * - Always awaited by callers (never fire-and-forget on Vercel).
 * - Explicitly closes transporter in finally block.
 */
export class NodemailerGmailProvider implements EmailProvider {
  readonly name = "gmail";

  async send(message: EmailMessage): Promise<void> {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || "465");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.EMAIL_FROM || (user ? `RentParking <${user}>` : undefined);

    if (!user || !pass || !from) {
      throw new Error(
        "Gmail SMTP is not configured. Please set SMTP_USER, SMTP_PASS, and EMAIL_FROM."
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      pool: false,
      auth: {
        user,
        pass,
      },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 10000,
    });

    try {
      await transporter.sendMail({
        from,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html,
      });
    } finally {
      transporter.close();
    }
  }
}
