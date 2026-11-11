import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPageView } from "@/components/product/sections";
import { Mdx } from "@/lib/content/mdx";
import { getProduct, getProductSlugs, getProductsByCategory } from "@/lib/content/products";
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

  const related = getProductsByCategory(p.category)
    .filter((r) => r.slug !== slug)
    .slice(0, 3);

  return (
    <article>
      <JsonLd data={p.archived ? breadcrumbSchema(crumbs) : [productSchema(p, slug), breadcrumbSchema(crumbs)]} />
      <ProductPageView product={p} body={body.trim() ? <Mdx source={body} /> : null} related={related} />
    </article>
  );
}
