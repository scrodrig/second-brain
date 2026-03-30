"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function getInvoiceById(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      household: { members: { some: { userId: session.user.id } } },
    },
    include: { createdBy: { select: { name: true, image: true } } },
  });

  if (!invoice) notFound();
  return invoice;
}
