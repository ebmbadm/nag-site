import * as React from "react";
import { cn } from "@/lib/utils";

/*
 * Frozen copies of the pre-redesign primitives. Only the «История» section uses them:
 * the owner froze its visual layer until the separate project «История, часть II».
 * Everything here renders inside the `.legacy` scope set by app/istoriya/layout.tsx.
 */

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("mx-auto w-full px-[var(--gutter)]", className)}
      style={{ maxWidth: "var(--container)" }}
      {...props}
    />
  );
}

export function Eyebrow({
  className,
  accent,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { accent?: boolean }) {
  return (
    <span
      className={cn(
        "font-mono text-xs uppercase tracking-[var(--ls-label)]",
        accent ? "text-accent" : "text-text-faint",
        className,
      )}
      {...props}
    />
  );
}
