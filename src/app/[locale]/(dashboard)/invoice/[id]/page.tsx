import { getInvoiceById } from "@/actions/invoices/get-invoice-by-id";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConceptBadge } from "@/components/molecules/ConceptBadge";
import { Button } from "@/components/atoms/Button";
import { FaPencilAlt } from "react-icons/fa";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getTranslations("invoice");
  const { id } = await params;
  const invoice = await getInvoiceById(id).catch(() => null);

  if (!invoice) notFound();

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl font-bold">{invoice.place}</h1>
        <Button
          as={Link}
          href={`/invoices/${invoice.id}/edit`}
          variant="flat"
          startContent={<FaPencilAlt />}
        >
          {t("edit")}
        </Button>
      </div>

      <div className="rounded-2xl border border-divider bg-content1 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-foreground-400 text-sm">{t("total")}</span>
          <span className="text-2xl font-bold">€{invoice.total.toFixed(2)}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-foreground-400 text-sm">{t("concept")}</span>
          <ConceptBadge concept={invoice.concept} />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-foreground-400 text-sm">{t("date")}</span>
          <span>{new Date(invoice.date).toLocaleDateString()}</span>
        </div>

        {invoice.nif && (
          <div className="flex items-center justify-between">
            <span className="text-foreground-400 text-sm">{t("nif")}</span>
            <span className="font-mono text-sm">{invoice.nif}</span>
          </div>
        )}

        {invoice.description && (
          <div className="flex flex-col gap-1">
            <span className="text-foreground-400 text-sm">{t("description")}</span>
            <p className="text-sm">{invoice.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-foreground-400 text-sm">{t("reimbursable")}</span>
          <span>{invoice.isReimbursable ? "✓" : "✗"}</span>
        </div>

        {invoice.isReimbursable && (
          <div className="flex items-center justify-between">
            <span className="text-foreground-400 text-sm">{t("refunded")}</span>
            <span>{invoice.isRefunded ? "✓" : "✗"}</span>
          </div>
        )}

        {invoice.vatRefund != null && (
          <div className="flex items-center justify-between">
            <span className="text-foreground-400 text-sm">{t("vatRefund")}</span>
            <span>€{invoice.vatRefund.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
