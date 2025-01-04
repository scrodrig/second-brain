export const revalidate = 300 // 1 minute

import { InvoiceGrid, Pagination } from "@/components";

import { getInvoices } from "@/actions";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: number;
  };
}

export default async function InvoicePage({ searchParams }: Props) {
  const page = searchParams.page ? Number(searchParams.page) : 1;

  const { invoices, totalPages } = await getInvoices({ page });

  if (invoices.length === 0) {
    redirect('/')
  }


  return (
    <div>
      <InvoiceGrid invoices={invoices} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
