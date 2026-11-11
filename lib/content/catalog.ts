import type { ProductFrontmatter } from "./schema";
import type { ProductRowProps } from "@/components/ds";
import { formatPrice } from "@/lib/format";

/**
 * Clean front-panel cut-outs on white (no badges, logos or captions over the
 * device) — the catalog row photo. Rack units share one width, so 1U and 2U
 * read from the height. Products without a clean front fall back to their
 * first gallery photo, shown boxed at a fixed height.
 */
export const FRONT_PHOTO: Record<string, { src: string; width: number; height: number; boxed?: boolean }> = {
  "qm-400": { src: "/products/qm-400/nag-qm400-front.jpg", width: 1670, height: 451 },
  "td-series": { src: "/products/td-series/nag-td40-front.jpg", width: 1400, height: 189 },
  "d-8000": { src: "/products/d-8000/nag-d8000-front.jpg", width: 1630, height: 152 },
  "f-8": { src: "/products/f-8/nag-f8-front.jpg", width: 1650, height: 155 },
  "f-8-pro": { src: "/products/f-8-pro/nag-f8pro-front.jpg", width: 1472, height: 137 },
  modules: { src: "/products/modules/nag-module-tds-rear-panel.jpg", width: 1200, height: 1400, boxed: true },
};

/** Lowest price across a series' models, else the product price. */
export function fromPrice(p: ProductFrontmatter): { amount: number; from: boolean } | null {
  const modelPrices = (p.models ?? []).map((m) => m.price).filter((n): n is number => typeof n === "number");
  if (modelPrices.length > 1) return { amount: Math.min(...modelPrices), from: true };
  if (typeof p.price?.amount === "number") return { amount: p.price.amount, from: false };
  return null;
}

/** Catalog row for a product: front photo, subtitle as the summary, two key numbers, price. */
export function productRow(
  p: ProductFrontmatter,
  overrides: Partial<ProductRowProps> = {},
): ProductRowProps {
  const front = FRONT_PHOTO[p.slug];
  const first = p.gallery[0];
  const price = fromPrice(p);
  return {
    name: p.name,
    href: `/catalog/${p.slug}`,
    image: front
      ? { src: front.src, alt: `${p.name}, ${front.boxed ? "вид модуля" : "передняя панель"}`, width: front.width, height: front.height }
      : { src: first.src, alt: first.alt },
    boxed: front ? front.boxed : true,
    summary: p.subtitle,
    spec: p.specChips.slice(0, 2).join(" · ") || undefined,
    price: price ? `${price.from ? "от " : ""}${formatPrice(price.amount)}` : null,
    ...overrides,
  };
}
