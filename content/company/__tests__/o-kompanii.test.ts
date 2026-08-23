import { describe, expect, test } from "vitest";
import { oKompanii } from "../o-kompanii";

describe("oKompanii", () => {
  test("separates the verified company timeline and reserves its continuation", () => {
    expect(oKompanii.lede).toBe("Компания создана в 1992 году. NAG — её бренд профессионального звукового оборудования.");
    expect(oKompanii.title).toBe("NOVIK");
    expect(oKompanii.lede).not.toContain("Производство");
    expect(oKompanii.cards[0].text).toContain("Продолжение с 2000 года");
    expect(oKompanii.cards[2].kicker).toBe("1992–2026 · компания NOVIK");
    expect(oKompanii.historyPeriods).toEqual([
      { range: "1976–1992", label: "личная история" },
      { range: "1992–2026", label: "компания NOVIK" },
    ]);
  });

  test("adds the NAG model timeline without exposing internal supplier references", () => {
    const milestones = Reflect.get(oKompanii, "historyMilestones");

    expect(milestones).toEqual(expect.arrayContaining([
      expect.objectContaining({ year: "2006", label: expect.stringContaining("Q15") }),
      expect.objectContaining({ year: "2019", label: expect.stringContaining("QM400") }),
    ]));
    expect(JSON.stringify(milestones)).not.toContain("AODA");
  });
});
