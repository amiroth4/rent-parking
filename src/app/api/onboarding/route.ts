import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/guards";
import { setSessionCookie } from "@/lib/auth/session";
import { onboardingSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = onboardingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid details" },
        { status: 400 }
      );
    }

    const { inviteCode, name, phone, towerName, flatNumber } = parsed.data;

    const society = await prisma.society.findUnique({
      where: { inviteCode },
    });

    if (!society || !society.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive society invite code." },
        { status: 404 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        societyId: society.id,
        name,
        phone,
        towerName,
        flatNumber,
        disclaimerAcceptedAt: new Date(),
      },
    });

    await setSessionCookie({
      userId: updated.id,
      email: updated.email,
      role: updated.role,
      societyId: updated.societyId,
    });

    return NextResponse.json({ ok: true, redirectTo: "/find" });
  } catch (error) {
    console.error("onboarding error:", error);
    return NextResponse.json(
      { error: "Could not save profile. Please try again." },
      { status: 500 }
    );
  }
}
