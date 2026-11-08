import { render, screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import HomePage from "../page";

test("first screen states what we do, with one red action and the phone", () => {
  const { container } = render(<HomePage />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Усилители мощности, DSP-процессоры и модули NAG. Ламповые усилители NOVIK.",
    }),
  ).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Подобрать оборудование" }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole("link", { name: "+7 921 937 25 08" })[0]).toHaveAttribute("href", "tel:+79219372508");
  // No hero metric row and no photo on the first screen.
  expect(container.querySelector("[data-testid='hero-principles']")).toBeNull();
});

test("catalog sections run amplifiers, processors, modules, NOVIK — as rows, not cards", () => {
  render(<HomePage />);

  const titles = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
  expect(titles.slice(0, 4)).toEqual([
    "Усилители мощности",
    "DSP-процессоры",
    "Встраиваемые модули",
    "Ламповые усилители NOVIK",
  ]);

  const amps = screen.getByRole("heading", { name: "Усилители мощности" }).closest("section")!;
  expect(within(amps).getByRole("link", { name: /NAG QM-400/ })).toHaveAttribute("href", "/catalog/qm-400");
  expect(within(amps).getByRole("link", { name: /NAG TD SERIES/ })).toHaveTextContent("от 70 000 ₽");

  const modules = screen.getByRole("heading", { name: "Встраиваемые модули" }).closest("section")!;
  expect(modules).toHaveTextContent("от 41 900 ₽");
});

test("NOVIK tube amplifiers credit Sergei Novikov and show «По запросу»", () => {
  render(<HomePage />);

  const novik = screen.getByRole("heading", { name: "Ламповые усилители NOVIK" }).closest("section")!;
  expect(novik).toHaveTextContent("Ламповые усилители — часть истории Сергея Новикова с 1976 года.");
  expect(novik).not.toHaveTextContent("Александра Новикова");
  expect(within(novik).getAllByText("По запросу").length).toBeGreaterThan(0);
});

test("one dark band — «Подбор под задачу проекта» — and no unverified claims", () => {
  const { container } = render(<HomePage />);

  const dark = container.querySelectorAll("[data-theme='dark']");
  expect(dark).toHaveLength(1);
  expect(dark[0]).toHaveTextContent("Подбор под задачу проекта");
  expect(container).not.toHaveTextContent(/российск|от производителя|EAC|40\+/i);
});
