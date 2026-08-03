import Link from "next/link";
import type { CompanyHubCard } from "@/lib/content/types";

export function HubCard({ card }: { card: CompanyHubCard }) {
  return (
    <Link
      href={card.href}
      className="group flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-6 transition-[box-shadow,border-color] duration-[var(--dur-base)] hover:border-accent hover:shadow-[var(--shadow-2)] motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
    >
      <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">{card.kicker}</span>
      <span
        className="mt-3 font-display text-xl uppercase text-text transition-colors duration-[var(--dur-base)] group-hover:text-accent motion-reduce:transition-none"
        style={{ letterSpacing: "var(--ls-tight)" }}
      >
        {card.title}
      </span>
      <span className="mt-2 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{card.text}</span>
      <span className="mt-4 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">
        Открыть{" "}
        <span
          aria-hidden
          className="inline-block transition-transform duration-[var(--dur-base)] group-hover:translate-x-1 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
        >
          →
        </span>
      </span>
    </Link>
  );
}
