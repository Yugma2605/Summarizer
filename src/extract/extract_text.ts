import * as path from "https://deno.land/std/path/mod.ts";
import { ExtractResult } from "../types.ts";

import { extractTextFromTxtOrMd } from "./extract_txt_md.ts";
import { extractTextFromJson } from "./extract_json.ts";
import { extractTextFromCsv } from "./extract_csv.ts";
import { extractTextFromPdf } from "./extract_pdf.ts";
import { extractTextFromDocx } from "./extract_docx.ts";

export async function extractText(filePath: string): Promise<ExtractResult> {
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
      return { text: "", notes: "Unsupported extension" };
  }
}
