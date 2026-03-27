import { InvoiceDetails } from "@/components";
import { getInvoiceById } from "@/actions";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function InvoicePage({ params }: Props) {
  const { id } = await params;
  const { invoice } = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return (
    <div>
      <InvoiceDetails invoice={invoice} />
    </div>
  );
}
