import type { Metadata } from "next";
import { Container, PageHeader, Section, Breadcrumb } from "@/components/ds";
import { HubCard } from "@/components/company/hub-card";
import { MilestoneStrip } from "@/components/company/milestone-strip";
import { getCompanyHub } from "@/lib/content/company";

const hub = getCompanyHub();

export const metadata: Metadata = {
  alternates: { canonical: "/o-kompanii" },
  title: "О компании",
  description: hub.lede,
};

export default function CompanyHubPage() {
  return (
    <>
      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "О компании" }]} />
      </Container>
      <Container className="pt-12">
        <PageHeader title={hub.title} lead={hub.lede} />
      </Container>

      <Container className="flex flex-col gap-24 pt-20">
        <Section title="Разделы">
          <div className="flex flex-col">
            {hub.cards.map((card) => (
              <HubCard key={card.href} card={card} />
            ))}
          </div>
        </Section>

        <MilestoneStrip
          milestones={hub.historyMilestones}
          periods={hub.historyPeriods}
          continuation={hub.historyContinuation}
        />
      </Container>
    </>
  );
}
