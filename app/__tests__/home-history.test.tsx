import { render, screen } from "@testing-library/react";
import { beforeAll, test } from "vitest";
import HomePage from "../page";

beforeAll(() => {
  window.matchMedia = (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  });
});

test("uses the NOVIK N602 guitar stack for the history feature", () => {
  render(<HomePage />);

  expect(screen.getByAltText("NOVIK N602 с колонкой и гитарой")).toBeInTheDocument();
  expect(screen.queryByAltText("RedBear — ламповое наследие NOVIK")).toBeNull();
});

test("uses the NOVIK RedBear photograph for the tube amplifiers category", () => {
  render(<HomePage />);

  expect(screen.getByText("602 · E12 · RedBear")).toBeInTheDocument();
  expect(screen.getByAltText("NOVIK RedBear — передняя панель")).toHaveAttribute(
    "src",
    expect.stringContaining(encodeURIComponent("/products/redbear/novik-redbear-front.png")),
  );
});
