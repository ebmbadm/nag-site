import { render, screen, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { getProduct } from "@/lib/content/products";
import { AmplifiersCategoryPage } from "../amplifiers-category-page";

describe("AmplifiersCategoryPage", () => {
  test("shows the QM-400 flagship, both TD pairs, and their shared comparison", () => {
    render(
      <AmplifiersCategoryPage
        qm400={getProduct("qm-400").frontmatter}
        tdSeries={getProduct("td-series").frontmatter}
      />,
    );

    expect(screen.getByRole("heading", { name: "QM-400" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "TD-100 / TD-80" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "TD-40 / TD-30" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Характеристики и цены" })).toBeInTheDocument();

    const table = screen.getByRole("table");
    const heads = within(table).getAllByRole("columnheader").map((th) => th.textContent);
    expect(heads).toEqual(["QM-400", "TD-100", "TD-80", "TD-40", "TD-30"]);
    expect(within(table).getByRole("row", { name: /Цена/ })).toHaveTextContent(
      /199\s900 ₽.*120\s900 ₽.*110\s900 ₽.*80\s490 ₽.*70\s000 ₽/,
    );
  });

  test("every model leads on to a page where it can be ordered", () => {
    render(
      <AmplifiersCategoryPage
        qm400={getProduct("qm-400").frontmatter}
        tdSeries={getProduct("td-series").frontmatter}
      />,
    );

    expect(screen.getByRole("link", { name: /NAG QM-400/ })).toHaveAttribute("href", "/catalog/qm-400");
    for (const name of [/TD-100 \/ TD-80/, /TD-40 \/ TD-30/]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", "/catalog/td-series");
    }
  });
});
