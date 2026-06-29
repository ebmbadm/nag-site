import { describe, expect, test } from "vitest";
import { getProductSlugs, getProduct, getProductsByCategory } from "@/lib/content/products";

describe("catalog coverage", () => {
  test("exactly the eleven expected product slugs exist", () => {
    expect(new Set(getProductSlugs())).toEqual(
      new Set([
        "d-4", "d-8", "d-8000", "f-8", "f-8-pro", "the-rogue",
        "qm-400", "td-series", "cx-series", "modules", "tdx",
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

  test("all five amplifiers are in the Усилители мощности category", () => {
    expect(getProductsByCategory("Усилители мощности")).toHaveLength(5);
  });
});
