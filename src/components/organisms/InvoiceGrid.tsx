"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pagination } from "@heroui/react";
import { useTranslations } from "next-intl";
import type { Invoice } from "@prisma/client";
import { ConceptBadge } from "@/components/molecules/ConceptBadge";
import { Button } from "@/components/atoms/Button";
import { deleteInvoice } from "@/actions/invoices/delete-invoice";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

interface InvoiceGridProps {
  invoices: Invoice[];
  totalPages: number;
  currentPage: number;
}

export function InvoiceGrid({ invoices, totalPages, currentPage }: InvoiceGridProps) {
  const t = useTranslations("invoice");
  const router = useRouter();

  async function handleDelete(id: string) {
    await deleteInvoice(id);
    router.refresh();
  }

  if (invoices.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-foreground-400">
        <p className="text-lg">{t("title")} — no hay nada todavía</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {invoices.map((invoice) => (
          <div
            key={invoice.id}
            className="rounded-2xl border border-divider bg-content1 p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{invoice.place}</p>
                <p className="text-sm text-foreground-400">
                  {new Date(invoice.date).toLocaleDateString()}
                </p>
              </div>
              <span className="text-lg font-bold">€{invoice.total.toFixed(2)}</span>
            </div>

            <div className="mb-3 flex flex-wrap items-center gap-2">
              <ConceptBadge concept={invoice.concept} />
              {invoice.isReimbursable && (
                <span className="rounded-full bg-warning-100 px-2 py-0.5 text-xs text-warning-700">
                  {t("reimbursable")}
                </span>
              )}
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                href={`/invoices/${invoice.id}/edit`}
                size="sm"
                variant="ghost"
                isIconOnly
                aria-label={t("edit")}
              >
                <FaPencilAlt />
              </Button>
              <Button
                size="sm"
                variant="danger"
                isIconOnly
                aria-label={t("delete")}
                onPress={() => handleDelete(invoice.id)}
              >
                <FaTrash />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <Pagination.Content>
              <Pagination.Item>
                <Pagination.Previous
                  onClick={() => router.push(`?page=${Math.max(1, currentPage - 1)}`)}
                >
                  <Pagination.PreviousIcon />
                </Pagination.Previous>
              </Pagination.Item>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Pagination.Item key={page}>
                  <Pagination.Link
                    isActive={page === currentPage}
                    onClick={() => router.push(`?page=${page}`)}
                  >
                    {page}
                  </Pagination.Link>
                </Pagination.Item>
              ))}
              <Pagination.Item>
                <Pagination.Next
                  onClick={() => router.push(`?page=${Math.min(totalPages, currentPage + 1)}`)}
                >
                  <Pagination.NextIcon />
                </Pagination.Next>
              </Pagination.Item>
            </Pagination.Content>
          </Pagination>
        </div>
      )}
    </div>
  );
}
