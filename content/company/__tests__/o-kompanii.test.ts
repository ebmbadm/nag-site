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
      expect.objectContaining({ year: "2010", label: expect.stringContaining("QM1") }),
      expect.objectContaining({ year: "2019", label: expect.stringContaining("QM400") }),
    ]));
    expect(JSON.stringify(milestones)).not.toMatch(/\bQ1\b/);
    expect(JSON.stringify(milestones)).not.toContain("AODA");
  });

  test("uses the corrected NOVIK model list in the company timeline", () => {
    const milestones = Reflect.get(oKompanii, "historyMilestones") as Array<Record<string, string>>;

    expect(milestones.find((item) => item.year === "1997")).not.toHaveProperty("text");
    expect(milestones).toEqual(expect.arrayContaining([
      expect.objectContaining({ year: "2002", label: expect.stringContaining("АК1512"), text: expect.stringContaining("ламповым модулем мощности") }),
      expect.objectContaining({ year: "2003", label: expect.stringContaining("SW10025") }),
      expect.objectContaining({ year: "2009", label: expect.stringContaining("NG-1") }),
      expect.objectContaining({ year: "2010", text: expect.stringContaining("CAMCO") }),
    ]));
  });
});
