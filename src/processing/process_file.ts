import * as path from "https://deno.land/std/path/mod.ts";
import { ExtractResult } from "../types.ts";
import { extractText } from "../extract/extract_text.ts";
import { makeSummaryPrompt } from "../summarizer/prompt.ts";
import { runAgent } from "../summarizer/run_agent.ts";
import { OUTPUT_BASE } from "../config.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";

export async function processFile(agent: any, inputDir: string, filePath: string) {
  const relPath = path.relative(inputDir, filePath);
  console.log("Processing:", relPath);

  const extracted: ExtractResult = await extractText(filePath);

  if (!extracted.text?.trim()) {
    console.warn("No extractable text for", relPath, "-", extracted.notes);
    return;
  }

  const preview = extracted.text.length > 160000
    ? extracted.text.slice(0, 160000)
    : extracted.text;

  const prompt = makeSummaryPrompt(relPath, path.extname(filePath), preview, extracted.notes);

  const result = await runAgent(agent, prompt);

  let safeName = relPath.replace(/[\\/]/g, "_");
  safeName = safeName.replace(/^[_\.]+/, "");

  const outPath = path.join(OUTPUT_BASE, safeName + ".summary.md");

  await ensureDir(path.dirname(outPath));
  await Deno.writeTextFile(outPath, result);

  console.log("Saved summary ->", outPath);
}
