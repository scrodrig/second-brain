"use server";

import prisma from "@/lib/prisma";

interface PaginationOptions {
  page?: number;
  take?: number;
}

export const getInvoices = async ({
  page = 1,
  take = 12,
}: PaginationOptions) => {
  try {
    if (isNaN(Number(page))) page = 1;
    if (page < 1) page = 1;

    const invoices = await prisma.invoice.findMany({
      take: take,
      skip: (page - 1) * take,
      orderBy: {
        date: "desc",
      },
    });

    const totalCount = await prisma.invoice.count({});
    const totalPages = Math.ceil(totalCount / take);

    return {
      currentPage: page,
      totalPages,
      invoices: invoices,
    };
  } catch (e) {
    throw new Error("Products not loaded");
  }
};
