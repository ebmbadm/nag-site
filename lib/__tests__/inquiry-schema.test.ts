import { describe, expect, test } from "vitest";
import { inquirySchema } from "@/lib/inquiry/validate";

describe("inquirySchema", () => {
  const valid = {
    kind: "contact" as const,
    name: "Иван",
    contact: "+79001234567",
    website: "",
  };

  test("valid contact payload passes", () => {
    const result = inquirySchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  test("valid product payload passes", () => {
    const result = inquirySchema.safeParse({
      ...valid,
      kind: "product",
      product_slug: "d-8000",
    });
    expect(result.success).toBe(true);
  });

  test("honeypot non-empty → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, website: "spam" });
    expect(result.success).toBe(false);
  });

  test("empty name → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, name: "" });
    expect(result.success).toBe(false);
  });

  test("empty contact → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, contact: "" });
    expect(result.success).toBe(false);
  });

  test("unknown kind → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, kind: "cart" });
    expect(result.success).toBe(false);
  });

  test("message over 2000 chars → fails", () => {
    const result = inquirySchema.safeParse({ ...valid, message: "x".repeat(2001) });
    expect(result.success).toBe(false);
  });

  test("optional fields absent → passes", () => {
    // product_slug, message, source_url all optional
    const result = inquirySchema.safeParse({ kind: "boutique", name: "A", contact: "B", website: "" });
    expect(result.success).toBe(true);
  });
});
