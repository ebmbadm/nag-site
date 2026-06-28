import { istoriya } from "@/content/company/istoriya";
import type { HistoryContent } from "./types";

/** Company history content (typed data module pattern). */
export function getHistory(): HistoryContent {
  return istoriya;
}
