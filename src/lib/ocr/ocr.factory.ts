import type { OcrProvider } from "./ocr.interface";
import { TesseractProvider } from "./tesseract.provider";

export class OcrProviderFactory {
  static create(provider = process.env.OCR_PROVIDER ?? "tesseract"): OcrProvider {
    switch (provider) {
      case "tesseract":
        return new TesseractProvider();
      default:
        throw new Error(`Unknown OCR provider: ${provider}`);
    }
  }
}
