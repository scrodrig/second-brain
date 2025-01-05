export const revalidate = 300; // 1 minute

import { InvoiceGrid, Pagination, Title } from "@/components";

import { cn } from "@nextui-org/react";
import { getInvoices } from "@/actions";
import { redirect } from "next/navigation";

interface Props {
  searchParams: {
    page?: number;
  };
}

export default async function InvoicePage({ searchParams }: Props) {
  const { page } = await searchParams;
  const currentPage = page ? Number(page) : 1;

  const { invoices, totalPages } = await getInvoices({
    page: currentPage,
    take: 8,
  });

  if (invoices.length === 0) {
    console.log("No invoices found");
    redirect("/");
  }

  return (
    <div>
      <Title title="Invoices" />
      <InvoiceGrid invoices={invoices} />
      <Pagination totalPages={totalPages} />
    </div>
  );
}
