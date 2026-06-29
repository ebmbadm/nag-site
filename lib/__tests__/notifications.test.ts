import { describe, expect, test } from "vitest";
import { formatText, formatTelegram } from "@/lib/notifications";

const base = { kind: "contact" as const, name: "Иван", contact: "+79001234567" };

describe("formatText", () => {
  test("includes kind label, name, contact", () => {
    const text = formatText(base);
    expect(text).toContain("Контакт");
    expect(text).toContain("Иван");
    expect(text).toContain("+79001234567");
  });

  test("includes product slug when present", () => {
    const text = formatText({ ...base, kind: "product", product_slug: "d-8000" });
    expect(text).toContain("d-8000");
  });

  test("includes message when present", () => {
    const text = formatText({ ...base, message: "Нужна доставка" });
    expect(text).toContain("Нужна доставка");
  });

  test("omits message line when absent", () => {
    const text = formatText(base);
    expect(text).not.toContain("Сообщение");
  });
});

describe("formatTelegram", () => {
  test("wraps kind in bold HTML tag", () => {
    const html = formatTelegram(base);
    expect(html).toContain("<b>");
    expect(html).toContain("Контакт");
  });

  test("wraps product slug in code tag", () => {
    const html = formatTelegram({ ...base, kind: "product", product_slug: "f-8-pro" });
    expect(html).toContain("<code>f-8-pro</code>");
  });
});
