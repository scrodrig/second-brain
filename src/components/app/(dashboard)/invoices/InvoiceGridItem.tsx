"use client";

import { CONCEPT_COLORS, currencyFormat } from "@/utils";
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
} from "@nextui-org/react";
import { IoCalendar, IoCalendarOutline } from "react-icons/io5";

import Image from "next/image";
import { Invoice } from "@/interfaces";

interface Props {
  invoice: Invoice;
}

export const InvoiceGridItem = ({ invoice }: Props) => {
  return (
    <Card className="max-w-[400px] min-w-[250px]">
      <CardHeader className="flex gap-3">
        {/* <Image
          alt="nextui logo"
          height={40}
          src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
          width={40}
        /> */}
        <div className="flex flex-col w-full">
          <p className="text-3xl font-bold text-center mb-5 text-ellipsis">
            {invoice.place}
          </p>

          <div className="flex sm:flex-row justify-between">
            <Chip size="sm" color="primary" variant="flat">
              NIF: {invoice.nif}
            </Chip>

            <Chip size="sm" color="danger" variant="dot">
              {invoice.owner}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="p-4 flex flex-col">
          <p className="font-light mt-0">Price:</p>

          <div className="text-5xl text-right">
            <div className="font-medium text-green-800 hover:text-green-700 hover:font-bold transition-colors duration-150 ease-in-out">
              {currencyFormat(invoice.total)}
            </div>
          </div>

          <p className="font-light mt-5 text-ellipsis">{invoice.description}</p>

          <div className="mt-3 flex justify-start items-center">
            <IoCalendarOutline className="mr-2" size={20} />
            {invoice.date.toDateString()}
          </div>
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex w-full justify-end">
          <Chip
            size="lg"
            variant="shadow"
            classNames={{
              base: CONCEPT_COLORS[invoice.concept].className,
              content: "drop-shadow shadow-black text-white",
            }}
          >
            {invoice.concept}
          </Chip>
          {/* <div className="mt-3 flex justify-end items-center">
            <IoCalendarOutline className="mr-2" size={20} />
            {invoice.date.toDateString()}
          </div> */}
        </div>
      </CardFooter>
    </Card>
  );
};
