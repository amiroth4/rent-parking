import type { EmailMessage, EmailProvider } from "../types";

/**
 * Local development email provider that prints emails to stdout.
 */
export class ConsoleEmailProvider implements EmailProvider {
  readonly name = "console";

  async send(message: EmailMessage): Promise<void> {
    console.log("\n================ [RentParking Email] ================");
    console.log("To:     ", message.to);
    console.log("Subject:", message.subject);
    console.log("-----------------------------------------------------");
    console.log(message.text);
    console.log("=====================================================\n");
  }
}
