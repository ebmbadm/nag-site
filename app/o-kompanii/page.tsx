import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb } from "@/components/ds";
import { HubCard } from "@/components/company/hub-card";
import { MilestoneStrip } from "@/components/company/milestone-strip";
import { getCompanyHub, getHistory } from "@/lib/content/company";

const hub = getCompanyHub();

export const metadata: Metadata = {
  title: "О компании · NAG · NOVIK",
  description: hub.lede,
};

export default function CompanyHubPage() {
  const { chapters } = getHistory();
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "О компании" }]} />
        <header className="mt-6 max-w-prose">
          <Eyebrow accent>{hub.eyebrow}</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            {hub.title}
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{hub.lede}</p>
        </header>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {hub.cards.map((card) => (
            <HubCard key={card.href} card={card} />
          ))}
        </div>
      </Container>
      <MilestoneStrip chapters={chapters} stat={hub.stat} />
    </div>
  );
}
