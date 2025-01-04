import { InvoiceGrid } from "@/components";
import { getInvoices } from "@/actions";

export default async function InvoicePage() {
  // TODO: Provide a list of invoices for testing
  const { invoices } = await getInvoices();

  return (
    <div>
      <InvoiceGrid invoices={invoices} />
    </div>
  );
}
