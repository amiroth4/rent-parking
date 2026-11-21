import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const superAdminEmail = (
    process.env.SUPER_ADMIN_EMAIL || "admin@rentparking.local"
  )
    .trim()
    .toLowerCase();

  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: {
      role: UserRole.SUPER_ADMIN,
      isActive: true,
    },
    create: {
      email: superAdminEmail,
      name: "Platform Super Admin",
      role: UserRole.SUPER_ADMIN,
      isActive: true,
      disclaimerAcceptedAt: new Date(),
    },
  });

  const demoSociety = await prisma.society.upsert({
    where: { slug: "green-meadows" },
    update: {},
    create: {
      name: "Green Meadows Residency",
      slug: "green-meadows",
      city: "Bengaluru",
      address: "Whitefield Main Road",
      inviteCode: "GREEN2026",
      isActive: true,
      towers: {
        create: [
          { name: "Tower A", levels: "B1,B2,Stilt" },
          { name: "Tower B", levels: "B1,B2,Stilt" },
          { name: "Tower C", levels: "B1,Stilt" },
        ],
      },
    },
  });

  console.log("Seed complete:");
  console.log("  Super Admin:", superAdmin.email);
  console.log("  Demo Society:", demoSociety.name, "| Invite Code:", demoSociety.inviteCode);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
