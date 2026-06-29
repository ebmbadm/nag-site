import Link from "next/link";
import { Container, Eyebrow, Surface } from "@/components/ds";
import type { HistoryChapter } from "@/lib/content/types";

/** Compact dark milestone strip derived from history chapters; links to /istoriya. */
export function MilestoneStrip({
  chapters,
  stat,
}: {
  chapters: HistoryChapter[];
  stat: { value: string; label: string };
}) {
  return (
    <Surface mode="dark" className="py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Eyebrow accent>Компания в датах</Eyebrow>
          <span className="flex flex-col text-right">
            <b className="font-display text-2xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>{stat.value}</b>
            <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{stat.label}</span>
          </span>
        </div>

        <ol className="mt-8 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((c) => (
            <li key={c.id} className="bg-bg p-5" style={{ borderTop: "var(--border-w-rule) solid var(--accent)" }}>
              <div className="font-display text-xl text-text tabular" style={{ letterSpacing: "var(--ls-tight)" }}>{c.year}</div>
              <div className="mt-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{c.label}</div>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <Link href="/istoriya" className="font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent hover:underline">
            Читать историю целиком →
          </Link>
        </div>
      </Container>
    </Surface>
  );
}
