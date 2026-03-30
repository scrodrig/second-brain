import { getInvoiceById } from "@/actions/invoices/get-invoice-by-id";
import { InvoiceForm } from "@/components/organisms/InvoiceForm";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function EditInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("invoice");
  const { id } = await params;
  const invoice = await getInvoiceById(id).catch(() => null);
  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="font-heading mb-6 text-2xl font-bold">{t("edit")}</h1>
      <InvoiceForm invoice={invoice} />
    </div>
  );
}
