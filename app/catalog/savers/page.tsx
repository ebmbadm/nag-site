import type { Metadata } from "next";
import { Container, Breadcrumb, Figure, PageHeader } from "@/components/ds";
import { FeatureStrip } from "@/components/boutique/feature-strip";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getSavers } from "@/lib/content/boutique";

const s = getSavers();

export const metadata: Metadata = {
  alternates: { canonical: "/catalog/savers" },
  title: "Сейверы для винтажных радиоламп · NOVIK",
  description: s.lede,
};

export default function SaversPage() {
  return (
    <>
      <Container className="pt-6">
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Бутик ламп", href: "/catalog/boutique" },
            { label: "Сейверы" },
          ]}
        />
        <PageHeader className="mt-12" title={s.title} lead={s.lede} />
        {s.hero ? <Figure src={s.hero.src} alt={s.hero.alt} caption={s.hero.caption} priority className="mt-12 max-w-3xl" /> : null}
      </Container>

      <Container className="flex flex-col gap-24 pt-24 pb-24">
        {s.features ? <FeatureStrip features={s.features} /> : null}
        {s.custom ? <CustomOrderCta custom={s.custom} /> : null}
      </Container>
    </>
  );
}
