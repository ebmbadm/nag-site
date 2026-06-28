import { Figure } from "@/components/ds";
import { renderInline } from "./rich-text";
import type { HistoryBlock } from "@/lib/content/types";

/** Render one history content block. */
export function Block({ block }: { block: HistoryBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p className="mb-5 text-text" style={{ fontSize: "var(--text-md)", lineHeight: 1.72 }}>
          {renderInline(block.text)}
        </p>
      );

    case "quote":
      return (
        <blockquote className="my-8 border-l-[var(--border-w-rule)] border-accent pl-6">
          <p
            className="font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-lg), 3vw, var(--text-xl))", lineHeight: 1.24, letterSpacing: "-0.01em" }}
          >
            {block.text}
          </p>
        </blockquote>
      );

    case "stats":
      return (
        <div className="my-7 flex flex-wrap gap-x-8 gap-y-4 border-y border-border py-4 font-mono">
          {block.items.map((item, i) => (
            <span key={i} className="flex flex-col gap-1">
              <b className="font-medium text-text tabular" style={{ fontSize: "var(--text-lg)" }}>
                {item.value}
              </b>
              <span className="text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{item.label}</span>
            </span>
          ))}
        </div>
      );

    case "figure":
      return <Figure src={block.src} alt={block.alt} caption={block.caption} className="my-8" />;
  }
}
