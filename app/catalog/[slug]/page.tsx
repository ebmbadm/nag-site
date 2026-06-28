import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ds";
import {
  Breadcrumb,
  ProductHero,
  FeatureBand,
  TechBand,
  SoftwareSection,
  SpecsSection,
} from "@/components/product/sections";
import { Mdx } from "@/lib/content/mdx";
import { getProduct, getProductSlugs } from "@/lib/content/products";

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

  return (
    <article>
      <Breadcrumb items={p.breadcrumb} />
      <ProductHero product={p} />

      {body.trim() ? (
        <section className="py-4">
          <Container className="max-w-3xl">
            <div className="text-base">
              <Mdx source={body} />
            </div>
          </Container>
        </section>
      ) : null}

      {p.features ? <FeatureBand features={p.features} /> : null}
      {p.tech ? <TechBand tech={p.tech} /> : null}
      {p.software ? <SoftwareSection software={p.software} docs={p.docs} /> : null}
      <SpecsSection groups={p.specGroups} />
    </article>
  );
}
