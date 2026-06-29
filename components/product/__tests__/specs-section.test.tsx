import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { SpecsSection } from "../sections";

const groups = [{ title: "Общие", rows: [{ label: "THD+N", value: "0.1 %" }] }];

describe("SpecsSection", () => {
  test("renders the SpecMatrixTable when specMatrix is present", () => {
    render(
      <SpecsSection
        groups={groups}
        specMatrix={{
          columns: ["TD-30", "TD-40"],
          rows: [{ label: "4 Ω", values: ["2 × 400 Вт", "2 × 600 Вт"] }],
        }}
      />,
    );
    expect(screen.getByText("Сравнение моделей")).toBeInTheDocument();
    expect(screen.getByText("TD-30")).toBeInTheDocument();
    expect(screen.getByText("2 × 600 Вт")).toBeInTheDocument();
  });

  test("renders no matrix when specMatrix is absent", () => {
    render(<SpecsSection groups={groups} />);
    expect(screen.queryByText("Сравнение моделей")).toBeNull();
  });
});
