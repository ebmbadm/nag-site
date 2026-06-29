import { describe, expect, test } from "vitest";
import { getProductsByCategory } from "@/lib/content/products";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "@/components/ds";

describe("getProductsByCategory", () => {
  test("returns only products in the category, each tagged correctly", () => {
    const result = getProductsByCategory("Процессоры");
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === "Процессоры")).toBe(true);
    // D-8000 is a processor and always present
    expect(result.map((p) => p.slug)).toContain("d-8000");
  });

  test("unknown category yields empty array", () => {
    expect(getProductsByCategory("НетТакой")).toEqual([]);
  });
});

describe("ProductCard", () => {
  test("renders with image lacking width/height", () => {
    render(
      <ProductCard
        slug="d-8"
        name="DSP BY NAG D-8"
        eyebrow="DSP BY NAG"
        image={{ src: "/products/d-8/x.jpg", alt: "D-8" }}
        price={{ amount: 39900 }}
      />,
    );
    expect(screen.getByText("DSP BY NAG D-8")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/catalog/d-8");
  });
});
