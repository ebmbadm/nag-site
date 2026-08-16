import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container, Breadcrumb, Prose } from "@/components/ds";
import {
  ProductHero,
  FeatureBand,
  TechBand,
  SoftwareSection,
  SpecsSection,
  DocsSection,
} from "@/components/product/sections";
import { ModulesProductPage } from "@/components/product/modules-product-page";
import { Qm400ProductPage } from "@/components/product/qm400-product-page";
import { Mdx } from "@/lib/content/mdx";
import { getProduct, getProductSlugs } from "@/lib/content/products";
import { JsonLd } from "@/components/seo/json-ld";
import { productSchema, breadcrumbSchema } from "@/lib/seo";
import { formatPrice } from "@/lib/format";

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
  // Model name alone ranks only for brand+part-number queries. The subtitle carries
  // the category words people actually search ("усилитель мощности", "процессор").
  const title = product.subtitle ? `${product.name} — ${product.subtitle}` : product.name;
  const price =
    typeof product.price?.amount === "number"
      ? ` Цена ${formatPrice(product.price.amount)}.`
      : product.price?.onRequest
        ? " Цена по запросу."
        : "";
  const room = 155 - price.length;
  const lede =
    product.summary.length > room
      ? `${product.summary.slice(0, room).replace(/[\s,.;:—-]+$/, "")}…`
      : product.summary;

  return {
    // Absolute — the model name already carries the brand; the layout template
    // would only push the useful words past the SERP cutoff.
    title: { absolute: title },
    description: `${lede}${price}`,
    alternates: { canonical: `/catalog/${slug}` },
    openGraph: {
      title,
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

  if (slug === "modules") {
    return (
      <article>
        <JsonLd data={[productSchema(p, slug), breadcrumbSchema(crumbs)]} />
        <div className="pt-6">
          <Container>
            <Breadcrumb items={crumbs} />
          </Container>
        </div>
        <ModulesProductPage product={p} />
        {p.docs && p.docs.length > 0 ? <DocsSection docs={p.docs} /> : null}
      </article>
    );
  }

  if (slug === "qm-400") {
    return (
      <article>
        <JsonLd data={[productSchema(p, slug), breadcrumbSchema(crumbs)]} />
        <div className="pt-6">
          <Container>
            <Breadcrumb items={crumbs} />
          </Container>
        </div>
        <Qm400ProductPage product={p} />
        <SpecsSection groups={p.specGroups} specMatrix={p.specMatrix} />
        {p.docs && p.docs.length > 0 ? <DocsSection docs={p.docs} /> : null}
      </article>
    );
  }

  return (
    <article>
      <JsonLd data={p.archived ? breadcrumbSchema(crumbs) : [productSchema(p, slug), breadcrumbSchema(crumbs)]} />
      <div className="pt-6">
        <Container>
          <Breadcrumb items={crumbs} />
        </Container>
      </div>
      <ProductHero product={p} slug={slug} />

      {body.trim() ? (
        <section className="border-t border-border py-16">
          <Container>
            <Prose>
              <Mdx source={body} />
            </Prose>
          </Container>
        </section>
      ) : null}

      {p.features ? <FeatureBand features={p.features} /> : null}
      {p.tech ? <TechBand tech={p.tech} /> : null}
      {p.software ? <SoftwareSection software={p.software} /> : null}
      <SpecsSection groups={p.specGroups} specMatrix={p.specMatrix} />
      {p.docs && p.docs.length > 0 ? <DocsSection docs={p.docs} /> : null}
    </article>
  );
}
