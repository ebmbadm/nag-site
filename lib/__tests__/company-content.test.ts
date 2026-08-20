import { describe, expect, test } from "vitest";
import { getContacts, getGuarantee, getCompanyHub } from "@/lib/content/company";

describe("company content loaders", () => {
  test("contacts: phone/email hrefs + stubbed form", () => {
    const c = getContacts();
    expect(c.phone.href).toBe("tel:+79219372508");
    expect(c.email.href).toBe("mailto:novikamps@mail.ru");
    expect(c.email.display).toBe("novikamps@mail.ru");
    expect(c.form.disabled).toBe(true);
  });

  test("guarantee: approved 2-year term, CTA → /kontakty", () => {
    const g = getGuarantee();
    expect(g.terms).toHaveLength(1);
    expect(g.terms[0].value).toBe("2 года");
    expect(g.cta.href).toBe("/kontakty");
    expect(g.service.blocks.length).toBeGreaterThan(0);
  });

  test("hub: 3 cards to real routes and a reserved history continuation", () => {
    const h = getCompanyHub();
    expect(h.cards.map((c) => c.href)).toEqual(["/istoriya", "/garantiya", "/kontakty"]);
    expect(h.historyPeriods).toEqual([
      { range: "1976–1992", label: "личная история" },
      { range: "1992–2026", label: "компания NOVIK" },
    ]);
    expect(h.historyContinuation.range).toBe("2000–2026");
    expect(JSON.stringify(h)).not.toContain("700+");
  });
});
