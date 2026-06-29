import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { AreaCards } from "../area-cards";

const cards = [
  { title: "Сейверы", text: "t1", href: "/catalog/savers" },
  { title: "Конвертеры", text: "t2", href: "/catalog/converters" },
  { title: "Индивидуальный заказ", text: "t3", href: "#custom" },
];

describe("AreaCards", () => {
  test("renders one link per card to the right href", () => {
    render(<AreaCards cards={cards} />);
    expect(screen.getByRole("link", { name: /Сейверы/ })).toHaveAttribute("href", "/catalog/savers");
    expect(screen.getByRole("link", { name: /Конвертеры/ })).toHaveAttribute("href", "/catalog/converters");
    expect(screen.getByRole("link", { name: /Индивидуальный заказ/ })).toHaveAttribute("href", "#custom");
  });
});
