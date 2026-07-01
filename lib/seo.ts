import type { ProductFrontmatter } from "@/lib/content/schema";
import type { BreadcrumbItem } from "@/components/ds/breadcrumb";

/** Canonical production origin. Single source of truth for absolute URLs. */
export const SITE_URL = "https://novikamps.com";

/** Resolve a path (or pass an already-absolute URL through) to a site-absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl;
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/** Company facts — kept in sync with the footer / contacts page. */
export const ORGANIZATION = {
  name: "NAG · NOVIK",
  legalName: "НОВИК",
  phone: "+7 921 937 25 08",
  email: "novikamps@mail.ru",
  street: "Московское шоссе, 25 литера А, офис 216А",
  city: "Санкт-Петербург",
  country: "RU",
  foundingYear: "1992",
  description:
    "Производство, продажа и сервис профессионального звукового оборудования: DSP-процессоры, усилители мощности, ламповые усилители. На рынке с 1992 года.",
} as const;

const ORG_ID = `${SITE_URL}/#organization`;

/** schema.org Organization — emitted once site-wide (root layout). */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: ORGANIZATION.name,
    legalName: ORGANIZATION.legalName,
    url: SITE_URL,
    logo: absoluteUrl("/brand/nag-logo-onlight.png"),
    foundingDate: ORGANIZATION.foundingYear,
    description: ORGANIZATION.description,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: ORGANIZATION.phone,
      email: ORGANIZATION.email,
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: ORGANIZATION.street,
      addressLocality: ORGANIZATION.city,
      addressCountry: ORGANIZATION.country,
    },
  };
}

/** schema.org WebSite — emitted once site-wide (root layout). */
export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: ORGANIZATION.name,
    inLanguage: "ru-RU",
    publisher: { "@id": ORG_ID },
  };
}

function brandOf(p: ProductFrontmatter): "NOVIK" | "NAG" {
  return /NOVIK/i.test(`${p.name} ${p.line}`) ? "NOVIK" : "NAG";
}

/** schema.org Product for a catalog page. Includes an Offer only when a real price exists. */
export function productSchema(p: ProductFrontmatter, slug: string) {
  const url = `${SITE_URL}/catalog/${slug}`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.summary,
    image: p.gallery.map((g) => absoluteUrl(g.src)),
    sku: slug,
    mpn: p.name,
    category: p.category,
    brand: { "@type": "Brand", name: brandOf(p) },
    url,
  };
  if (typeof p.price?.amount === "number") {
    schema.offers = {
      "@type": "Offer",
      url,
      priceCurrency: "RUB",
      price: p.price.amount,
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": ORG_ID },
    };
  }
  return schema;
}

/** schema.org BreadcrumbList from the same item list the visual breadcrumb renders. */
export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}
