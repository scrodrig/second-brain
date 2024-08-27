"use client";

import { Invoice } from "@/interfaces";
import Link from "next/link";

interface Props {
  invoice: Invoice;
}

export const InvoiceGridItem = ({ invoice }: Props) => {
  return (
    <div className="rounded-md overflow-hidden fade-in">
      <Link href={`/invoice/${invoice.id}`}>
        <div className="bg-gray-200 h-40 w-full">{invoice.id}</div>
      </Link>
      <div className="p-4 flex flex-col">
        <span className="font-bold">{invoice.concept}</span>
        <span className="font-bold">${invoice.total}</span>
      </div>
    </div>
  );
};
