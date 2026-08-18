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

test("introduces all four NAG directions without unverified claims", () => {
  render(<HomePage />);

  expect(
    screen.getByText(
      "DSP-процессоры, усилители мощности и встраиваемые модули NAG. Ламповая техника NOVIK.",
    ),
  ).toBeInTheDocument();
  const heroHeading = screen.getByRole("heading", {
    name: "ВСЁ ДЛЯ РЕАЛЬНОЙ РАБОТЫ СО ЗВУКОМ.",
  });
  expect(heroHeading).toHaveClass("text-[clamp(34px,3.5vw,50px)]");
  expect(screen.getByText("Инженерный подход")).toBeInTheDocument();
  expect(screen.queryByText("40+")).toBeNull();
  expect(screen.queryByText("EAC")).toBeNull();
});

test("steps catalogue and trust bands from graphite to a lighter chassis tone", () => {
  const { container } = render(<HomePage />);

  const catalogue = container.querySelector(".catalog-v5[data-surface='dark']");
  expect(catalogue).toHaveStyle({ backgroundColor: "var(--surface)" });
  expect(catalogue?.querySelectorAll("a.bg-surface-2")).toHaveLength(4);

  const trustBand = screen.getByText("Инженерный подход").closest("[data-surface='dark']");
  expect(trustBand).toHaveStyle({ backgroundColor: "var(--surface-2)" });
});

test("does not give QM-400 a standalone featured block on the home page", () => {
  const { container } = render(<HomePage />);

  expect(screen.queryByRole("heading", { name: "NAG QM-400" })).toBeNull();
  expect(container.querySelector(".product-v6")).toBeNull();
});

test("uses three sales principles instead of duplicating the catalogue in the hero", () => {
  render(<HomePage />);

  const principles = screen.getByTestId("hero-principles");

  expect(principles).toHaveTextContent("CLASS-TD");
  expect(principles).toHaveTextContent("качество звука");
  expect(principles).toHaveTextContent("длительная эксплуатация");
  expect(principles).toHaveTextContent("до и после гарантии");
  expect(principles.children).toHaveLength(3);
});

test("separates the hero catalogue link from the full catalogue link", () => {
  render(<HomePage />);

  const catalogueLinks = screen.getAllByRole("link", { name: "Смотреть каталог" });

  expect(catalogueLinks[0]).toHaveAttribute("href", "#catalog");
  expect(screen.getByRole("link", { name: "Весь каталог" })).toHaveAttribute("href", "/catalog");
});

test("uses equipment, not amplifier, in the consultation block", () => {
  render(<HomePage />);

  expect(screen.getByRole("heading", { name: /Подберём оборудование.*под вашу задачу/ })).toBeInTheDocument();
});

test("uses the Vik 8 range, prices, and amplifiers label in the home catalogue", () => {
  render(<HomePage />);

  const equipment = screen.getByRole("heading", { name: "Усилители" }).closest("a");
  const modules = screen.getByRole("heading", { name: "Модули" }).closest("a");
  const processors = screen.getByRole("heading", { name: "Процессоры" }).closest("a");

  expect(equipment).toHaveTextContent("QM400 · TD100/80 · TD40/30");
  expect(equipment).toHaveTextContent("от 70 000 ₽");
  expect(modules).toHaveTextContent("TDS20/10 · TDH20/10");
  expect(modules).toHaveTextContent("от 41 900 ₽");
  expect(processors).toHaveTextContent("от 72 000 ₽");
});
