import "jsr:@std/dotenv/load";

export const ALLOWED_EXT = new Set([
  ".md",
  ".markdown",
  ".txt",
  ".pdf",
  ".docx",
  ".json",
  ".csv",
]);

export function getRequiredEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error("Missing environment variable: " + name);
  return v;
}

export const OUTPUT_BASE = "summaries";
