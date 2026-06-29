import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, Figure } from "@/components/ds";
import { FeatureStrip } from "@/components/boutique/feature-strip";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getConverters } from "@/lib/content/boutique";

const c = getConverters();

export const metadata: Metadata = {
  title: "Конвертеры для ламп · NOVIK",
  description: c.lede,
};

export default function ConvertersPage() {
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Бутик ламп", href: "/catalog/boutique" },
            { label: "Конвертеры" },
          ]}
        />
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-prose">
            <Eyebrow accent>{c.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {c.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{c.lede}</p>
          </div>
          {c.hero ? <Figure src={c.hero.src} alt={c.hero.alt} caption={c.hero.caption} /> : null}
        </div>
      </Container>

      {c.features ? <FeatureStrip features={c.features} image={c.heroDark} /> : null}
      {c.custom ? <CustomOrderCta custom={c.custom} /> : null}
    </div>
  );
}
