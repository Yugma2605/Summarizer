import { ExtractResult } from "../types.ts";
import { pdfText } from "jsr:@pdf/pdftext@1.3.2";

export async function extractTextFromPdf(filePath: string): Promise<ExtractResult> {
  try {
    const data = await Deno.readFile(filePath);
    const pages = await pdfText(new Uint8Array(data));
    const all = Object.values(pages).join("\n\n");
    return { text: all.trim() };
  } catch (err) {
    console.warn("PDF extraction failed for", filePath, ":", err?.message ?? err);
    return { text: "", notes: "PDF extraction failed" };
  }
}
