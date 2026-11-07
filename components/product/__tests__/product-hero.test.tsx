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
      />,
    );
    expect(screen.getByText("Цена по запросу")).toBeInTheDocument();
    expect(screen.getByText("Запросить расчёт")).toBeInTheDocument();
    expect(screen.queryByText("Розничная цена")).toBeNull();
    expect(screen.queryByText("Оставить заявку")).toBeNull();
  });

  test("priced product still shows «Розничная цена» + «Оставить заявку» (no regression)", () => {
    render(<ProductHero product={{ ...base, price: { amount: 100000, currency: "₽" } }} />);
    expect(screen.getByText("Розничная цена")).toBeInTheDocument();
    expect(screen.getByText("Оставить заявку")).toBeInTheDocument();
    expect(screen.queryByText("Цена по запросу")).toBeNull();
  });

  test("archived model offers trade-in and repair instead of a price", () => {
    render(<ProductHero product={{ ...base, archived: true }} />);

    expect(screen.getByRole("button", { name: "Обмен и ремонт" })).toBeInTheDocument();
    expect(screen.queryByText("Оставить заявку")).toBeNull();
    expect(screen.queryByText("Розничная цена")).toBeNull();
  });
});
