import { Card, CardBody } from "@nextui-org/react";

import { AiTwotoneBank } from "react-icons/ai";
import Image from "next/image";
import { Invoice } from "@/interfaces";
import React from "react";

interface Props {
  invoice: Invoice;
}

export const SomeOtherCard = ({ invoice }: Props) => {
  return (
    <div className="mt-10 flex gap-10 sm:flex-nowrap flex-wrap">
      <Card className="w-full py-5 group">
        <Image
          alt="Card background"
          className="object-cover rounded-xl opacity-30 transform group-hover:scale-105 group-hover:opacity-50 transition-transform duration-300"
          src="/imgs/account.png"
          layout="fill"
        />
        <CardBody className="flex justify-around items-center">
          <div className="flex-col">
            <p className="text-tiny uppercase font-bold">Account</p>
            <small className="text-default-500">More information ...</small>
            <h4 className="font-bold text-large">{invoice.account}</h4>
          </div>
          <AiTwotoneBank className="mr-2 text-gray-600" size={80} />
        </CardBody>
      </Card>

      <Card className="w-full py-5 group">
        <Image
          alt="Card background"
          className="object-cover rounded-xl opacity-30 transform group-hover:scale-105 group-hover:opacity-50 transition-transform duration-300"
          src="/imgs/account.png"
          layout="fill"
        />
        <CardBody className="flex justify-around items-center">
          <div className="flex-col">
            <p className="text-tiny uppercase font-bold">Account</p>
            <small className="text-default-500">More information ...</small>
            <h4 className="font-bold text-large">{invoice.account}</h4>
          </div>
          <AiTwotoneBank className="mr-2 text-gray-600" size={80} />
        </CardBody>
      </Card>
    </div>
  );
};
