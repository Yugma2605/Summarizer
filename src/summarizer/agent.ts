import {
  OpenAIModelProvider,
  createZypherContext,
  ZypherAgent,
} from "@corespeed/zypher";

import { getRequiredEnv } from "../config.ts";

export async function createAgent() {
  const context = await createZypherContext(Deno.cwd(), {
    zypherDir: "./.zypher-data",
  });

  const provider = new OpenAIModelProvider({
    apiKey: getRequiredEnv("GEMINI_API_KEY"),
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai/",
  });

  return new ZypherAgent(context, provider);
}
