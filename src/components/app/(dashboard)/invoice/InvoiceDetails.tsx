"use client";

import { Card, CardBody, CardHeader, Chip, Input } from "@nextui-org/react";
import { FaArrowDown, FaX } from "react-icons/fa6";
import { FaCheckCircle, FaMoneyBill } from "react-icons/fa";

import { AiTwotoneBank } from "react-icons/ai";
import Image from "next/image";
import { Invoice } from "@/interfaces";
import { IoFastFoodOutline } from "react-icons/io5";
import clsx from "clsx";
import { currencyFormat } from "@/utils";

interface Props {
  invoice: Invoice;
}
export const InvoiceDetails = ({ invoice }: Props) => {
  const checkIcon = (flag: boolean) => {
    return flag ? (
      <FaCheckCircle className="text-green-300" size={20} />
    ) : (
      <FaX className="text-red-200" size={20} />
    );
  };

  return (
    <>
      <div className="gap-5 text-5xl font-bold text-center">
        Invoice # {invoice.id.split("-").slice(-1)}{" "}
      </div>

      <Card className="rounded-xl shadow-md text-center w-full mt-5">
        <CardBody>
          <div className="flex flex-col items-center gap-3">
            <Image
              alt="nextui logo"
              height={80}
              width={80}
              src={`https://ui-avatars.com/api/?name=${invoice.place}&rounded=true&bold=true&background=FF6666`}
            />
            <h1>{invoice.place}</h1>
            <p className="text-gray-400">{`"${invoice.description}..."`}</p>
          </div>
        </CardBody>
      </Card>

      <div className="mt-10 mb-10 gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card className="group">
          <Image
            alt="Card background"
            className=" w-full rounded-xl opacity-30 transform group-hover:scale-105 group-hover:opacity-70 transition-transform duration-300"
            src="/imgs/account.png"
            width={100}
            height={250}
          />
          <CardBody className="flex flex-col md:flex-row mt-3 lg:mt-0 justify-around items-center">
            <div className="flex-col">
              <p className="text-tiny uppercase font-bold">Account</p>
              <h4 className="font-bold text-large">{invoice.account}</h4>
            </div>
            <AiTwotoneBank className="mr-2 text-gray-300" size={80} />
          </CardBody>
        </Card>

        <Card className="group">
          <CardBody className="flex flex-row justify-center items-center overflow-hidden">
            <div className="flex-col justify-center text-center">
              <div className="flex justify-center items-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                <FaMoneyBill className="mr-2 text-green-800" size={100} />
              </div>
              <p className="text-tiny uppercase font-bold text-center">Total</p>
              <div className="flex flex-col font-bold text-2xl md:text-5xl lg:text-6xl items-center">
                <FaArrowDown className="mt-5 text-red-600" size={50} />
                <span className="text-red-600 mt-5">
                  {currencyFormat(invoice.total)}
                </span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="group col-span-1 md:col-span-2">
          <CardHeader className="text-4xl font-bold uppercase text-center">
            Invoice Details
          </CardHeader>

          <CardBody className="flex flex-col justify-start items-start overflow-hidden">
            <div className="flex-col w-full">
              <Input
                type="date"
                label="Date"
                value={invoice.date.toISOString().split("T")[0]}
                readOnly
              />
              <Input
                className="mt-5"
                type="string"
                label="NIF"
                value={invoice.NIF}
                readOnly
              />

              <Input
                className="mt-5"
                type="string"
                startContent={<IoFastFoodOutline size={20} />}
                color="warning"
                label="Concept"
                value={invoice.concept}
                readOnly
              />

              <div className="grid grid-cols-1 xl:grid-cols-3 mt-10 xl:mt-20 place-items-center gap-5">
                <Chip
                  startContent={checkIcon(invoice.isReembursable)}
                  variant="flat"
                  size="lg"
                  className={clsx("text-white text-xl", {
                    "bg-green-500": invoice.isReembursable,
                    "bg-red-500": !invoice.isReembursable,
                  })}
                >
                  {invoice.isReembursable ? "Reembursable" : "Not Reembursable"}
                </Chip>

                <Chip
                  startContent={checkIcon(invoice.vatRefund ?? false)}
                  variant="shadow"
                  size="lg"
                  className={clsx("text-white text-xl", {
                    "bg-green-500": invoice.vatRefund,
                    "bg-red-500": !invoice.vatRefund,
                  })}
                >
                  {invoice.vatRefund ? "VAT Applicable" : "VAT Not applicable"}
                </Chip>

                <Chip
                  startContent={checkIcon(invoice.isRefunded)}
                  variant="shadow"
                  size="lg"
                  className={clsx("text-white text-xl", {
                    "bg-green-500": invoice.isRefunded,
                    "bg-red-500": !invoice.isRefunded,
                  })}
                >
                  {invoice.vatRefund ? "Refounded" : "Not Refounded"}
                </Chip>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};
