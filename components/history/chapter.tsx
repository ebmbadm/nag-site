import { ChevronDown } from "lucide-react";
import { Block } from "./blocks";
import type { HistoryChapter } from "@/lib/content/types";

/** One history chapter — native <details> with the red year column. */
export function Chapter({ chapter, first }: { chapter: HistoryChapter; first?: boolean }) {
  return (
    <section
      id={chapter.id}
      className="scroll-mt-24"
      style={{ borderTop: first ? "2px solid var(--text)" : "1px solid var(--border)" }}
    >
      <details open className="group">
        <summary className="flex items-start gap-[clamp(14px,3vw,28px)] py-7">
          <span
            className="shrink-0 font-display font-bold text-accent"
            style={{ fontSize: "clamp(var(--text-2xl), 6vw, var(--text-4xl))", lineHeight: 0.86 }}
          >
            {chapter.year}
          </span>
          <span className="min-w-0 flex-1">
            <span className="mb-2 block font-mono text-xs uppercase tracking-[var(--ls-label)] text-text-faint">
              {chapter.label}
            </span>
            <span
              className="nag-sumtitle block font-display font-semibold uppercase text-text transition-colors group-hover:text-accent"
              style={{ fontSize: "clamp(var(--text-xl), 3.6vw, var(--text-2xl))", lineHeight: 1.02, letterSpacing: "-0.01em" }}
            >
              {chapter.title}
            </span>
          </span>
          <ChevronDown
            className="mt-2 size-6 shrink-0 text-text-faint transition-transform duration-[var(--dur-base)] group-open:rotate-180 group-open:text-text"
            aria-hidden
          />
        </summary>
        <div className="pb-10">
          {chapter.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </details>
    </section>
  );
}
