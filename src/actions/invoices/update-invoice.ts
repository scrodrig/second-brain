"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { InvoiceSchema, type InvoiceInput } from "@/lib/schemas/invoice.schema";
import { revalidatePath } from "next/cache";

export async function updateInvoice(id: string, data: InvoiceInput) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = InvoiceSchema.safeParse(data);
  if (!parsed.success) throw new Error("Invalid invoice data");

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      household: { members: { some: { userId: session.user.id } } },
    },
  });
  if (!invoice) throw new Error("Invoice not found or unauthorized");

  const updated = await prisma.invoice.update({
    where: { id },
    data: parsed.data,
  });

  revalidatePath("/invoices");
  revalidatePath(`/invoices/${id}`);
  return updated;
}
