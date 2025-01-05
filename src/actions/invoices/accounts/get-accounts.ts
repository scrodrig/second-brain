"use server";

import { Account, Concept } from "@prisma/client";

const accounts: Account[] = ["Business", "Personal"];

export const getAccounts = async () => {
  return {
    accounts,
  };
};
