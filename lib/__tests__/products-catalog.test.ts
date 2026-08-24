import { describe, expect, test } from "vitest";
import { getProduct } from "@/lib/content/products";

describe("DSP BY NAG D-series", () => {
  test("d-4: archived, no price + 2×6 config", () => {
    const p = getProduct("d-4").frontmatter;
    // Discontinued — a price here leaks into the meta description and the archive card.
    expect(p.archived).toBe(true);
    expect(p.price).toBeUndefined();
    expect(p.specChips).toContain("2 вх. XLR");
  });

  test("d-8: archived, no price + 96 kHz (NOT 192) + docs", () => {
    const p = getProduct("d-8").frontmatter;
    expect(p.archived).toBe(true);
    expect(p.price).toBeUndefined();
    const proc = p.specGroups.flatMap((g) => g.rows).find((r) => r.label === "Сигнальный процессор");
    expect(proc?.value).toContain("96 кГц");
    expect(proc?.value).not.toContain("192");
    expect(p.docs?.[0].href).toBe("/downloads/dsp-by-nag-d4-d8-manual-ru.pdf");
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
  test("archived, no price + pink noise + 40 ms total delay + USB-B", () => {
    const p = getProduct("the-rogue").frontmatter;
    expect(p.archived).toBe(true);
    expect(p.price).toBeUndefined();
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
    expect(p.specChips).toContain("4 × 2400 Вт (4 Ω)");
    expect(p.specChips).not.toContain("4 × 2250 Вт (2 Ω)");
    const rows = p.specGroups.flatMap((group) => group.rows);
    expect(rows.find((row) => row.label === "Мощность 4 Ω (RMS, 1 кГц, 1% THD)")?.value).toBe("4 × 2400 Вт");
  });

});

describe("Power amps — series (matrix)", () => {
  test("td-series: TD-100 2400 W, prices incl TD-40 80490 + matrix Цена row", () => {
    const p = getProduct("td-series").frontmatter;
    expect(p.models?.find((m) => m.name === "TD-40")?.price).toBe(80490);
    expect(p.models?.find((m) => m.name === "TD-100")?.config).toBe("2 × 2400 Вт (4 Ω)");
    expect(p.specMatrix?.rows.find((row) => row.label === "4 Ω стерео")?.values[3]).toBe("2 × 2400 Вт");
    const priceRow = p.specMatrix?.rows.find((r) => r.label === "Цена");
    expect(priceRow?.values).toEqual(["70 000 ₽", "80 490 ₽", "110 900 ₽", "120 900 ₽"]);
  });

  test("modules: TDS-20 and TDH-20 use the approved 47900 price", () => {
    const p = getProduct("modules").frontmatter;
    expect(p.category).toBe("Модули NAG");
    expect(p.breadcrumb.map((item) => item.label)).toEqual(["Каталог", "Модули NAG", "TDS / TDH"]);
    const byName = Object.fromEntries((p.models ?? []).map((m) => [m.name, m.price]));
    expect(byName["TDS-20"]).toBe(47900);
    expect(byName["TDH-20"]).toBe(47900);
    expect(p.specChips).toContain("до 2400 Вт (4 Ω)");
    expect(p.models?.find((m) => m.name === "TDS-20")?.config).toBe("2400 Вт (4 Ω)");
    expect(p.models?.find((m) => m.name === "TDH-20")?.config).toBe("2400 Вт (4 Ω)");
    expect(p.specMatrix?.rows.find((r) => r.label === "4 Ω")?.values).toEqual([
      "960 Вт",
      "960 Вт",
      "2400 Вт",
      "2400 Вт",
    ]);
    expect(p.gallery.map((image) => image.src)).toContain(
      "/products/modules/nag-tds-20-installed-in-subwoofer.jpg",
    );
    expect(p.gallery.map((image) => image.src)).toContain(
      "/products/modules/nag-tds-20-interior-with-removed-pcb.jpg",
    );
    expect(p.tech?.image?.src).toBe("/products/modules/nag-tds-20-interior-with-removed-pcb.jpg");
    expect(p.specMatrix?.columns).toEqual(["TDS-10", "TDH-10", "TDS-20", "TDH-20"]);
  });

  test("TD-100 and QM-400 use the approved 2400 W ratings and 8 Ω bridge", () => {
    const td = getProduct("td-series").frontmatter;
    expect(td.specMatrix?.rows.find((row) => row.label === "2 Ω стерео")?.values.at(-1)).toBe("2 × 2400 Вт");
    expect(td.specMatrix?.rows.filter((row) => row.label.includes("bridge")).map((row) => [row.label, row.values.at(-1)])).toEqual([["8 Ω bridge", "4800 Вт"]]);

    const qm = getProduct("qm-400").frontmatter;
    const qmRows = qm.specGroups.flatMap((group) => group.rows);
    expect(qmRows.find((row) => row.label.includes("Мощность 2 Ω"))?.value).toBe("4 × 2400 Вт");
    const qmBridge = qm.specGroups.find((group) => group.title === "Мостовой режим (bridge)");
    expect(qmBridge?.rows).toEqual([
      expect.objectContaining({ label: "Мощность 8 Ω (EIA, 1 кГц, 1% THD)", value: "2 × 4800 Вт" }),
    ]);
    expect(qmRows.some((row) => row.label.includes("Мощность 4 Ω (EIA"))).toBe(false);
  });
});

describe("Tube amps (NOVIK) — по запросу", () => {
  test("all four are price-less (onRequest, no amount)", () => {
    for (const slug of ["e12", "black-fire", "redbear", "n1202"]) {
      const p = getProduct(slug).frontmatter;
      expect(p.price?.onRequest).toBe(true);
      expect(p.price?.amount).toBeUndefined();
      expect(p.line).toBe("Ламповый усилитель · NOVIK");
    }
  });

  test("e12: 2×200 Вт RMS row", () => {
    const rows = getProduct("e12").frontmatter.specGroups.flatMap((g) => g.rows);
    expect(rows.find((r) => r.label === "Мощность RMS")?.value).toBe("2×200 Вт");
  });

  test("redbear: name carries both MKX50 and MKX50+", () => {
    const name = getProduct("redbear").frontmatter.name;
    expect(name).toContain("MKX50");
    expect(name).toContain("MKX50+");
  });

  test("n1202: 2-image gallery + only-on-order note", () => {
    const p = getProduct("n1202").frontmatter;
    expect(p.gallery).toHaveLength(2);
    expect(p.price?.note).toBe("Изготавливается только под заказ");
  });
});
