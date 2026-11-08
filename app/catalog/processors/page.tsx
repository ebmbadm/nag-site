import type { Metadata } from "next";
import Link from "next/link";
import { Container, Breadcrumb, PageHeader, Section, ProductRow } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { productRow } from "@/lib/content/catalog";

const CATEGORY = "Процессоры";
const ORDER = ["f-8-pro", "f-8", "d-8000", "the-rogue", "d-4", "d-8"];

const LEDE =
  "Цифровые корректоры-контроллеры акустических систем NAG: процессоры серии F с FIR и AES/EBU и флагман D-8000 Wi-Fi.";

const CRUMBS = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Процессоры" },
];

export const metadata: Metadata = {
  // Absolute — the layout template would otherwise append the brand a second time.
  title: { absolute: "DSP-процессоры и контроллеры акустических систем NAG" },
  description:
    "DSP-процессоры NAG: цифровые контроллеры-корректоры АС 4 × 8, FIR-фильтры, управление по Wi-Fi. От 79 900 ₽, гарантия 2 года.",
  alternates: { canonical: "/catalog/processors" },
  openGraph: {
    title: "DSP-процессоры и контроллеры акустических систем NAG",
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
    <>
      <Container className="pt-6">
        <JsonLd data={breadcrumbSchema(CRUMBS)} />
        <Breadcrumb items={CRUMBS} />
        <PageHeader className="mt-12" title="Процессоры" lead={LEDE}>
          <p className="mt-2 mb-0 text-site-small text-ink-2">от 79 900 ₽</p>
        </PageHeader>
      </Container>

      {/* В каталоге остаются только актуальные модели; снятые с производства перенесены в архив. */}
      <Container className="flex flex-col gap-24 pt-24 pb-24">
        <Section
          id="models"
          title="Модели"
          aside={
            <Link href="/catalog/arhiv" className="text-ink">
              Снятые с производства — в архиве
            </Link>
          }
        >
          {products.map((p) => (
            <ProductRow key={p.slug} {...productRow(p)} />
          ))}
        </Section>
      </Container>
    </>
  );
}
