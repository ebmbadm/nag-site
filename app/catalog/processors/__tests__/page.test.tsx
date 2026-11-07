import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import { getProductsByCategory } from "@/lib/content/products";
import { formatPrice } from "@/lib/format";
import ProcessorsPage from "../page";

test("keeps DSP BY NAG processor cards out of the current processors catalogue", () => {
  render(<ProcessorsPage />);

  expect(screen.queryByText("DSP BY NAG THE ROGUE")).not.toBeInTheDocument();
  expect(screen.queryByText("DSP BY NAG D-4")).not.toBeInTheDocument();
  expect(screen.queryByText("DSP BY NAG D-8")).not.toBeInTheDocument();
});

test("headline price is the cheapest processor actually on sale", () => {
  render(<ProcessorsPage />);

  const cheapest = Math.min(
    ...getProductsByCategory("Процессоры").map((p) => p.price?.amount ?? Infinity),
  );
  expect(screen.getByText(`от ${formatPrice(cheapest).replace(/\s/g, " ")}`)).toBeInTheDocument();
});
