"use client";

import { ACCOUNT_UI_ITEMS, CONCEPT_UI_ITEMS } from "@/utils";
import { Account, Concept, Invoice } from "@/interfaces";
import { Button, Input, RadioGroup, Textarea } from "@nextui-org/react";

import { BlockRadio } from "@/components";
import { Form } from "@nextui-org/form";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface Props {
  invoice: Partial<Invoice>;
  concepts: Concept[];
  accounts: Account[];
}

interface FormInputs {
  date: Date;
  place: string;
  NIF: string;
  concept: Concept;
  description: string;
  owner: string;
  account: Account;
  total: number;
  isReembursable: boolean;
  isRefunded: boolean;
  vatRefund: boolean;
}

export const InvoiceForm = ({ invoice, concepts, accounts }: Props) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      ...invoice,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <Form
      onSubmit={handleSubmit(onSubmit)}
      method="post"
      validationBehavior="native"
      className="grid px-5 mb-16 grid-cols-1 sm:px-0 sm:grid-cols-2 gap-3"
    >
      <div className="w-full">
        <div className="flex flex-col mb-2">
          <Input
            isRequired
            size="lg"
            errorMessage="Please enter a valid NIF"
            isInvalid={!!errors.NIF}
            placeholder="Enter the business NIF"
            label="NIF"
            labelPlacement="outside"
            type="text"
            {...register("NIF", { required: true, minLength: 9 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <Input
            isRequired
            size="lg"
            errorMessage="Please enter a valid place"
            isInvalid={!!errors.place}
            label="Place"
            labelPlacement="outside"
            placeholder="Enter the business name"
            type="text"
            {...register("place", { required: true, maxLength: 50 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <Input
            isRequired
            size="lg"
            errorMessage="Please enter a valid owner"
            isInvalid={!!errors.owner}
            label="Owner"
            labelPlacement="outside"
            placeholder="Enter the owner"
            type="text"
            {...register("owner", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <Input
            isRequired
            size="lg"
            errorMessage="Please enter a valid total amount"
            isInvalid={!!errors.total}
            label="Total"
            labelPlacement="outside"
            placeholder="Enter the total amount"
            type="number"
            {...register("total", { required: true, min: 0 })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <Input
            isRequired
            size="lg"
            errorMessage="Please enter a valid date"
            isInvalid={!!errors.date}
            label="Date"
            labelPlacement="outside"
            type="date"
            {...register("date", { required: true })}
          />
        </div>

        <div className="flex flex-col mb-2">
          <Textarea
            maxRows={5}
            size="lg"
            label="Description"
            errorMessage="Please, do not exceed 200 characters"
            isInvalid={!!errors.description}
            labelPlacement="outside"
            placeholder="Enter the description"
            {...register("description", { maxLength: 200 })}
          ></Textarea>
        </div>
      </div>

      <div className="w-full">
        <div className="mb-2">
          <RadioGroup
            color="primary"
            size="lg"
            label="What is the concept?"
            errorMessage="Please select a concept"
            isInvalid={!!errors.concept}
            {...register("concept", { required: true })}
          >
            {concepts?.map((concept) => (
              <BlockRadio key={concept} value={concept}>
                <div className="flex items-center">
                  {CONCEPT_UI_ITEMS[concept].icon}
                  {concept}
                </div>
              </BlockRadio>
            ))}
          </RadioGroup>
        </div>

        <div className="mb-2">
          <RadioGroup
            color="primary"
            label="What is the account?"
            errorMessage="Please select an account"
            isInvalid={!!errors.account}
            {...register("account", { required: true })}
          >
            {accounts?.map((account) => (
              <BlockRadio
                key={account}
                description={`This expense was issued by ${account}`}
                value={account}
              >
                <div className="flex items-center">
                  {ACCOUNT_UI_ITEMS[account].icon}
                  {account}
                </div>
              </BlockRadio>
            ))}
          </RadioGroup>
        </div>
      </div>

      <Button type="submit" variant="flat" color="primary" className="w-full">
        Save
      </Button>
    </Form>
  );
};
