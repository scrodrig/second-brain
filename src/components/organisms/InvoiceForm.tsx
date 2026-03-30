"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Concept, type Invoice } from "@prisma/client";
import { Input } from "@/components/atoms/Input";
import { Button } from "@/components/atoms/Button";
import { OcrScanSection } from "./OcrScanSection";
import { ConceptBadge } from "@/components/molecules/ConceptBadge";
import { InvoiceSchema, type InvoiceInput } from "@/lib/schemas/invoice.schema";
import { createInvoice } from "@/actions/invoices/create-invoice";
import { updateInvoice } from "@/actions/invoices/update-invoice";
import { CONCEPT_CONFIG } from "@/lib/concept-config";
import type { ExtractedInvoiceData } from "@/lib/ocr/ocr.interface";
import { cn } from "@/lib/utils";

interface InvoiceFormProps {
  invoice?: Invoice;
}

export function InvoiceForm({ invoice }: InvoiceFormProps) {
  const t = useTranslations("invoice");
  const router = useRouter();
  const isEditing = !!invoice;

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InvoiceInput>({
    resolver: zodResolver(InvoiceSchema),
    defaultValues: invoice
      ? {
          place: invoice.place,
          nif: invoice.nif,
          concept: invoice.concept,
          accountType: invoice.accountType,
          total: invoice.total,
          date: invoice.date,
          description: invoice.description ?? undefined,
          isReimbursable: invoice.isReimbursable,
          isRefunded: invoice.isRefunded,
          vatRefund: invoice.vatRefund ?? undefined,
        }
      : {
          isReimbursable: false,
          isRefunded: false,
          date: new Date(),
        },
  });

  function handleOcrExtracted(data: ExtractedInvoiceData) {
    if (data.total) setValue("total", data.total);
    if (data.nif) setValue("nif", data.nif);
    if (data.place) setValue("place", data.place);
  }

  async function onSubmit(data: InvoiceInput) {
    if (isEditing) {
      await updateInvoice(invoice.id, data);
    } else {
      await createInvoice(data);
    }
    router.push("/invoices");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <OcrScanSection onExtracted={handleOcrExtracted} />

      <Input
        label={t("place")}
        {...register("place")}
        errorMessage={errors.place?.message}
        isInvalid={!!errors.place}
      />
      <Input
        label={t("nif")}
        {...register("nif")}
        errorMessage={errors.nif?.message}
        isInvalid={!!errors.nif}
      />
      <Input
        label={t("total")}
        type="number"
        step="0.01"
        {...register("total", { valueAsNumber: true })}
        errorMessage={errors.total?.message}
        isInvalid={!!errors.total}
        startContent={<span className="text-foreground-400 text-sm">€</span>}
      />

      <div>
        <p className="text-sm font-medium mb-2">{t("concept")}</p>
        <Controller
          name="concept"
          control={control}
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {Object.values(Concept).map((c) => {
                const config = CONCEPT_CONFIG[c];
                const Icon = config.icon;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => field.onChange(c)}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl border-2 p-3 transition-all",
                      field.value === c
                        ? "border-primary bg-primary/10"
                        : "border-divider hover:border-primary/40"
                    )}
                  >
                    <Icon className="text-lg" />
                    <ConceptBadge concept={c} showTooltip={false} />
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="ghost"
          onPress={() => router.back()}
          fullWidth
        >
          {t("cancel")}
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting} fullWidth>
          {t("save")}
        </Button>
      </div>
    </form>
  );
}
