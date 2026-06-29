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

describe("THE ROGUE", () => {
  test("price + pink noise + 40 ms total delay + USB-B", () => {
    const p = getProduct("the-rogue").frontmatter;
    expect(p.price?.amount).toBe(24900);
    expect(p.specChips).toContain("Розовый шум");
    const rows = p.specGroups.flatMap((g) => g.rows);
    expect(rows.find((r) => r.label === "Задержка")?.value).toContain("40 мс");
    expect(rows.find((r) => r.label === "Интерфейс управления")?.value).toBe("USB Type B");
  });
});

describe("Power amps — single SKU", () => {
  test("qm-400: price 199900 + dual-mode groups", () => {
    const p = getProduct("qm-400").frontmatter;
    expect(p.price?.amount).toBe(199900);
    const titles = p.specGroups.map((g) => g.title);
    expect(titles).toContain("Четырёхканальный режим");
    expect(titles).toContain("Мостовой режим (bridge)");
  });

  test("tdx: price 49900 + Class-D (not Class-TD)", () => {
    const p = getProduct("tdx").frontmatter;
    expect(p.price?.amount).toBe(49900);
    const stage = p.specGroups.flatMap((g) => g.rows).find((r) => r.label === "Тип выходного каскада");
    expect(stage?.value).toBe("Class-D");
  });
});

describe("Power amps — series (matrix)", () => {
  test("td-series: models prices incl TD-40 80490 + matrix Цена row", () => {
    const p = getProduct("td-series").frontmatter;
    expect(p.models?.find((m) => m.name === "TD-40")?.price).toBe(80490);
    const priceRow = p.specMatrix?.rows.find((r) => r.label === "Цена");
    expect(priceRow?.values).toEqual(["70 000 ₽", "80 490 ₽", "110 900 ₽", "120 900 ₽"]);
  });

  test("modules: TDS-20 44490 / TDH-20 44900 (prose, not table 44900)", () => {
    const p = getProduct("modules").frontmatter;
    const byName = Object.fromEntries((p.models ?? []).map((m) => [m.name, m.price]));
    expect(byName["TDS-20"]).toBe(44490);
    expect(byName["TDH-20"]).toBe(44900);
    expect(p.specMatrix?.columns).toEqual(["TDS-10", "TDH-10", "TDS-20", "TDH-20"]);
  });
});
