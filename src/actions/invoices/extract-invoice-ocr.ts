"use server";

import { auth } from "@/lib/auth";
import { OcrProviderFactory } from "@/lib/ocr/ocr.factory";

export async function extractInvoiceOcr(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const file = formData.get("image") as File;
  if (!file) throw new Error("No image provided");

  const buffer = Buffer.from(await file.arrayBuffer());
  const ocr = OcrProviderFactory.create();

  return ocr.extractInvoiceData(buffer);
}
