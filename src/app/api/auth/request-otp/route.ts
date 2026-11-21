import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requestOtpSchema } from "@/lib/validators";
import { generateNumericOtp, hashOtp, OTP_EXPIRY_MINUTES } from "@/lib/auth/otp";
import { sendEmail, buildOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = requestOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid email" },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // Simple 30-second resend cooldown per email
    const recent = await prisma.otpToken.findFirst({
      where: {
        email,
        createdAt: { gt: new Date(Date.now() - 30 * 1000) },
      },
      orderBy: { createdAt: "desc" },
    });

    if (recent) {
      return NextResponse.json(
        { error: "Please wait 30 seconds before requesting another code." },
        { status: 429 }
      );
    }

    const otp = generateNumericOtp();
    const codeHash = hashOtp(email, otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    const tokenRecord = await prisma.otpToken.create({
      data: {
        email,
        codeHash,
        expiresAt,
      },
    });

    try {
      // Serverless-safe: strictly await email delivery before returning
      await sendEmail(buildOtpEmail(email, otp));
    } catch (mailError) {
      await prisma.otpToken.delete({ where: { id: tokenRecord.id } }).catch(() => {});
      console.error("OTP email send failed:", mailError);
      return NextResponse.json(
        {
          error:
            "Failed to send verification email. Please check email configuration or try again.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: `A 6-digit login code has been sent to ${email}`,
    });
  } catch (error) {
    console.error("request-otp error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
