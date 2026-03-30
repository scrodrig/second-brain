"use client";

import { useTranslations } from "next-intl";
import { useRef } from "react";
import { FaCamera } from "react-icons/fa";
import { Button } from "@/components/atoms/Button";
import { extractInvoiceOcr } from "@/actions/invoices/extract-invoice-ocr";
import type { ExtractedInvoiceData } from "@/lib/ocr/ocr.interface";

interface OcrScanSectionProps {
  onExtracted: (data: ExtractedInvoiceData) => void;
}

export function OcrScanSection({ onExtracted }: OcrScanSectionProps) {
  const t = useTranslations("invoice");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const data = await extractInvoiceOcr(formData);
      onExtracted(data);
    } catch {
      // Silent fail — user fills manually
    }
  }

  return (
    <div className="mb-6 md:hidden">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        variant="flat"
        color="primary"
        startContent={<FaCamera />}
        onPress={() => inputRef.current?.click()}
        fullWidth
      >
        {t("scanReceipt")}
      </Button>
      <p className="mt-2 text-center text-xs text-foreground-400">
        {t("scanHint")}
      </p>
    </div>
  );
}
