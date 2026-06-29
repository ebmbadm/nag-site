import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, ProductCard, buttonVariants } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";
import { TubesInquiryCta } from "./tubes-inquiry-cta";

const CATEGORY = "Ламповые усилители";
const ORDER = ["e12", "redbear", "black-fire", "n1202"];
const CONTACT_TEL = "+79219372508";

const LEDE =
  "Компания НОВИК за свою историю создала десятки ламповых усилителей мощности. Здесь - лишь 4 модели из огромного ряда.";

export const metadata: Metadata = {
  title: "Ламповые усилители · NOVIK",
  description: LEDE,
  openGraph: {
    title: "Ламповые усилители · NOVIK",
    description: LEDE,
    images: ["/products/e12/novik-e12-head-front.png"],
  },
};

export default function TubesPage() {
  const rank = (slug: string) => {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
  };
  const products = getProductsByCategory(CATEGORY).sort(
    (a, b) => rank(a.slug) - rank(b.slug),
  );

  return (
    <div className="py-6">
      <Container>
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Ламповые усилители" },
          ]}
        />

        <header className="mt-8 max-w-prose">
          <Eyebrow accent>NOVIK</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            Ламповые усилители
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            {LEDE}
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              eyebrow={p.line}
              image={{ src: p.gallery[0].src, alt: p.gallery[0].alt }}
              price={{ amount: p.price?.amount, onRequest: p.price?.onRequest }}
              badge={p.badges[0]}
            />
          ))}
        </div>

        <div className="mt-12 rounded-[var(--radius-lg)] border border-border bg-surface p-6 sm:p-8">
          <p className="max-w-prose text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            По остальным моделям свяжитесь с нами - подберём конфигурацию и рассчитаем срок
            изготовления под заказ.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <TubesInquiryCta />
            <a href={`tel:${CONTACT_TEL}`} className={buttonVariants({ variant: "outline", size: "lg" })}>
              Позвонить
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
