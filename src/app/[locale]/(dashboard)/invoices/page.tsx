import { getInvoices } from "@/actions/invoices/get-invoices";
import { InvoiceGrid } from "@/components/organisms/InvoiceGrid";
import { Button } from "@/components/atoms/Button";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { FaPlus } from "react-icons/fa";

export default async function InvoicesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const t = await getTranslations("invoice");
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const { invoices, totalPages, currentPage } = await getInvoices(page);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{t("title")}</h1>
        <Button
          as={Link}
          href="/invoices/new"
          color="primary"
          startContent={<FaPlus />}
        >
          {t("new")}
        </Button>
      </div>
      <InvoiceGrid invoices={invoices} totalPages={totalPages} currentPage={currentPage} />
    </div>
  );
}
