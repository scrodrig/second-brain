"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resend } from "@/lib/email/resend";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoicePdfDocument } from "@/components/molecules/InvoicePdfDocument";
import React from "react";

export async function sendInvoiceEmail(invoiceId: string) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) throw new Error("Unauthorized");

  const invoice = await prisma.invoice.findFirst({
    where: {
      id: invoiceId,
      household: { members: { some: { userId: session.user.id } } },
    },
    include: { createdBy: { select: { name: true } } },
  });
  if (!invoice) throw new Error("Invoice not found");

  const pdfBuffer = await renderToBuffer(
    React.createElement(InvoicePdfDocument, { invoice })
  );

  await resend.emails.send({
    from: "Second Brain <noreply@secondbrain.app>",
    to: session.user.email,
    subject: `Invoice: ${invoice.place} — €${invoice.total}`,
    text: `Invoice from ${invoice.place} for €${invoice.total} on ${invoice.date.toLocaleDateString()}.`,
    attachments: [
      {
        filename: `invoice-${invoice.id}.pdf`,
        content: pdfBuffer,
      },
    ],
  });

  return { success: true };
}
