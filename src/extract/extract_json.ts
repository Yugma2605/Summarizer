import { ExtractResult } from "../types.ts";

export async function extractTextFromJson(filePath: string): Promise<ExtractResult> {
  const raw = await Deno.readTextFile(filePath);
  try {
    const parsed = JSON.parse(raw);
    return { text: JSON.stringify(parsed, null, 2) };
  } catch {
    return { text: raw, notes: "Invalid JSON, returning raw content" };
  }
}
