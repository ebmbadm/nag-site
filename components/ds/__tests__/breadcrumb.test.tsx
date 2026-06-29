import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Breadcrumb } from "../breadcrumb";

describe("Breadcrumb", () => {
  test("only the last item is aria-current=page", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Каталог" },
          { label: "Процессоры", href: "/catalog/processors" },
          { label: "D-8" },
        ]}
      />,
    );
    // href-less, NOT last → must not be marked current (the bug being fixed)
    expect(screen.getByText("Каталог")).not.toHaveAttribute("aria-current");
    // linked middle item is a real link
    expect(screen.getByText("Процессоры").tagName).toBe("A");
    // last item is the current page
    expect(screen.getByText("D-8")).toHaveAttribute("aria-current", "page");
  });
});
