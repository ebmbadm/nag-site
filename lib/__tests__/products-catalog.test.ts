import { describe, expect, test } from "vitest";
import { getProduct } from "@/lib/content/products";

describe("F-series products", () => {
  test("f-8-pro: price + config + table-sourced SNR", () => {
    const p = getProduct("f-8-pro").frontmatter;
    expect(p.price?.amount).toBe(139900);
    expect(p.specChips).toContain("AES/EBU");
    const proc = p.specGroups.flatMap((g) => g.rows);
    expect(proc.find((r) => r.label === "Динамический диапазон / SNR")?.value).toContain("113 dB");
  });

  test("f-8: price + chips", () => {
    const p = getProduct("f-8").frontmatter;
    expect(p.price?.amount).toBe(79900);
    expect(p.specChips).toContain("ADAU1452 · ES9018K2M");
  });
});
