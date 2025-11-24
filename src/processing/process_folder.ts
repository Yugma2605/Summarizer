import { walk } from "https://deno.land/std/fs/walk.ts";
import * as path from "https://deno.land/std/path/mod.ts";
import { ALLOWED_EXT } from "../config.ts";
import { processFile } from "./process_file.ts";

export async function processFolder(agent: any, inputDir: string) {
  let found = false;

  for await (const entry of walk(inputDir, { includeDirs: false, maxDepth: 10 })) {
    const p = entry.path;

    if (p.includes("node_modules") || p.includes(".git") || p.includes("summaries")) {
      continue;
    }

    const ext = path.extname(p).toLowerCase();

    if (!ALLOWED_EXT.has(ext)) continue;

    found = true;
    await processFile(agent, inputDir, p);
  }

  if (!found) {
    console.log("No supported files found in", inputDir);
  } else {
    console.log("Done processing folder");
  }
}
