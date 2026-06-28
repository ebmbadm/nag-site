import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Disclosure built on native <details> — works without JS.
 * Page-level "expand/collapse all" toggles operate on these via the DOM.
 */
export function AccordionItem({
  summary,
  eyebrow,
  defaultOpen,
  className,
  summaryClassName,
  children,
  ...props
}: React.DetailsHTMLAttributes<HTMLDetailsElement> & {
  summary: React.ReactNode;
  eyebrow?: React.ReactNode;
  defaultOpen?: boolean;
  summaryClassName?: string;
}) {
  return (
    <details
      open={defaultOpen}
      className={cn("group border-t border-border", className)}
      {...props}
    >
      <summary
        className={cn(
          "flex items-center gap-4 py-5 text-text transition-colors hover:[&_.nag-sumtitle]:text-accent",
          summaryClassName,
        )}
      >
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <div className="mb-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
              {eyebrow}
            </div>
          ) : null}
          <div
            className="nag-sumtitle font-display text-xl uppercase transition-colors"
            style={{ letterSpacing: "var(--ls-tight)" }}
          >
            {summary}
          </div>
        </div>
        <ChevronDown
          className="nag-chev size-5 shrink-0 text-text-faint transition-transform duration-[var(--dur-base)] group-open:rotate-180 group-open:text-text"
          aria-hidden
        />
      </summary>
      <div className="pb-6 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
        {children}
      </div>
    </details>
  );
}
