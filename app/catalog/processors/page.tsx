import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb, ProductCard } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";

const CATEGORY = "Процессоры";
const ORDER = ["f-8-pro", "f-8", "d-8000", "the-rogue", "d-4", "d-8"];
const FLAGSHIP = "d-8000";

const LEDE =
  "Цифровые корректоры-контроллеры акустических систем NAG. Шесть моделей: процессоры серии F с FIR и AES/EBU, флагман D-8000 Wi-Fi и доступная линейка DSP BY NAG с трансформаторным блоком питания.";

export const metadata: Metadata = {
  title: "Процессоры · NAG Pro Audio",
  description: LEDE,
  openGraph: {
    title: "Процессоры · NAG Pro Audio",
    description: LEDE,
    images: ["/products/d-8000/nag-d8000-front-panel.jpg"],
  },
};

export default function ProcessorsPage() {
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
            { label: "Процессоры" },
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
            Процессоры
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
