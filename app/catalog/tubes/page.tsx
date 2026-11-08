import type { Metadata } from "next";
import { Container, Breadcrumb, PageHeader, Section, ProductRow, buttonVariants } from "@/components/ds";
import { getProductsByCategory } from "@/lib/content/products";
import { productRow } from "@/lib/content/catalog";
import { TubesInquiryCta } from "./tubes-inquiry-cta";

const CATEGORY = "Ламповые усилители";
const ORDER = ["e12", "redbear", "black-fire", "n1202"];
/**
 * RedBear's subtitle carries «дизайн Gibson», a claim the site passport rules out;
 * the category row keeps only what the product is.
 */
const SUMMARY: Record<string, string> = { redbear: "Гитарный комбо" };
const CONTACT_TEL = "+79219372508";

const LEDE =
  "Компания НОВИК за свою историю создала десятки ламповых усилителей мощности. Здесь - лишь 4 модели из огромного ряда.";

export const metadata: Metadata = {
  alternates: { canonical: "/catalog/tubes" },
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
    <>
      <Container className="pt-6">
        <Breadcrumb
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог" },
            { label: "Ламповые усилители" },
          ]}
        />
        <PageHeader className="mt-12" title="Ламповые усилители" lead={LEDE} />
      </Container>

      <Container className="flex flex-col gap-24 pt-24 pb-24">
        <Section
          id="models"
          title={
            <>
              Модели <span className="text-novik">NOVIK</span>
            </>
          }
        >
          {products.map((p) => (
            <ProductRow key={p.slug} {...productRow(p, SUMMARY[p.slug] ? { summary: SUMMARY[p.slug] } : {})} />
          ))}
        </Section>

        <Section id="other" title="Другие модели">
          <p className="mt-0 mb-0 max-w-2xl text-ink-2">
            По остальным моделям свяжитесь с нами - подберём конфигурацию и рассчитаем срок
            изготовления под заказ.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <TubesInquiryCta />
            <a href={`tel:${CONTACT_TEL}`} className={buttonVariants({ variant: "secondary" })}>
              Позвонить
            </a>
          </div>
        </Section>
      </Container>
    </>
  );
}
