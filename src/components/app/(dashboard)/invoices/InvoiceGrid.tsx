import { Button } from "@nextui-org/react";
import { Invoice } from "@/interfaces";
import { InvoiceGridItem } from "./InvoiceGridItem";
import { IoMdAdd } from "react-icons/io";

interface Props {
  invoices: Invoice[];
}
export const InvoiceGrid = ({ invoices }: Props) => {
  return (
    <>
      <div className="flex justify-end">
      <Button className="mb-5" color="primary" endContent={<IoMdAdd />}>
        New Invoice
      </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mb-10">
        {invoices.map((invoice) => {
          return <InvoiceGridItem key={invoice.id} invoice={invoice} />;
        })}
      </div>
    </>
  );
};
