'use server'

import { invoices } from "./data/invoices.data"

export const getInvoices = async () => {
  // Simulate a delay
  return await invoices;
}