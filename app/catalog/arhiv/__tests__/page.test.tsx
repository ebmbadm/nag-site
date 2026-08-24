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

  expect(screen.getByText("NAG QM SERIES")).toBeInTheDocument();
  expect(screen.getByText("NAG RF SERIES")).toBeInTheDocument();
  expect(screen.getByText("NAG MQ SERIES")).toBeInTheDocument();
});

test("designations without a spec table stay chips, not cards", () => {
  render(<ArchivePage />);

  expect(
    screen.getByRole("heading", { name: "Другие архивные обозначения NAG" }),
  ).toBeInTheDocument();
  expect(screen.getByText("NAG RD-1600")).toBeInTheDocument();
  expect(screen.queryByRole("link", { name: /NAG RD-1600/ })).not.toBeInTheDocument();
});
