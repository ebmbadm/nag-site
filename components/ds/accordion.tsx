import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/** Disclosure on native <details> — works without JS. */
export function AccordionItem({
  summary,
  defaultOpen,
  className,
  summaryClassName,
  children,
  ...props
}: React.DetailsHTMLAttributes<HTMLDetailsElement> & {
  summary: React.ReactNode;
  defaultOpen?: boolean;
  summaryClassName?: string;
}) {
  return (
    <details open={defaultOpen} className={cn("group border-t border-line last:border-b", className)} {...props}>
      <summary className={cn("flex items-center gap-4 py-4 text-site-body font-semibold text-ink", summaryClassName)}>
        <span className="min-w-0 flex-1 underline decoration-transparent transition-quick group-hover:decoration-current">{summary}</span>
        <ChevronDown size={20} strokeWidth={1.75} aria-hidden className="shrink-0 text-ink-2 transition-quick group-open:rotate-180" />
      </summary>
      <div className="pb-6 text-site-body text-ink-2">{children}</div>
    </details>
  );
}
