import { ExtractResult } from "../types.ts";

export async function extractTextFromDocx(filePath: string): Promise<ExtractResult> {
  try {
    const mammoth = (await import("npm:mammoth")).default;
    const array = await Deno.readFile(filePath);
    const res: any = await mammoth.extractRawText({ buffer: Buffer.from(array) });
    return { text: String(res.value ?? "").trim() };
  } catch (err) {
    console.warn("DOCX extraction failed for", filePath, ":", err?.message ?? err);
    return { text: "", notes: "DOCX extraction failed" };
  }
}
