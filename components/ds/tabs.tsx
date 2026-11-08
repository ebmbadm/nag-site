import * as React from "react";
import { cn } from "@/lib/utils";

export type TabItem = { label: string; href: string; current?: boolean };
export type TabsProps = { items: TabItem[]; label?: string; className?: string };

/** In-page links (Характеристики · Фото · Документы). Current item: 2px ink underline, never red. */
export function Tabs({ items, label = "Разделы страницы", className }: TabsProps) {
  return (
    <nav aria-label={label} className={cn("flex flex-wrap gap-x-8 gap-y-1 border-b border-line text-base", className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={cn(
            "-mb-px border-b-2 py-3 no-underline transition-quick hover:text-ink",
            item.current ? "border-ink font-medium text-ink" : "border-transparent text-ink-2",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
