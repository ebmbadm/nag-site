import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { getProduct } from "@/lib/content/products";
import { ModulesProductPage } from "../modules-product-page";

vi.mock("@/components/ds", async (orig) => ({
  ...(await orig<typeof import("@/components/ds")>()),
  Figure: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

describe("ModulesProductPage", () => {
  test("renders the approved hero and two photographic content blocks", () => {
    const product = getProduct("modules").frontmatter;
    render(<ModulesProductPage product={product} />);

    expect(screen.getByRole("heading", { name: "NAG TDS / TDH" })).toBeInTheDocument();
    expect(screen.getByText("Запас, который слышно.")).toBeInTheDocument();
    expect(screen.getByText("Рассчитан на реальную работу.")).toBeInTheDocument();
    expect(screen.getByAltText(/установленный в сабвуфер/i)).toBeInTheDocument();
    expect(screen.getByAltText(/со снятой платой/i)).toBeInTheDocument();
  });
});
