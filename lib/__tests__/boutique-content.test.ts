import { describe, expect, test } from "vitest";
import { getBoutique, getSavers, getConverters } from "@/lib/content/boutique";

describe("boutique content loaders", () => {
  test("every CTA targets /kontakty (never /rqst-tubes)", () => {
    for (const p of [getBoutique(), getSavers(), getConverters()]) {
      expect(p.cta.href).toBe("/kontakty");
      expect(JSON.stringify(p)).not.toContain("/rqst-tubes");
    }
  });

  test("landing: 3 area cards to savers / converters / #custom", () => {
    expect(getBoutique().areaCards?.map((c) => c.href)).toEqual([
      "/catalog/savers",
      "/catalog/converters",
      "#custom",
    ]);
  });

  test("savers + converters: 4 feature items; converters has a dark hero variant", () => {
    expect(getSavers().features?.items).toHaveLength(4);
    expect(getConverters().features?.items).toHaveLength(4);
    expect(getConverters().heroDark?.src).toContain("converter-pro-40-dark");
  });
});
