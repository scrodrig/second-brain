import { z } from "zod";
import { Concept, AccountType } from "@prisma/client";

export const InvoiceSchema = z.object({
  place: z.string().min(2).max(100),
  nif: z.string().min(5).max(20),
  concept: z.nativeEnum(Concept),
  accountType: z.nativeEnum(AccountType),
  total: z.number().positive(),
  date: z.coerce.date(),
  description: z.string().max(500).optional(),
  isReimbursable: z.boolean().default(false),
  isRefunded: z.boolean().default(false),
  vatRefund: z.boolean().optional(),
});

export type InvoiceInput = z.infer<typeof InvoiceSchema>;
