import { PrismaClient, Concept, AccountType, HouseholdRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 12);

  const user = await prisma.user.upsert({
    where: { email: "demo@secondbrain.app" },
    update: {},
    create: {
      name: "Demo User",
      email: "demo@secondbrain.app",
      password: passwordHash,
    },
  });

  const household = await prisma.household.upsert({
    where: { id: "household-demo-id" },
    update: {},
    create: {
      id: "household-demo-id",
      name: "Demo Family",
    },
  });

  await prisma.householdMember.upsert({
    where: { userId_householdId: { userId: user.id, householdId: household.id } },
    update: {},
    create: { userId: user.id, householdId: household.id, role: HouseholdRole.OWNER },
  });

  const invoices = [
    { place: "Mercadona", nif: "A-12345678", concept: Concept.Meal, total: 45.60, accountType: AccountType.Personal },
    { place: "Vodafone", nif: "A-87654321", concept: Concept.Internet, total: 30.00, accountType: AccountType.Business },
    { place: "RENFE", nif: "Q-2801014G", concept: Concept.Transportation, total: 22.50, accountType: AccountType.Business, isReimbursable: true },
  ];

  for (const invoice of invoices) {
    await prisma.invoice.create({
      data: { ...invoice, createdById: user.id, householdId: household.id },
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
