import { render, screen } from "@testing-library/react";
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
    expect(screen.getByRole("table", { name: "Характеристики и цены" })).toBeInTheDocument();
  });

  test("every model leads on to a page where it can be ordered", () => {
    render(
      <AmplifiersCategoryPage
        qm400={getProduct("qm-400").frontmatter}
        tdSeries={getProduct("td-series").frontmatter}
      />,
    );

    expect(screen.getByRole("link", { name: "QM-400: цена и заявка" })).toHaveAttribute(
      "href",
      "/catalog/qm-400",
    );
    for (const name of ["TD-100 / TD-80: цена и заявка", "TD-40 / TD-30: цена и заявка"]) {
      expect(screen.getByRole("link", { name })).toHaveAttribute("href", "/catalog/td-series");
    }
  });
});
