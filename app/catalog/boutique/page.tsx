import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, Figure } from "@/components/ds";
import { AreaCards } from "@/components/boutique/area-cards";
import { CustomOrderCta } from "@/components/boutique/custom-order-cta";
import { getBoutique } from "@/lib/content/boutique";

const b = getBoutique();

export const metadata: Metadata = {
  title: "Ламповый бутик NOVIK",
  description: b.lede,
};

export default function BoutiqueLandingPage() {
  return (
    <div>
      <Container className="py-10">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Каталог" }, { label: "Бутик ламп" }]} />
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="max-w-prose">
            <Eyebrow accent>{b.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {b.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{b.lede}</p>
          </div>
          {b.hero ? <Figure src={b.hero.src} alt={b.hero.alt} caption={b.hero.caption} /> : null}
        </div>
      </Container>

      {b.areaCards ? (
        <Container className="pb-12">
          <AreaCards cards={b.areaCards} />
        </Container>
      ) : null}

      {b.custom ? <CustomOrderCta custom={b.custom} /> : null}
    </div>
  );
}
