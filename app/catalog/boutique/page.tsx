import type { Metadata } from "next";
import { Container, Breadcrumb, Figure, PageHeader, Section } from "@/components/ds";
import { AreaCards } from "@/components/boutique/area-cards";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getBoutique } from "@/lib/content/boutique";

const b = getBoutique();

export const metadata: Metadata = {
  alternates: { canonical: "/catalog/boutique" },
  title: "Ламповый бутик NOVIK",
  description: b.lede,
};

export default function BoutiqueLandingPage() {
  return (
    <>
      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Каталог" }, { label: "Бутик ламп" }]} />
        <PageHeader className="mt-12" title={b.title} lead={b.lede} />
        {b.hero ? <Figure src={b.hero.src} alt={b.hero.alt} caption={b.hero.caption} priority className="mt-12 max-w-3xl" /> : null}
      </Container>

      <Container className="flex flex-col gap-24 pt-24 pb-24">
        {b.areaCards ? (
          <Section title="Разделы бутика">
            <AreaCards cards={b.areaCards} />
          </Section>
        ) : null}
        {b.custom ? <CustomOrderCta custom={b.custom} /> : null}
      </Container>
    </>
  );
}
