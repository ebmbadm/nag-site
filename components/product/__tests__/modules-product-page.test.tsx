import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { getProduct } from "@/lib/content/products";
import { ModulesProductPage } from "../modules-product-page";

vi.mock("@/components/ds", async (orig) => ({
  ...(await orig<typeof import("@/components/ds")>()),
  Figure: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("ModulesProductPage", () => {
  test("renders the approved dark-layout content and all module models", () => {
    const product = getProduct("modules").frontmatter;
    render(<ModulesProductPage product={product} />);

    expect(screen.getByRole("heading", { name: "TDS / TDH" })).toBeInTheDocument();
    expect(screen.getByAltText("NAG TDS — задняя панель модуля").parentElement).toHaveClass(
      "bg-photo-backdrop",
    );
    expect(screen.getAllByText("TDS-10")).not.toHaveLength(0);
    expect(screen.getAllByText("TDH-10")).not.toHaveLength(0);
    expect(screen.getAllByText("TDS-20")).not.toHaveLength(0);
    expect(screen.getAllByText("TDH-20")).not.toHaveLength(0);
    expect(screen.getByText("Запас, который слышно.")).toBeInTheDocument();
    expect(screen.getByText("Рассчитан на реальную работу.")).toBeInTheDocument();
    expect(screen.getByAltText(/установленный в сабвуфер/i)).toBeInTheDocument();
    expect(screen.getByAltText(/со снятой платой/i)).toBeInTheDocument();
  });
});
