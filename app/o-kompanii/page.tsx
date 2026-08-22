import type { Metadata } from "next";
import { Container, Eyebrow, Surface, Breadcrumb } from "@/components/ds";
import { HubCard } from "@/components/company/hub-card";
import { MilestoneStrip } from "@/components/company/milestone-strip";
import { getCompanyHub, getHistory } from "@/lib/content/company";

const hub = getCompanyHub();

/** Curated first part of the timeline; the next period has a dedicated reserved panel. */
const MILESTONE_IDS: readonly string[] = [
  "nachalo",
  "ps600",
  "aerobus",
  "prokat",
  "novik",
  "gibson",
  "redbear",
  "rossiya",
  "liniya",
];

export const metadata: Metadata = {
  alternates: { canonical: "/o-kompanii" },
  title: "О компании",
  description: hub.lede,
};

export default function CompanyHubPage() {
  const { chapters } = getHistory();
  const milestones = chapters.filter((c) => MILESTONE_IDS.includes(c.id));
  return (
    <div>
      <Surface mode="dark" className="py-16">
        <Container>
          <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "О компании" }]} />
          <header className="enter mt-6 max-w-prose">
            <Eyebrow accent>{hub.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {hub.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{hub.lede}</p>
          </header>
        </Container>
      </Surface>

      <Container className="py-12">
        <div className="reveal-stagger grid gap-4 sm:grid-cols-3">
          {hub.cards.map((card) => (
            <HubCard key={card.href} card={card} />
          ))}
        </div>
      </Container>

      <MilestoneStrip chapters={milestones} periods={hub.historyPeriods} continuation={hub.historyContinuation} />
    </div>
  );
}
