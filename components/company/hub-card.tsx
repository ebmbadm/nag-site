import Link from "next/link";
import type { CompanyHubCard } from "@/lib/content/types";

export function HubCard({ card }: { card: CompanyHubCard }) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-colors duration-[var(--dur-base)] hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
    >
      <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{card.kicker}</span>
      <span className="mt-3 font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
        {card.title}
      </span>
      <span className="mt-2 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{card.text}</span>
      <span className="mt-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Открыть →</span>
    </Link>
  );
}
