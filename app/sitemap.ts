import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";
import { getProductSlugs } from "@/lib/content/products";

/** Static (non-product) routes. Keep in sync with app/ route folders. */
const CATEGORY_ROUTES = [
  "/catalog/amplifiers",
  "/catalog/processors",
  "/catalog/tubes",
  "/catalog/boutique",
  "/catalog/converters",
  "/catalog/savers",
];

const INFO_ROUTES = ["/o-kompanii", "/istoriya", "/kontakty", "/garantiya"];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const productRoutes = getProductSlugs().map((slug) => `/catalog/${slug}`);

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified, changeFrequency: "weekly", priority: 1 },
    ...CATEGORY_ROUTES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...productRoutes.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...INFO_ROUTES.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];

  return entries;
}
