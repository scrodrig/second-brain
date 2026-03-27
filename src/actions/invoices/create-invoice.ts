"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InvoiceSchema, type InvoiceInput } from "@/lib/schemas/invoice.schema";
import { revalidatePath } from "next/cache";

export async function createInvoice(data: InvoiceInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = InvoiceSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid invoice data");

  const membership = await prisma.householdMember.findFirst({
    where: { userId: session.user.id },
  });
  if (!membership) throw new Error("User has no household");

  const invoice = await prisma.invoice.create({
    data: {
      ...parsed.data,
      createdById: session.user.id,
      householdId: membership.householdId,
    },
  });

  revalidatePath("/invoices");
  return invoice;
}
