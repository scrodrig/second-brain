import { Card, CardBody, CardHeader } from "@nextui-org/react";

import Image from "next/image";
import { InvoiceDetails } from "@/components";
import { getInvoiceById } from "@/actions";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function InvoicePage({ params: { id } }: Props) {
  const invoice = await getInvoiceById(id);

  if (!invoice) {
    notFound();
  }

  return (
    <div>
      <Card className="rounded-xl shadow-md text-center w-full">
        <CardBody>
          <div className="flex items-center gap-3">
            <Image
              alt="nextui logo"
              height={32}
              width={32}
              src={`https://ui-avatars.com/api/?name=${invoice.place}&rounded=true&bold=true&background=FF6666`}
              className="mx-2"
            />
            <h1>{invoice.place}</h1>
          </div>
        </CardBody>
      </Card>

      <InvoiceDetails invoice={invoice} />
      
    </div>
  );
}
