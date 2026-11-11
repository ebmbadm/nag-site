import type { Metadata } from "next";
import { Container, Breadcrumb, Figure, PageHeader } from "@/components/ds";
import { FeatureStrip } from "@/components/boutique/feature-strip";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getConverters } from "@/lib/content/boutique";

const c = getConverters();

export const metadata: Metadata = {
  alternates: { canonical: "/catalog/converters" },
  title: "Конвертеры для ламп · NOVIK",
  description: c.lede,
};

export default function ConvertersPage() {
  return (
    <>
      <Container className="pt-6">
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Бутик ламп", href: "/catalog/boutique" },
            { label: "Конвертеры" },
          ]}
        />
        <PageHeader className="mt-12" title={c.title} lead={c.lede} />
        {c.hero ? <Figure src={c.hero.src} alt={c.hero.alt} caption={c.hero.caption} priority className="mt-12 max-w-3xl" /> : null}
      </Container>

      <Container className="flex flex-col gap-24 pt-24 pb-24">
        {c.features ? <FeatureStrip features={c.features} image={c.heroDark} /> : null}
        {c.custom ? <CustomOrderCta custom={c.custom} /> : null}
      </Container>
    </>
  );
}
