import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NAV } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

describe("nav consistency", () => {
  test("header «О компании» points to /o-kompanii", () => {
    expect(NAV.find((i) => i.label === "О компании")?.href).toBe("/o-kompanii");
  });

  test("footer warranty reads the approved two-year term", () => {
    render(<SiteFooter />);
    expect(screen.getByText("Гарантия 2 года")).toBeInTheDocument();
    expect(screen.queryByText(/EAC/)).toBeNull();
    expect(screen.queryByText("EAC · Гарантия 1 год")).toBeNull();
  });
});
