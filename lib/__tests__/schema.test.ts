import { describe, it, expect } from "vitest";
import { productFrontmatterSchema } from "../content/schema";

const BASE = {
  slug: "test-product",
  name: "Test",
  line: "Test Line",
  category: "Процессоры",
  breadcrumb: [],
  summary: "Summary text.",
  specChips: [],
  gallery: [{ src: "/img.jpg", alt: "img" }],
  specGroups: [],
};

describe("productFrontmatterSchema", () => {
  it("accepts product with no price field", () => {
    const result = productFrontmatterSchema.safeParse(BASE);
    expect(result.success).toBe(true);
  });

  it("accepts product with onRequest price", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      price: { onRequest: true },
    });
    expect(result.success).toBe(true);
  });

  it("accepts product with numeric amount", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      price: { amount: 122900 },
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.price?.amount).toBe(122900);
  });

  it("accepts partnerLogos array", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      partnerLogos: [{ src: "/logo.png", alt: "Logo", width: 84, height: 24 }],
    });
    expect(result.success).toBe(true);
  });

  it("accepts models array with optional price", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      models: [
        { name: "TD-2000", config: "2×1000W", price: 85000 },
        { name: "TD-1000", config: "2×500W" },
      ],
    });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.models?.[1].price).toBeUndefined();
  });

  it("accepts docs array", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      docs: [{ label: "Скачать ПО", href: "https://disk.yandex.ru/d/abc123" }],
    });
    expect(result.success).toBe(true);
  });

  it("rejects docs with non-url href", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      docs: [{ label: "Скачать", href: "not-a-url" }],
    });
    expect(result.success).toBe(false);
  });

  it("d-8000 existing shape still parses (additive check)", () => {
    const result = productFrontmatterSchema.safeParse({
      ...BASE,
      slug: "d-8000",
      name: "NAG D-8000 WI-FI",
      price: { amount: 122900, currency: "₽", note: "Без НДС" },
      badges: ["BEST SELLER"],
    });
    expect(result.success).toBe(true);
  });
});
