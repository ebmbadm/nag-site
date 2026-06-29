import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, ProductCard } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";

const CATEGORY = "Усилители мощности";
const ORDER = ["qm-400", "td-series", "cx-series", "modules", "tdx"];
const FLAGSHIP = "qm-400";

const LEDE =
  "Транзисторные усилители мощности NAG. Класс TD и класс D: флагман QM-400 (4 × 2250 Вт), серии TD и CX, встраиваемые модули TDS/TDH и TDX.";

export const metadata: Metadata = {
  title: "Усилители мощности · NAG Pro Audio",
  description: LEDE,
  openGraph: {
    title: "Усилители мощности · NAG Pro Audio",
    description: LEDE,
    images: ["/products/qm-400/nag-qm400-front-panel.jpg"],
  },
};

export default function AmplifiersPage() {
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
            { label: "Усилители мощности" },
          ]}
        />

        <header className="mt-8 max-w-prose">
          <Eyebrow accent>NAG Pro Audio</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            Усилители мощности
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
              badge={p.slug === FLAGSHIP ? "Флагман" : p.badges[0]}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
