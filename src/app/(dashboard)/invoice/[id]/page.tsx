import { getInvoiceById } from "@/actions";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function InvoicePage({ params: { id } }: Props) {
  console.log("🚀 ~ InvoicePage ~ id:", id)
  const invoice = await getInvoiceById(id);
  console.log("🚀 ~ InvoicePage ~ invoice:", invoice)

  if (!invoice) {
    notFound();
  }

  return (
    <div>
      <h1>Hello Page</h1>
      <h2>{invoice.id}</h2>
    </div>
  );
}
