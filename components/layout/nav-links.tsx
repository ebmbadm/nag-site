"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "./mobile-nav";

/**
 * Desktop nav with current-page state. Longest matching href wins, so
 * /catalog/amplifiers lights "Усилители" only and /catalog/d-8000 lights "Каталог".
 */
export function NavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const active = items.reduce<string | null>((best, item) => {
    const match = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return match && (!best || item.href.length > best.length) ? item.href : best;
  }, null);

  return (
    <nav className="hidden flex-1 items-center gap-6 lg:flex" aria-label="Основная навигация">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.href === active ? "page" : undefined}
          className={cn(
            "border-b-2 border-transparent pb-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:rounded-[var(--radius-xs)]",
            item.href === active ? "border-accent text-text" : "text-text-muted",
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
