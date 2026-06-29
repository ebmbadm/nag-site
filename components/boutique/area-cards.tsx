import Link from "next/link";
import type { BoutiqueAreaCard } from "@/lib/content/types";

export function AreaCards({ cards }: { cards: BoutiqueAreaCard[] }) {
  return (
    <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-3">
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
          <span className="mt-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Открыть →</span>
        </Link>
      ))}
    </div>
  );
}
