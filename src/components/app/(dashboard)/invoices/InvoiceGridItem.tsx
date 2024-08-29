"use client";

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
} from "@nextui-org/react";
import { CONCEPT_COLORS, currencyFormat } from "@/utils";
import { IoCalendar, IoCalendarOutline } from "react-icons/io5";

import { AiTwotoneBank } from "react-icons/ai";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GrLinkNext } from "react-icons/gr";
import Image from "next/image";
import { Invoice } from "@/interfaces";
import { LiaPiggyBankSolid } from "react-icons/lia";

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
          <span className="text-3xl font-bold text-center mb-5 overflow-hidden text-nowrap text-ellipsis">
            {invoice.place}
          </span>

          <div className="flex flex-col w-full justify-center items-center">
            <Divider className="mb-2" />
            <Chip
              size="md"
              variant="shadow"
              classNames={{
                base: CONCEPT_COLORS[invoice.concept].className,
                content: "drop-shadow shadow-black text-white",
              }}
            >
              {invoice.concept}
            </Chip>
          </div>
          <Divider className="mt-3 mb-4" />

          <div className="flex sm:flex-row justify-around">
            <Chip
              size="md"
              color="primary"
              variant="flat"
              classNames={{ content: "dark:text-white" }}
            >
              NIF: {invoice.nif}
            </Chip>

            <Chip size="md" color="danger" variant="dot">
              {invoice.owner}
            </Chip>
          </div>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="flex items">
        <div className="p-4 flex flex-col h-fit">
          <p className="font-light mt-0">Price:</p>
          <div className="text-5xl text-right">
            <div className="font-medium text-green-800 dark:text-gray-50 hover:text-green-700 hover:font-bold transition-colors duration-150 ease-in-out">
              {currencyFormat(invoice.total)}
            </div>
          </div>

          <blockquote className="font-light mt-5 text-ellipsis">{`"${invoice.description}"`}</blockquote>

          <div className="mt-3 flex justify-start items-center">
            <IoCalendarOutline className="mr-2 text-sky-600" size={20} />
            {invoice.date.toDateString()}
          </div>

          <div className="mt-3 flex justify-start items-center">
            <AiTwotoneBank  className="mr-2 text-gray-600" size={20} />
            {invoice.account}
          </div>

          <div className="mt-3 flex justify-start items-center">
            <FaMoneyBillTransfer className="mr-2 text-green-600" size={20} />
            {invoice.isReembursable ? "Reembursable" : "Not reembursable"}
          </div>

          {invoice.isReembursable && (
            <div className="mt-3 flex justify-start items-center">
              <LiaPiggyBankSolid className="mr-2 text-pink-600" size={20} />
              {invoice.isRefunded ? "Refounded" : "Not Refounded"}
            </div>
          )}
        </div>
      </CardBody>
      <Divider />
      <CardFooter>
        <div className="flex w-full justify-end">
          <Button color="primary" variant="solid" endContent={<GrLinkNext />}>
            See more
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
