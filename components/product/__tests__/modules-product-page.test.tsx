import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { getProduct } from "@/lib/content/products";
import { ProductPageView } from "../sections";

const product = getProduct("modules").frontmatter;

describe("Modules product card", () => {
  test("renders the module photos, all models and the practice text", () => {
    render(<ProductPageView product={product} />);

    expect(screen.getByRole("heading", { level: 1, name: "NAG TDS / TDH SERIES" })).toBeInTheDocument();
    expect(screen.getByAltText("NAG TDS / TDH SERIES, вид модуля")).toBeInTheDocument();
    for (const name of ["TDS-10", "TDH-10", "TDS-20", "TDH-20"]) {
      expect(screen.getAllByText(name)).not.toHaveLength(0);
    }
    expect(screen.getByRole("heading", { name: "Запас, который слышно" })).toBeInTheDocument();
    expect(screen.getByAltText(/установленный в сабвуфер/i)).toBeInTheDocument();
    expect(screen.getAllByAltText(/со снятой платой/i)).not.toHaveLength(0);
  });

  test("показывает цену от младшей модели и кнопку заявки", () => {
    render(<ProductPageView product={product} />);

    expect(screen.getByText(/от 41\s900\s₽/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Оставить заявку" })).toBeInTheDocument();
  });

  test("общие характеристики выводятся текстом, а не скриншотом таблицы", () => {
    render(<ProductPageView product={product} />);

    expect(screen.getByText("Общие характеристики")).toBeInTheDocument();
    expect(screen.getByText(/едины для TDS-10, TDH-10, TDS-20 и TDH-20/)).toBeInTheDocument();
    expect(screen.getAllByText("Демпинг-фактор")).not.toHaveLength(0);
    expect(screen.getAllByText(">900")).not.toHaveLength(0);
    expect(screen.getByText("376 × 132 × 78 мм")).toBeInTheDocument();
    expect(screen.getByText(/active inrush limiting/)).toBeInTheDocument();
    expect(screen.queryByAltText(/Сводные характеристики/)).toBeNull();
  });
});
