import { eachValueFrom } from "rxjs-for-await";

export async function runAgent(agent: any, prompt: string, model = "gemini-2.0-flash") {
  const event$ = agent.runTask(prompt, model);
  let collected = "";

  for await (const ev of eachValueFrom(event$)) {
    if (ev?.type === "message" && ev?.message?.role === "assistant") {
      for (const chunk of ev.message.content ?? []) {
        if (chunk?.type === "text") {
          collected += chunk.text;
          await Deno.stdout.write(new TextEncoder().encode(chunk.text));
        }
      }
      if (ev.message.stop_reason) break;
    }
  }

  return collected.trim();
}
