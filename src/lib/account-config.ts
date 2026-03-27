import { FaUser, FaBriefcase } from "react-icons/fa";
import type { IconType } from "react-icons";
import { AccountType } from "@prisma/client";

interface AccountConfig {
  icon: IconType;
  color: "danger" | "success";
  description: { es: string; en: string; pt: string };
}

export const ACCOUNT_CONFIG: Record<AccountType, AccountConfig> = {
  Personal: {
    icon: FaUser,
    color: "danger",
    description: {
      es: "Gastos personales del día a día",
      en: "Day-to-day personal expenses",
      pt: "Despesas pessoais do dia a dia",
    },
  },
  Business: {
    icon: FaBriefcase,
    color: "success",
    description: {
      es: "Gastos de empresa reembolsables",
      en: "Reimbursable business expenses",
      pt: "Despesas empresariais reembolsáveis",
    },
  },
};
