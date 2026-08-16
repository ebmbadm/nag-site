import { describe, expect, test } from "vitest";
import { getProductSlugs, getProduct, getProductsByCategory } from "@/lib/content/products";

describe("catalog coverage", () => {
  test("exactly the fifteen expected product slugs exist", () => {
    expect(new Set(getProductSlugs())).toEqual(
      new Set([
        "d-4", "d-8", "d-8000", "f-8", "f-8-pro", "the-rogue",
        "qm-400", "td-series", "cx-series", "modules", "tdx",
        "e12", "black-fire", "redbear", "n1202",
      ]),
    );
  });

  test("every product loads without throwing", () => {
    for (const slug of getProductSlugs()) {
      expect(() => getProduct(slug)).not.toThrow();
    }
  });

  test("all six are in the Процессоры category", () => {
    expect(getProductsByCategory("Процессоры")).toHaveLength(6);
  });

  test("only current NAG models are in the Усилители мощности category", () => {
    expect(getProductsByCategory("Усилители мощности").map((p) => p.slug)).toEqual([
      "modules", "qm-400", "td-series",
    ]);
  });

  test("CX and TDX are archived documentation pages, not current products", () => {
    for (const slug of ["cx-series", "tdx"]) {
      const product = getProduct(slug).frontmatter;
      expect(product.archived).toBe(true);
      expect(product.category).toBe("Архивные модели");
      expect(product.price?.amount).toBeUndefined();
      expect(product.docs?.length).toBeGreaterThan(0);
    }
  });

  test("all four tube amps are in the Ламповые усилители category", () => {
    expect(getProductsByCategory("Ламповые усилители")).toHaveLength(4);
  });
});
