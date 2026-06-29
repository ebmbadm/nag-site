import { describe, expect, test } from "vitest";
import { getProduct } from "@/lib/content/products";

describe("DSP BY NAG D-series", () => {
  test("d-4: price + 2×6 config", () => {
    const p = getProduct("d-4").frontmatter;
    expect(p.price?.amount).toBe(34900);
    expect(p.specChips).toContain("2 вх. XLR");
  });

  test("d-8: price + 96 kHz (NOT 192) + docs", () => {
    const p = getProduct("d-8").frontmatter;
    expect(p.price?.amount).toBe(39900);
    const proc = p.specGroups.flatMap((g) => g.rows).find((r) => r.label === "Сигнальный процессор");
    expect(proc?.value).toContain("96 кГц");
    expect(proc?.value).not.toContain("192");
    expect(p.docs?.[0].href).toBe("https://disk.yandex.ru/d/EDKxSOM4s-4yfg");
  });
});

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
