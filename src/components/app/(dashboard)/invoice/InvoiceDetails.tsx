import { Card, CardBody, CardHeader } from "@nextui-org/react";

import { AiTwotoneBank } from "react-icons/ai";
import Image from "next/image";
import { Invoice } from "@/interfaces";

interface Props {
  invoice: Invoice;
}
export const InvoiceDetails = ({ invoice }: Props) => {
  return (
    <div className="mt-10 flex flex-col justify-center">
      <div className="gap-5 text-5xl font-bold text-center">
        Invoice: # {invoice.id.split("-").slice(-1)}{" "}
      </div>

        <div className="mt-10 flex gap-10 sm:flex-nowrap flex-wrap">
          <Card className="group">
            <Image
              alt="Card background"
              className="object-cover rounded-xl opacity-30 transform group-hover:scale-105 group-hover:opacity-70 transition-transform duration-300"
              src="/imgs/account.png"
              width={250}
              height={250}
            />
            <CardBody className="flex flex-row justify-around items-center">
              <div className="flex-col">
                <p className="text-tiny uppercase font-bold">Account</p>
                <h4 className="font-bold text-large">{invoice.account}</h4>
              </div>
              <AiTwotoneBank className="mr-2 text-gray-300" size={80} />
            </CardBody>
          </Card>
        </div>
    </div>
  );
};
