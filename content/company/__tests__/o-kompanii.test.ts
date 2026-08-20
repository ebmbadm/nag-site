import { describe, expect, test } from "vitest";
import { oKompanii } from "../o-kompanii";

describe("oKompanii", () => {
  test("separates the verified company timeline and reserves its continuation", () => {
    expect(oKompanii.lede).toContain("Компания NOVIK создана в 1992 году");
    expect(oKompanii.lede).toContain("NAG — бренд компании NOVIK");
    expect(oKompanii.title).toBe("Компания NOVIK · бренд NAG");
    expect(oKompanii.lede).not.toContain("Производство");
    expect(oKompanii.cards[0].text).toContain("Продолжение с 2000 года");
    expect(oKompanii.cards[2].kicker).toBe("1992–2026 · компания NOVIK");
    expect(oKompanii.historyPeriods).toEqual([
      { range: "1976–1992", label: "личная история" },
      { range: "1992–2026", label: "компания NOVIK" },
    ]);
  });
});
