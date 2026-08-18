import { render, screen } from "@testing-library/react";
import { test, expect } from "vitest";
import ProcessorsPage from "../page";

test("keeps DSP BY NAG processor cards out of the current processors catalogue", () => {
  render(<ProcessorsPage />);

  expect(screen.queryByText("DSP BY NAG THE ROGUE")).not.toBeInTheDocument();
  expect(screen.queryByText("DSP BY NAG D-4")).not.toBeInTheDocument();
  expect(screen.queryByText("DSP BY NAG D-8")).not.toBeInTheDocument();
  expect(screen.getByText("от 72 000 ₽")).toBeInTheDocument();
});
