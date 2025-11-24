import * as path from "https://deno.land/std/path/mod.ts";

export const SCRIPT_DIR = path.dirname(path.fromFileUrl(import.meta.url));

export function resolveInputDir(arg?: string): string {
  if (!arg) return Deno.cwd();

  // If user types /folder, treat it as relative, not absolute
  if (arg.startsWith("/")) {
    return path.join(Deno.cwd(), arg.slice(1));
  }

  // Normal relative or absolute path resolution
  return path.resolve(Deno.cwd(), arg);
}
