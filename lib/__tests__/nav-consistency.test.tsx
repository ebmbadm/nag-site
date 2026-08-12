import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NAV } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

describe("nav consistency", () => {
  test("header «О компании» points to /o-kompanii", () => {
    expect(NAV.find((i) => i.label === "О компании")?.href).toBe("/o-kompanii");
  });

  test("footer warranty reads «1 год», not «2 года»", () => {
    render(<SiteFooter />);
    expect(screen.getByText("EAC · Гарантия 1 год")).toBeInTheDocument();
    expect(screen.queryByText("EAC · Гарантия 2 года")).toBeNull();
  });

  test("footer catalog includes Modules and combines savers with converters", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Модули" })).toHaveAttribute("href", "/catalog/modules");
    expect(screen.getByRole("link", { name: "Сейверы и конверторы" })).toHaveAttribute("href", "/catalog/boutique");
    expect(screen.queryByRole("link", { name: "Сейверы" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Конвертеры" })).toBeNull();
  });
});
