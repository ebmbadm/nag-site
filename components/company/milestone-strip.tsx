import Link from "next/link";
import { Container, Eyebrow, Surface } from "@/components/ds";
import type { CompanyMilestone } from "@/lib/content/types";

/** Compact history and model timeline; links to the long-form company history. */
export function MilestoneStrip({
  milestones,
  periods,
  continuation,
}: {
  milestones: CompanyMilestone[];
  periods: { range: string; label: string }[];
  continuation: { range: string; title: string; text: string };
}) {
  return (
    <Surface mode="dark" className="py-14">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Eyebrow accent>История и компания в датах</Eyebrow>
          <div className="flex flex-wrap justify-end gap-x-5 gap-y-2 text-right">
            {periods.map((period) => <span key={period.range} className="flex flex-col"><b className="font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>{period.range}</b><span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">{period.label}</span></span>)}
          </div>
        </div>

        <ol className="reveal-fade-stagger mt-8 grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {milestones.map((milestone) => (
            <li key={`${milestone.year}-${milestone.label}`} className="bg-bg p-5" style={{ borderTop: "var(--border-w-rule) solid var(--accent)" }}>
              <div className="font-display text-xl text-text tabular" style={{ letterSpacing: "var(--ls-tight)" }}>{milestone.year}</div>
              {milestone.accentLabel && <div className="mt-2 inline-block bg-accent px-2 py-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-on-accent">{milestone.accentLabel}</div>}
              <div className="mt-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">{milestone.label}</div>
              {milestone.text && <p className="mt-4 text-sm leading-relaxed text-text-muted">{milestone.text}</p>}
            </li>
          ))}
        </ol>

        <div className="mt-4 border border-border bg-bg px-5 py-4 sm:flex sm:items-baseline sm:gap-4">
          <div className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-accent">{continuation.range}</div>
          <div className="mt-2 sm:mt-0"><b className="font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>{continuation.title}</b><p className="mt-1 text-sm text-text-muted">{continuation.text}</p></div>
        </div>

        <div className="mt-6">
          <Link href="/istoriya" className="font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent hover:underline">
            Читать историю целиком →
          </Link>
        </div>
      </Container>
    </Surface>
  );
}
