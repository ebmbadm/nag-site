import { readFileSync } from "node:fs";
import { join } from "node:path";
import { parseHistory2, renderHistory2 } from "@/lib/content/history-2";

export const dynamic = "force-static";

export function GET() {
  const source = readFileSync(join(process.cwd(), "content", "company", "istoriya-2.md"), "utf8");
  return new Response(renderHistory2(parseHistory2(source)), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=0, must-revalidate",
    },
  });
}
