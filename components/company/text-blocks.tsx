import * as React from "react";
import { Figure, Prose } from "@/components/ds";
import type { HistoryBlock } from "@/lib/content/types";

/** Only **bold** inline markup, as in the content modules. */
function inline(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i}>{part.slice(2, -2)}</strong>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  );
}

/**
 * Prose blocks for the service pages and the Class-TD article, in the new system.
 * components/history/blocks.tsx stays with the history page (separate editorial project).
 */
export function TextBlocks({ blocks }: { blocks: HistoryBlock[] }) {
  return (
    <Prose>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "p":
            return <p key={i}>{inline(block.text)}</p>;
          case "quote":
            return (
              <blockquote key={i}>
                <p className="text-site-lead">{block.text}</p>
              </blockquote>
            );
          case "stats":
            return (
              <dl key={i} className="mt-6 mb-0 flex flex-wrap gap-x-10 gap-y-4 border-y border-line py-4">
                {block.items.map((item) => (
                  <div key={item.label} className="flex flex-col-reverse">
                    <dt className="text-site-small text-ink-2">{item.label}</dt>
                    <dd className="m-0 text-site-title">{item.value}</dd>
                  </div>
                ))}
              </dl>
            );
          case "figure":
            return (
              <Figure
                key={i}
                src={block.src}
                alt={block.alt}
                caption={block.caption}
                width={block.width}
                height={block.height}
                className={
                  block.displaySize === "native" || block.displaySize === "compact"
                    ? "mx-auto mt-8 max-w-sm"
                    : block.displaySize === "reduced"
                      ? "mx-auto mt-8 w-4/5"
                      : "mt-8"
                }
              />
            );
        }
      })}
    </Prose>
  );
}
