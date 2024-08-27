export interface Invoice {
  id: string;
  date: string;
  place: string;
  nif: string;
  concept: string;
  description: string;
  owner: string;
  account: string;
  total: number;
  isReembursable: boolean;
  isRefunded: boolean;
}