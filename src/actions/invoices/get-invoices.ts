"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

const PAGE_SIZE = 8;

export async function getInvoices(page = 1) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const membership = await prisma.householdMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) return { invoices: [], totalPages: 0, currentPage: 1 };

  const [invoices, total] = await Promise.all([
    prisma.invoice.findMany({
      where: { householdId: membership.householdId },
      include: { createdBy: { select: { name: true, image: true } } },
      orderBy: { date: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.invoice.count({
      where: { householdId: membership.householdId },
    }),
  ]);

  return {
    invoices,
    totalPages: Math.ceil(total / PAGE_SIZE),
    currentPage: page,
  };
}
