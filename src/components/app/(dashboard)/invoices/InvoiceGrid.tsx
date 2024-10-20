import { Invoice } from "@/interfaces";
import { InvoiceGridItem } from "./InvoiceGridItem";

interface Props {
  invoices: Invoice[];
}
export const InvoiceGrid = ({ invoices }: Props) => {


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-10 mb-10">
      {invoices.map((invoice) => {
        return <InvoiceGridItem key={invoice.id} invoice={invoice} />;
      })}
    </div>
  );
};