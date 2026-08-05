import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, ProductCard } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";

const CATEGORY = "Усилители мощности";
const ORDER = ["qm-400", "td-series", "cx-series", "modules", "tdx"];
const FLAGSHIP = "qm-400";

const LEDE =
  "Транзисторные усилители мощности NAG. Класс TD и класс D: флагман QM-400 (4 × 2250 Вт), серии TD и CX, встраиваемые модули TDS/TDH и TDX.";

const CRUMBS = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Усилители мощности" },
];

export const metadata: Metadata = {
  // Absolute — the layout template would otherwise append the brand a second time.
  title: { absolute: "Усилители мощности NAG — Class-TD и Class-D, купить" },
  description:
    "Транзисторные усилители мощности NAG: флагман QM-400 4 × 2250 Вт, серии TD и CX, встраиваемые модули TDS/TDH и TDX. Гарантия 2 года, свой сервис.",
  alternates: { canonical: "/catalog/amplifiers" },
  openGraph: {
    title: "Усилители мощности NAG — Class-TD и Class-D",
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
    <div className="pt-10 pb-24">
      <Container>
        <JsonLd data={breadcrumbSchema(CRUMBS)} />
        <Breadcrumb items={CRUMBS} />

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

        {/* 5 товаров: 1 колонка на мобильных, 3 — от md (ряды 3+2). Последний
            ряд неполный, и это меньшее зло: col-span-2 у первой карточки
            растягивал соседнюю по высоте и «лайтбоксил» панорамное фото. */}
        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              slug={p.slug}
              name={p.name}
              image={{ src: p.gallery[0].src, alt: p.gallery[0].alt }}
              price={{ amount: p.price?.amount, onRequest: p.price?.onRequest }}
              badge={p.slug === FLAGSHIP ? "Флагман" : undefined}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
