"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteInvoice(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.findFirst({
    where: {
      id,
      household: { members: { some: { userId: session.user.id } } },
    },
  });
  if (!invoice) throw new Error("Invoice not found or unauthorized");

  await prisma.invoice.delete({ where: { id } });
  revalidatePath("/invoices");
}
