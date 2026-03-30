import { InvoiceForm } from "@/components/organisms/InvoiceForm";
import { getTranslations } from "next-intl/server";

export default async function NewInvoicePage() {
  const t = await getTranslations("invoice");
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-heading mb-6 text-2xl font-bold">{t("new")}</h1>
      <InvoiceForm />
    </div>
  );
}
