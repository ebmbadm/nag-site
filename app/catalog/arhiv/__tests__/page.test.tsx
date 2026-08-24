import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import ArchivePage from "../page";

test("shows archived DSP BY NAG models as product cards", () => {
  render(<ArchivePage />);

  expect(screen.getByRole("heading", { name: "Архивные процессоры NAG" })).toBeInTheDocument();
  expect(screen.getByText("DSP BY NAG THE ROGUE")).toBeInTheDocument();
  expect(screen.getByText("DSP BY NAG D-4")).toBeInTheDocument();
  expect(screen.getByText("DSP BY NAG D-8")).toBeInTheDocument();
});

test("shows the archived transistor series as product cards", () => {
  render(<ArchivePage />);

  for (const name of [
    "NAG QM SERIES",
    "NAG MA SERIES",
    "NAG RA SERIES",
    "NAG RD SERIES",
    "NAG Q SERIES",
    "NAG RF SERIES",
    "NAG MQ SERIES",
  ]) {
    expect(screen.getByText(name)).toBeInTheDocument();
  }
});

test("shows the archived NOVIK tube amps and speakers as product cards", () => {
  render(<ArchivePage />);

  expect(screen.getByText("АРХИВ ЛАМПОВЫХ NOVIK")).toBeInTheDocument();
  expect(screen.getByText("АРХИВ АКУСТИКИ NOVIK")).toBeInTheDocument();
});

test("designations without a spec table stay chips, not cards", () => {
  render(<ArchivePage />);

  expect(
    screen.getByRole("heading", { name: "Другие архивные обозначения NAG" }),
  ).toBeInTheDocument();
  expect(screen.getByText("NAG RD-2000")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /NAG RD-2000/ })).not.toBeInTheDocument();
});
