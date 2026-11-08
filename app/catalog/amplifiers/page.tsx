import type { Metadata } from "next";
import { Container, Breadcrumb, PageHeader } from "@/components/ds";
import { getProduct } from "@/lib/content/products";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { AmplifiersCategoryPage } from "@/components/product/amplifiers-category-page";

const LEDE =
  "Транзисторные усилители мощности NAG: флагман QM-400 (4 × 2400 Вт) и серия TD.";

const CRUMBS = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Усилители мощности" },
];

export const metadata: Metadata = {
  // Absolute — the layout template would otherwise append the brand a second time.
  title: { absolute: "Усилители мощности NAG — Class-TD и Class-D, купить" },
  description:
    "Транзисторные усилители мощности NAG: флагман QM-400 4 × 2400 Вт и серия TD. Гарантия 2 года, свой сервис.",
  alternates: { canonical: "/catalog/amplifiers" },
  openGraph: {
    title: "Усилители мощности NAG — Class-TD и Class-D",
    description: LEDE,
    images: ["/products/qm-400/nag-qm400-front-panel.jpg"],
  },
};

export default function AmplifiersPage() {
  const qm400 = getProduct("qm-400").frontmatter;
  const tdSeries = getProduct("td-series").frontmatter;

  return (
    <>
      <Container className="pt-6">
        <JsonLd data={breadcrumbSchema(CRUMBS)} />
        <Breadcrumb items={CRUMBS} />
        <PageHeader className="mt-12" title="Усилители мощности" lead={LEDE} />
      </Container>
      <AmplifiersCategoryPage qm400={qm400} tdSeries={tdSeries} />
    </>
  );
}
