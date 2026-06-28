"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
  meta?: string;
}

/** Sticky table of contents with scroll-spy active highlight. */
export function Toc({ items, className }: { items: TocItem[]; className?: string }) {
  const [active, setActive] = React.useState(items[0]?.id);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className={cn("flex flex-col gap-1", className)} aria-label="Содержание">
      {items.map((item) => {
        const isActive = item.id === active;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            data-active={isActive || undefined}
            className={cn(
              "border-l-2 py-1.5 pl-3 font-mono text-xs tracking-[var(--ls-mono)] transition-colors",
              isActive
                ? "border-accent text-text"
                : "border-[color:var(--border)] text-text-muted hover:text-text",
            )}
          >
            {item.meta ? (
              <span className="mr-2 text-text-faint tabular">{item.meta}</span>
            ) : null}
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
