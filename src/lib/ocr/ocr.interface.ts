export interface ExtractedInvoiceData {
  total?: number;
  vat?: number;
  place?: string;
  date?: string;
  nif?: string;
}

export interface OcrProvider {
  extractInvoiceData(imageBuffer: Buffer): Promise<ExtractedInvoiceData>;
}
