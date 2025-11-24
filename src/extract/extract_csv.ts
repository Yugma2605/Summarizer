import { ExtractResult } from "../types.ts";

export async function extractTextFromCsv(filePath: string): Promise<ExtractResult> {
  const raw = await Deno.readTextFile(filePath);
  return { text: raw };
}
