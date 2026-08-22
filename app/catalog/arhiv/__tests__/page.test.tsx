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
