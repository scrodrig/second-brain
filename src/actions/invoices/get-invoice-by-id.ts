"use server";

import { invoices } from "./data/invoices.data";

export const getInvoiceById = async (id: string) => {
  // Simulate a delay
  return await invoices.find((invoice) => invoice.id === id);
};
