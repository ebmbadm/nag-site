"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type NavItem = { label: string; href: string; secondary?: boolean };

/** Current section is underlined, not coloured. Longest matching href wins. */
export function NavLinks({ items, className }: { items: NavItem[]; className?: string }) {
  const pathname = usePathname();
  const active = items.reduce<string | null>((best, item) => {
    const match = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return match && (!best || item.href.length > best.length) ? item.href : best;
  }, null);

  return (
    <nav aria-label="Основная навигация" className={cn("flex flex-wrap gap-x-7 gap-y-1 text-base", className)}>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === active ? "page" : undefined}
          className={cn(
            "underline transition-quick hover:decoration-current",
            item.href === active ? "decoration-current" : "decoration-transparent",
            item.secondary ? "text-ink-2 hover:text-ink" : "text-ink",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
