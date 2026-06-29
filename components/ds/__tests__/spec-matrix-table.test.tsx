import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SpecMatrixTable } from "../spec-matrix-table";

const COLUMNS = ["TD-2000", "TD-1000"];
const ROWS = [
  { label: "Мощность", values: ["2×1000 Вт", "2×500 Вт"] },
  { label: "Частота", values: ["20–20000 Гц", null] },
  { label: "КНИ", values: [null, null] },
];

describe("SpecMatrixTable", () => {
  it("renders column headers", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("TD-2000")).toBeInTheDocument();
    expect(screen.getByText("TD-1000")).toBeInTheDocument();
  });

  it("renders null values as em dash", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} />);
    const dashes = screen.getAllByText("—");
    expect(dashes.length).toBe(3); // two null values + two in КНИ row = 3 total
  });

  it("renders row labels", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} />);
    expect(screen.getByText("Мощность")).toBeInTheDocument();
    expect(screen.getByText("Частота")).toBeInTheDocument();
  });

  it("renders caption when provided", () => {
    render(<SpecMatrixTable columns={COLUMNS} rows={ROWS} caption="Сравнение моделей" />);
    expect(screen.getByText("Сравнение моделей")).toBeInTheDocument();
  });
});
