import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Breadcrumb, Prose } from "@/components/ds";
import {
  ProductHero,
  FeatureBand,
  TechBand,
  SoftwareSection,
  SpecsSection,
} from "@/components/product/sections";
import { Mdx } from "@/lib/content/mdx";
import { getProduct, getProductSlugs } from "@/lib/content/products";
import { JsonLd } from "@/components/seo/json-ld";
import { productSchema, breadcrumbSchema } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return getProductSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  let product;
  try {
    product = getProduct(slug).frontmatter;
  } catch {
    return {};
  }
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/catalog/${slug}` },
    openGraph: {
      title: product.name,
      description: product.summary,
      images: [product.gallery[0]?.src].filter(Boolean) as string[],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let doc;
  try {
    doc = getProduct(slug);
  } catch {
    notFound();
  }

  const { frontmatter: p, body } = doc;
  const crumbs = [{ label: "Главная", href: "/" }, ...p.breadcrumb];

  return (
    <article>
      <JsonLd data={[productSchema(p, slug), breadcrumbSchema(crumbs)]} />
      <div className="pt-6">
        <Container>
          <Breadcrumb items={crumbs} />
        </Container>
      </div>
      <ProductHero product={p} slug={slug} />

      {body.trim() ? (
        <section className="py-8">
          <Container>
            <Prose>
              <Mdx source={body} />
            </Prose>
          </Container>
        </section>
      ) : null}

      {p.features ? <FeatureBand features={p.features} /> : null}
      {p.tech ? <TechBand tech={p.tech} /> : null}
      {p.software ? <SoftwareSection software={p.software} docs={p.docs} /> : null}
      <SpecsSection groups={p.specGroups} specMatrix={p.specMatrix} />
    </article>
  );
}
