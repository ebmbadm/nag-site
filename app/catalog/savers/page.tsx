import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, Figure } from "@/components/ds";
import { FeatureStrip } from "@/components/boutique/feature-strip";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getSavers } from "@/lib/content/boutique";

const s = getSavers();

export const metadata: Metadata = {
  title: "Сейверы для винтажных радиоламп · NOVIK",
  description: s.lede,
};

export default function SaversPage() {
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Бутик ламп", href: "/catalog/boutique" },
            { label: "Сейверы" },
          ]}
        />
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-prose">
            <Eyebrow accent>{s.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {s.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{s.lede}</p>
          </div>
          {s.hero ? <Figure src={s.hero.src} alt={s.hero.alt} caption={s.hero.caption} /> : null}
        </div>
      </Container>

      {s.features ? <FeatureStrip features={s.features} /> : null}
      {s.custom ? <CustomOrderCta custom={s.custom} /> : null}
    </div>
  );
}
