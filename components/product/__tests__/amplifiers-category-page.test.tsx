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
});
