import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getSession } from "./session";

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      society: {
        include: {
          towers: { orderBy: { name: "asc" } },
        },
      },
    },
  });

  if (!user || !user.isActive) return null;
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireOnboardedUser() {
  const user = await requireUser();
  if (user.role === "SUPER_ADMIN") {
    return user;
  }
  if (!user.societyId || !user.name || !user.flatNumber || !user.disclaimerAcceptedAt) {
    redirect("/onboarding");
  }
  if (user.society && !user.society.isActive) {
    redirect("/onboarding?suspended=1");
  }
  return user;
}

export async function requireSocietyAdmin() {
  const user = await requireOnboardedUser();
  if (user.role !== "SOCIETY_ADMIN" && user.role !== "SUPER_ADMIN") {
    redirect("/find");
  }
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") {
    redirect("/find");
  }
  return user;
}
