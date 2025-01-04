export interface Invoice {
  id: string;
  date: Date;
  place: string;
  NIF: string;
  concept: Concept | null;
  description: string | null;
  owner: string;
  account: Account;
  total: number;
  isReembursable: boolean;
  isRefunded: boolean;
  vatRefund: boolean | null;
}

export type Concept = "Meal" | "Technology" | "Internet" | "Electricity" | "Education" | "Transportation" | "Others";
export type Account = "Personal" | "Business";