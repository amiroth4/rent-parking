import type { EmailMessage, EmailProvider } from "../types";

/**
 * Drop-in Resend provider using the Resend HTTP API (zero SDK overhead, serverless native).
 * Activate anytime by setting EMAIL_PROVIDER=resend and RESEND_API_KEY in env.
 */
export class ResendProvider implements EmailProvider {
  readonly name = "resend";

  async send(message: EmailMessage): Promise<void> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM;

    if (!apiKey || !from) {
      throw new Error(
        "Resend is not configured. Please set RESEND_API_KEY and EMAIL_FROM."
      );
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Resend API error (${response.status}): ${errorText}`);
    }
  }
}
