import "jsr:@std/dotenv/load";
import { pdfText } from "jsr:@pdf/pdftext@1.3.2";

import {
  OpenAIModelProvider,
  createZypherContext,
  ZypherAgent,
} from "@corespeed/zypher";
import { eachValueFrom } from "rxjs-for-await";

import { walk } from "https://deno.land/std@0.203.0/fs/walk.ts";
import * as path from "https://deno.land/std@0.203.0/path/mod.ts";
import { ensureDir } from "https://deno.land/std@0.203.0/fs/ensure_dir.ts";

type ExtractResult = { text: string; notes?: string };

function getRequiredEnv(name: string): string {
  const v = Deno.env.get(name);
  if (!v) throw new Error(`Environment variable ${name} is not set`);
  return v;
}

const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));

// Input dir relative to where script lives
const INPUT_DIR = Deno.args[0]
  ? path.join(SCRIPT_DIR, Deno.args[0])
  : SCRIPT_DIR;const OUTPUT_BASE = "summaries";
const ALLOWED_EXT = new Set([".md", ".markdown", ".txt", ".pdf", ".docx", ".json", ".csv"]);

// Zypher context
const zypherContext = await createZypherContext(Deno.cwd(), {
  zypherDir: "./.zypher-data"
});


// Gemini provider
const provider = new OpenAIModelProvider({
  apiKey: getRequiredEnv("GEMINI_API_KEY"),
  baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const agent = new ZypherAgent(zypherContext, provider);


async function extractTextFromTxtOrMd(filePath: string): Promise<ExtractResult> {
  const text = await Deno.readTextFile(filePath);
  return { text };
}

async function extractTextFromJson(filePath: string): Promise<ExtractResult> {
  const raw = await Deno.readTextFile(filePath);
  try {
    const parsed = JSON.parse(raw);
    return { text: JSON.stringify(parsed, null, 2) };
  } catch {
    return { text: raw, notes: "Invalid JSON; returned raw content" };
  }
}

async function extractTextFromCsv(filePath: string): Promise<ExtractResult> {
  const raw = await Deno.readTextFile(filePath);
  return { text: raw };
}

async function extractTextFromPdf(filePath: string): Promise<ExtractResult> {
  try {
    const data = await Deno.readFile(filePath);
    const pages = await pdfText(new Uint8Array(data));
    // pages is an object mapping pageNumber to text
    const all = Object.values(pages).join("\n\n");
    return { text: all.trim() };
  } catch (err) {
    console.warn("PDF extraction failed for", filePath, ":", err?.message ?? err);
    return { text: "", notes: "PDF extraction skipped or failed" };
  }
}

async function extractTextFromDocx(filePath: string): Promise<ExtractResult> {
  try {
    const mammoth = (await import("npm:mammoth")).default ?? (await import("npm:mammoth"));
    const array = await Deno.readFile(filePath);
    const res: any = await mammoth.extractRawText({ buffer: Buffer.from(array) });
    return { text: String(res.value ?? "").trim() };
  } catch (err) {
    console.warn("DOCX extraction failed for", filePath, ":", err?.message ?? err);
    return { text: "", notes: "DOCX extraction skipped or failed" };
  }
}

async function extractText(filePath: string): Promise<ExtractResult> {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".md":
    case ".markdown":
    case ".txt":
      return extractTextFromTxtOrMd(filePath);
    case ".json":
      return extractTextFromJson(filePath);
    case ".csv":
      return extractTextFromCsv(filePath);
    case ".pdf":
      return extractTextFromPdf(filePath);
    case ".docx":
      return extractTextFromDocx(filePath);
    default:
      return { text: "" };
  }
}

// --- Summarization Prompt ---

function makeSummaryPrompt(relPath: string, ext: string, textPreview: string, notes?: string) {
  const preview = textPreview.length > 120_000 ? textPreview.slice(0, 120_000) + "\n\n...[truncated]" : textPreview;
  const noteLine = notes ? `Note: ${notes}\n\n` : "";

  return `${noteLine}You are an expert summarizer and document analyzer.
File path: ${relPath}
Detected extension: ${ext}
Please produce output in markdown with three clearly labeled sections:

Summary:
- One short paragraph (2-4 sentences) capturing the main idea and purpose of the document.

Key Points:
- 4-6 concise bullet points listing the most important facts, steps, or conclusions.

Suggested Tags:
- 3-6 short tags or keywords suitable for indexing or search.

Instructions:
- Do not invent facts. If information is missing, say "information not present".
- If content is mostly code, describe the code's purpose and main functions/classes.
- If the content is truncated, indicate that at the top of the Summary.

Here is the extracted content (or preview) between triple backticks:

\`\`\`
${preview}
\`\`\`
`;
}

// --- Run Agent ---

async function runAgentAndCollect(prompt: string, model = "gemini-2.0-flash"): Promise<string> {
  const event$ = agent.runTask(prompt, model);
  let collected = "";
  try {
    for await (const ev of eachValueFrom(event$)) {
      console.log("EVENT:", JSON.stringify(ev, null, 2));

      if (ev?.type === "message" && ev?.message?.role === "assistant") {
        for (const chunk of ev.message.content ?? []) {
          if (chunk?.type === "text" && typeof chunk.text === "string") {
            collected += chunk.text;
            await Deno.stdout.write(new TextEncoder().encode(chunk.text));
          }
        }
        if (ev.message.stop_reason) break;
      }
    }
  } catch (err) {
    console.error("Agent stream error:", err);
  }
  return collected.trim();
}

// --- Process Single File ---

async function processFile(filePath: string) {
  const relPath = path.relative(INPUT_DIR, filePath);
  console.log(`\nProcessing: ${relPath}\n`);

  try {
    const ext = path.extname(filePath).toLowerCase();
    const extracted = await extractText(filePath);

    if (!extracted.text || extracted.text.trim().length === 0) {
      console.warn(`No extractable text for ${relPath}. Skipping. Notes: ${extracted.notes ?? "none"}`);
      return;
    }

    const preview = extracted.text.length > 160_000 ? extracted.text.slice(0, 160_000) : extracted.text;
    const prompt = makeSummaryPrompt(relPath, ext, preview, extracted.notes);
    const assistantOutput = await runAgentAndCollect(prompt, "gemini-2.0-flash");

    let safeRelPath = relPath.replace(/[\\/]/g, "_"); // flatten path
    safeRelPath = safeRelPath.replace(/^[_\.]+/, "");  // remove leading underscores/dots
    const outPath = path.join(OUTPUT_BASE, safeRelPath + ".summary.md");

    await ensureDir(path.dirname(outPath));
    await Deno.writeTextFile(outPath, assistantOutput);

    console.log(`\nSaved summary -> ${outPath}\n`);
  } catch (err) {
    console.error(`Failed processing ${relPath}:`, err);
  }
}

// --- Main ---

async function main() {
  console.log("Zypher Multi-format Summarizer starting");
  console.log("Input folder:", path.resolve(INPUT_DIR));
  console.log("Looking for files with extensions:", Array.from(ALLOWED_EXT).join(", "));

  let foundAny = false;

  for await (const entry of walk(INPUT_DIR, { includeDirs: false, maxDepth: 10 })) {
    const p = entry.path;
    if (p.includes("node_modules") || p.includes(".git") || p.includes(OUTPUT_BASE)) continue;

    const ext = path.extname(p).toLowerCase();
    if (!ALLOWED_EXT.has(ext)) continue;

    foundAny = true;
    await processFile(p);
  }

  if (!foundAny) {
    console.log("No supported files found. Try running with a folder containing md, txt, pdf, docx, json, or csv files.");
  } else {
    console.log("All done.");
  }
}

if (import.meta.main) {
  await main();
}
