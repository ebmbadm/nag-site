import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Prose wrapper — styles MDX body output with DS type scale.
 * Wrap any rendered <Mdx /> output in this component.
 */
export function Prose({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "max-w-prose",
        // Headings
        "[&_h2]:mt-8 [&_h2]:font-display [&_h2]:uppercase [&_h2]:text-text [&_h2]:text-xl [&_h2]:tracking-[var(--ls-tight)] [&_h2]:leading-[var(--lh-tight)]",
        "[&_h3]:mt-6 [&_h3]:font-display [&_h3]:uppercase [&_h3]:text-text [&_h3]:text-lg [&_h3]:tracking-[var(--ls-tight)]",
        // Body
        "[&_p]:mt-4 [&_p]:text-base [&_p]:text-text",
        // Lists
        "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mt-1.5 [&_ul_li]:text-base [&_ul_li]:text-text",
        "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mt-1.5 [&_ol_li]:text-base [&_ol_li]:text-text",
        // Blockquote
        "[&_blockquote]:mt-6 [&_blockquote]:border-l-[3px] [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:text-text-muted [&_blockquote]:italic",
        // Inline
        "[&_strong]:font-semibold [&_strong]:text-text",
        "[&_a]:text-accent [&_a]:underline-offset-2 hover:[&_a]:underline",
        "[&_code]:font-mono [&_code]:text-sm [&_code]:text-text-muted [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-[var(--radius-xs)]",
        className,
      )}
      style={{ lineHeight: "var(--lh-relaxed)" }}
      {...props}
    />
  );
}
