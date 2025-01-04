"use server";

import prisma from '@/lib/prisma'

export const getInvoiceById = async (id: string) => {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id,
    },
  })
  if (!invoice) throw new Error(`Order ${id} not found`)
    return {
      success: true,
      invoice,
    }
};
