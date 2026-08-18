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

test("places modules before tube amplifiers in the home catalogue", () => {
  render(<HomePage />);

  const modulesCard = screen.getByRole("heading", { name: "Модули" }).closest("a");
  const tubesCard = screen.getByRole("heading", { name: "Лампа" }).closest("a");

  expect(modulesCard).not.toBeNull();
  expect(tubesCard).not.toBeNull();
  expect(modulesCard?.compareDocumentPosition(tubesCard as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

test("uses cautious NAG editorial copy without unverified claims", () => {
  render(<HomePage />);

  expect(
    screen.getByText("Усилители мощности, DSP-процессоры и встраиваемые модули NAG."),
  ).toBeInTheDocument();
  expect(screen.getByText("Инженерный подход")).toBeInTheDocument();
  expect(screen.queryByText("40+")).toBeNull();
  expect(screen.queryByText("EAC")).toBeNull();
});
