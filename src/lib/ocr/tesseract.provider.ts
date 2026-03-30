import Tesseract from "tesseract.js";
import type { OcrProvider, ExtractedInvoiceData } from "./ocr.interface";

export class TesseractProvider implements OcrProvider {
  async extractInvoiceData(imageBuffer: Buffer): Promise<ExtractedInvoiceData> {
    const { data: { text } } = await Tesseract.recognize(imageBuffer, "spa+eng");
    return this.parseText(text);
  }

  private parseText(text: string): ExtractedInvoiceData {
    const result: ExtractedInvoiceData = {};

    const totalMatch = text.match(/total[:\s]+([0-9]+[.,][0-9]{2})/i);
    if (totalMatch) result.total = parseFloat(totalMatch[1].replace(",", "."));

    const vatMatch = text.match(/iva[:\s]+([0-9]+[.,][0-9]{2})/i);
    if (vatMatch) result.vat = parseFloat(vatMatch[1].replace(",", "."));

    const nifMatch = text.match(/[A-Z][0-9]{7}[A-Z0-9]|[0-9]{8}[A-Z]/);
    if (nifMatch) result.nif = nifMatch[0];

    return result;
  }
}
