import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ProductBuyBox } from "../sections";
import type { ProductFrontmatter } from "@/lib/content/schema";

const base: ProductFrontmatter = {
  slug: "x",
  name: "TEST",
  line: "Ламповый усилитель · NOVIK",
  badges: ["HI-END"],
  archived: false,
  category: "Ламповые усилители",
  breadcrumb: [],
  summary: "summary",
  specChips: [],
  gallery: [{ src: "/a.png", alt: "a" }],
  specGroups: [{ title: "Характеристики", rows: [{ label: "Вес", value: "12 кг" }] }],
};

describe("ProductBuyBox price branch", () => {
  test("on-request product shows «По запросу» + «Запросить расчёт», no order button", () => {
    render(<ProductBuyBox product={{ ...base, price: { onRequest: true, currency: "₽", note: "Изготавливается под заказ" } }} />);
    expect(screen.getByText("По запросу")).toBeInTheDocument();
    expect(screen.getByText("Изготавливается под заказ")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Запросить расчёт" })).toBeInTheDocument();
    expect(screen.queryByText("Оставить заявку")).toBeNull();
  });

  test("priced product shows the price, the phone and «Оставить заявку»", () => {
    render(<ProductBuyBox product={{ ...base, price: { amount: 100000, currency: "₽" } }} />);
    expect(screen.getByText(/100\s000\s₽/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Оставить заявку" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+7 921 937 25 08" })).toHaveAttribute("href", "tel:+79219372508");
    expect(screen.getByText("12 кг")).toBeInTheDocument();
    expect(screen.queryByText("По запросу")).toBeNull();
    expect(screen.queryByText("HI-END")).toBeNull();
  });

  test("archived model offers trade-in and repair instead of a price", () => {
    render(<ProductBuyBox product={{ ...base, archived: true }} />);
    expect(screen.getByRole("button", { name: "Обмен и ремонт" })).toBeInTheDocument();
    expect(screen.queryByText("Оставить заявку")).toBeNull();
    expect(screen.queryByText(/₽/)).toBeNull();
  });
});
