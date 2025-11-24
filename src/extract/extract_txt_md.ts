import { ExtractResult } from "../types.ts";

export async function extractTextFromTxtOrMd(filePath: string): Promise<ExtractResult> {
  const text = await Deno.readTextFile(filePath);
  return { text };
}
