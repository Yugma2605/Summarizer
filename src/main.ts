import { resolveInputDir } from "./paths.ts";
import { createAgent } from "./summarizer/agent.ts";
import { OUTPUT_BASE } from "./config.ts";
import { ensureDir } from "https://deno.land/std/fs/ensure_dir.ts";
import { processFolder } from "./processing/process_folder.ts";

if (import.meta.main) {
  console.log("Multi format summarizer starting");

  const inputDir = resolveInputDir(Deno.args[0]);
  console.log("Input folder:", inputDir);

  await ensureDir(OUTPUT_BASE);

  const agent = await createAgent();

  await processFolder(agent, inputDir);
}
