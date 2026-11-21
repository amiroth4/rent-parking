import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") || "").trim().toUpperCase();

  if (!code || code.length < 4) {
    return NextResponse.json(
      { error: "Enter a valid society invite code" },
      { status: 400 }
    );
  }

  const society = await prisma.society.findUnique({
    where: { inviteCode: code },
    select: {
      id: true,
      name: true,
      city: true,
      isActive: true,
      towers: {
        select: { id: true, name: true, levels: true },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!society || !society.isActive) {
    return NextResponse.json(
      { error: "No active society found for this invite code." },
      { status: 404 }
    );
  }

  return NextResponse.json({ society });
}
