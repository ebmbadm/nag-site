import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { ProductHero } from "../sections";
import type { ProductFrontmatter } from "@/lib/content/schema";

// Gallery uses embla (client carousel); stub it so jsdom renders the hero cleanly.
vi.mock("@/components/ds", async (orig) => ({
  ...(await orig<typeof import("@/components/ds")>()),
  Gallery: () => null,
}));

const base: ProductFrontmatter = {
  slug: "x",
  name: "TEST",
  line: "Ламповый усилитель · NOVIK",
  badges: [],
  category: "Ламповые усилители",
  breadcrumb: [],
  summary: "summary",
  specChips: [],
  gallery: [{ src: "/a.png", alt: "a" }],
  specGroups: [{ title: "Характеристики", rows: [{ label: "Вес", value: "12 кг" }] }],
};

describe("ProductHero price branch", () => {
  test("on-request product shows «Цена по запросу» + «Запросить расчёт», no cart", () => {
    render(
      <ProductHero
        product={{ ...base, price: { onRequest: true, note: "Изготавливается под заказ" } }}
        slug="x"
      />,
    );
    expect(screen.getByText("Цена по запросу")).toBeInTheDocument();
    expect(screen.getByText("Запросить расчёт")).toBeInTheDocument();
    expect(screen.queryByText("Розничная цена")).toBeNull();
    expect(screen.queryByText("В корзину")).toBeNull();
  });

  test("priced product still shows «Розничная цена» + «В корзину» (no regression)", () => {
    render(
      <ProductHero product={{ ...base, price: { amount: 100000, currency: "₽" } }} slug="x" />,
    );
    expect(screen.getByText("Розничная цена")).toBeInTheDocument();
    expect(screen.getByText("В корзину")).toBeInTheDocument();
    expect(screen.queryByText("Цена по запросу")).toBeNull();
  });
});
