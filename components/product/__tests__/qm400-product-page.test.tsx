import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { getProduct, getProductsByCategory } from "@/lib/content/products";
import { ProductPageView } from "../sections";

const product = getProduct("qm-400").frontmatter;
const related = getProductsByCategory(product.category).filter((r) => r.slug !== "qm-400");

describe("QM-400 product card", () => {
  test("uses the clean front photo, the construction photo and the 2400 W rating", () => {
    render(<ProductPageView product={product} related={related} />);

    expect(screen.getByRole("heading", { level: 1, name: "NAG QM-400" })).toBeInTheDocument();
    expect(screen.getByAltText("NAG QM-400, передняя панель")).toHaveAttribute(
      "src",
      expect.stringContaining("nag-qm400-front.jpg"),
    );
    expect(screen.getByAltText("QM-400 со снятой верхней крышкой")).toBeInTheDocument();
    expect(screen.getAllByText("4 × 2400 Вт").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Четыре канала в одном шасси" })).toBeInTheDocument();
    expect(screen.queryByText("ФЛАГМАН")).toBeNull();
  });

  test("shows the price, one order button, the manual and in-page links", () => {
    render(<ProductPageView product={product} related={related} />);

    expect(screen.getByText(/199\s900\s₽/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Оставить заявку" })).toBeInTheDocument();
    expect(screen.queryByText("Купить в 1 клик")).toBeNull();
    expect(screen.getByRole("link", { name: "Руководство пользователя, PDF" })).toHaveAttribute(
      "href",
      "/downloads/nag-qm-400-manual-ru.pdf",
    );
    const nav = screen.getByRole("navigation", { name: "Разделы страницы" });
    expect(nav.querySelectorAll("a")).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Другие модели" })).toBeInTheDocument();
  });
});
