export interface Invoice {
  id: string;
  date: Date;
  place: string;
  nif: string;
  concept: InvoiceConcept;
  description: string;
  owner: string;
  account: string;
  total: number;
  isReembursable: boolean;
  isRefunded: boolean;
  vatRefund?: boolean;
}

export type InvoiceConcept = "Meal" | "Technology" | "Internet" | "Electricity" | "Education" | "Transportation" | "Others";