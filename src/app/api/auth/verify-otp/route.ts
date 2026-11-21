import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { verifyOtpSchema } from "@/lib/validators";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/lib/auth/otp";
import { setSessionCookie } from "@/lib/auth/session";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = verifyOtpSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { email, otp } = parsed.data;

    const token = await prisma.otpToken.findFirst({
      where: {
        email,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!token) {
      return NextResponse.json(
        { error: "Verification code expired or not found. Please request a new one." },
        { status: 400 }
      );
    }

    if (token.attempts >= OTP_MAX_ATTEMPTS) {
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 429 }
      );
    }

    const valid = verifyOtpHash(email, otp, token.codeHash);
    if (!valid) {
      await prisma.otpToken.update({
        where: { id: token.id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json(
        { error: "Incorrect verification code. Please try again." },
        { status: 400 }
      );
    }

    await prisma.otpToken.update({
      where: { id: token.id },
      data: { usedAt: new Date() },
    });

    const configuredSuperAdmin = (process.env.SUPER_ADMIN_EMAIL || "")
      .trim()
      .toLowerCase();

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      const isSuperAdmin = configuredSuperAdmin !== "" && email === configuredSuperAdmin;
      user = await prisma.user.create({
        data: {
          email,
          role: isSuperAdmin ? UserRole.SUPER_ADMIN : UserRole.RESIDENT,
          disclaimerAcceptedAt: isSuperAdmin ? new Date() : null,
        },
      });
    } else if (
      configuredSuperAdmin !== "" &&
      email === configuredSuperAdmin &&
      user.role !== UserRole.SUPER_ADMIN
    ) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { role: UserRole.SUPER_ADMIN },
      });
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "Your account has been suspended by your society admin." },
        { status: 403 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      role: user.role,
      societyId: user.societyId,
    });

    let redirectTo = "/find";
    if (user.role === "SUPER_ADMIN" && !user.societyId) {
      redirectTo = "/admin";
    } else if (
      user.role !== "SUPER_ADMIN" &&
      (!user.societyId || !user.flatNumber || !user.disclaimerAcceptedAt)
    ) {
      redirectTo = "/onboarding";
    }

    return NextResponse.json({ ok: true, redirectTo });
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json(
      { error: "Failed to verify code. Please try again." },
      { status: 500 }
    );
  }
}
