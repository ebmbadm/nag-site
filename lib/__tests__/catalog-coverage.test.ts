import { describe, expect, test } from "vitest";
import { getProductSlugs, getProduct, getProductsByCategory } from "@/lib/content/products";

describe("catalog coverage", () => {
  test("lists only current products, excluding archived CX and TDX", () => {
    expect(new Set(getProductSlugs())).toEqual(
      new Set([
        "d-4", "d-8", "d-8000", "f-8", "f-8-pro", "the-rogue",
        "qm-400", "td-series", "modules",
        "mq-series", "rf-series", "qm-series",
        "q-series", "rd-series", "ra-series", "ma-series",
        "novik-tube-archive", "novik-acoustics",
        "e12", "black-fire", "redbear", "n1202",
      ]),
    );
  });

  test("every product loads without throwing", () => {
    for (const slug of getProductSlugs()) {
      expect(() => getProduct(slug)).not.toThrow();
    }
  });

  test("keeps only three current processors after DSP BY NAG moves to the archive", () => {
    expect(getProductsByCategory("Процессоры")).toHaveLength(3);
  });

  test("only QM-400 and TD are active power amplifiers", () => {
    const amplifiers = getProductsByCategory("Усилители мощности");
    expect(amplifiers.map((product) => product.slug)).toEqual(["qm-400", "td-series"]);
  });

  test("all four tube amps are in the Ламповые усилители category", () => {
    expect(getProductsByCategory("Ламповые усилители")).toHaveLength(4);
  });
});
