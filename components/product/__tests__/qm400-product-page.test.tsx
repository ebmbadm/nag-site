import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { getProduct } from "@/lib/content/products";
import { Qm400ProductPage } from "../qm400-product-page";

describe("Qm400ProductPage", () => {
  test("uses the approved amplifier photos and presents the current 2400 W rating", () => {
    render(<Qm400ProductPage product={getProduct("qm-400").frontmatter} />);

    expect(screen.getByRole("heading", { name: "QM-400" })).toBeInTheDocument();
    expect(screen.getByAltText("NAG QM-400 — передняя панель").parentElement).toHaveClass(
      "bg-photo-backdrop",
    );
    expect(screen.getByAltText("QM-400 со снятой верхней крышкой")).toBeInTheDocument();
    expect(screen.getByText("4 × 2400 Вт")).toBeInTheDocument();
    expect(screen.getByText("Четыре канала в одном шасси.")).toBeInTheDocument();
  });
});
