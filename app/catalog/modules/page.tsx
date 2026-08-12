import type { Metadata } from "next";
import { Breadcrumb, Container, Eyebrow, ProductCard } from "@/components/ds";
import { JsonLd } from "@/components/seo/json-ld";
import { getProductsByCategory } from "@/lib/content/products";
import { breadcrumbSchema } from "@/lib/seo";

const CATEGORY = "Встраиваемые модули";
const ORDER = ["tds-tdh"];
const LEDE =
  "Встраиваемые модули NAG Class-TD для активной акустики: TDS-10, TDH-10, TDS-20 и TDH-20.";
const CRUMBS = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Модули" },
];

export const metadata: Metadata = {
  title: "Модули NAG для активной акустики",
  description: LEDE,
  alternates: { canonical: "/catalog/modules" },
  openGraph: {
    title: "Модули NAG для активной акустики",
    description: LEDE,
    images: ["/products/modules/nag-module-tds-rear-panel.jpg"],
  },
};

export default function ModulesPage() {
  const products = getProductsByCategory(CATEGORY).sort(
    (a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug),
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
            Модули
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            {LEDE}
          </p>
        </header>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-5">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              slug={product.slug}
              name={product.name}
              image={{ src: product.gallery[0].src, alt: product.gallery[0].alt }}
              price={{ amount: product.price?.amount, onRequest: product.price?.onRequest }}
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
