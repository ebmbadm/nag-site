import { describe, expect, test } from "vitest";
import { oKompanii } from "../o-kompanii";

describe("oKompanii", () => {
  test("separates the verified company timeline and reserves its continuation", () => {
    expect(oKompanii.lede).toContain("1992");
    expect(oKompanii.lede).not.toContain("Производство");
    expect(oKompanii.cards[0].text).toContain("Продолжение с 2000 года");
    expect(oKompanii.cards[2].kicker).toBe("1992–2026 · компания NAG");
    expect(oKompanii.historyPeriods).toEqual([
      { range: "1976–1992", label: "личная история" },
      { range: "1992–2026", label: "компания NAG" },
    ]);
  });
});
