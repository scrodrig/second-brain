'use server'

import prisma from '@/lib/prisma'

export const getInvoices = async () => {

  const invoices = await prisma.invoice.findMany({
    orderBy: {
      date: 'desc',
    },
  })

  return {
    success: true,
    invoices: invoices,
  }
}