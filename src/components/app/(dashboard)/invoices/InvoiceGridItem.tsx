"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
} from "@nextui-org/react";

import { CONCEPT_COLORS } from "@/utils";
import { Invoice } from "@/interfaces";

interface Props {
  invoice: Invoice;
}

export const InvoiceGridItem = ({ invoice }: Props) => {
  return (
    <Card className="max-w-[400px]">
      <CardHeader className="flex gap-3">
        {/* <Image
          alt="nextui logo"
          height={40}
          radius="sm"
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        /> */}
        <div className="flex flex-col w-full">
          <p className="text-md font-bold text-center">{invoice.place}</p>
          <Chip size="sm" color="primary" variant="flat">NIF: {invoice.nif}</Chip>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="p-4 flex flex-col">
          <p className="">{invoice.description}</p>
          <span className="font-bold">{invoice.total}</span>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div>
          <Chip
            size="lg"
            variant="shadow"
            classNames={{
              base: CONCEPT_COLORS[invoice.concept],
              content: "drop-shadow shadow-black text-white",
            }}
          >
            {invoice.concept}
          </Chip>
        </div>
      </CardFooter>
    </Card>
  );
};
