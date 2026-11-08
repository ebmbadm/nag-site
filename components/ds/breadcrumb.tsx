import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = { label: string; href?: string };

/** Breadcrumbs — site-caption, links in ink-2, the last item is the current page. */
export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  return (
    <nav aria-label="Хлебные крошки" className={cn("text-site-caption text-ink-3", className)}>
      <ol role="list" className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span aria-hidden className="select-none">
                /
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="text-ink-2 underline transition-quick hover:text-ink">
                {item.label}
              </Link>
            ) : (
              <span aria-current={i === items.length - 1 ? "page" : undefined}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
