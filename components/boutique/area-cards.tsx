import Link from "next/link";
import type { BoutiqueAreaCard } from "@/lib/content/types";

export function AreaCards({ cards }: { cards: BoutiqueAreaCard[] }) {
  return (
    <div className="reveal-fade-stagger grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border lg:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group flex flex-col bg-bg p-6 transition-colors duration-[var(--dur-base)] hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
        >
          <span className="font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
            {card.title}
          </span>
          <span className="mt-2 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            {card.text}
          </span>
          <span className="mt-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0">
            Открыть →
          </span>
        </Link>
      ))}
    </div>
  );
}
