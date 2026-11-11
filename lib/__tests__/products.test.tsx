import { describe, expect, test } from "vitest";
import { getProductsByCategory } from "@/lib/content/products";
import { render, screen } from "@testing-library/react";
import { ProductRow } from "@/components/ds";
import { getProduct } from "@/lib/content/products";
import { productRow } from "@/lib/content/catalog";

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

describe("productRow", () => {
  test("series show the lowest model price as «от», single models their price", () => {
    expect(productRow(getProduct("td-series").frontmatter).price?.replace(/\s/g, " ")).toBe("от 70 000 ₽");
    expect(productRow(getProduct("qm-400").frontmatter).price?.replace(/\s/g, " ")).toBe("199 900 ₽");
  });

  test("on-request NOVIK models render «По запросу» and use the clean front photo where one exists", () => {
    render(<ProductRow {...productRow(getProduct("e12").frontmatter)} />);
    expect(screen.getByText("По запросу")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/catalog/e12");
    expect(productRow(getProduct("d-8000").frontmatter).image?.src).toBe("/products/d-8000/nag-d8000-front.jpg");
  });
});
