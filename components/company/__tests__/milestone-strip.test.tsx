import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MilestoneStrip } from "../milestone-strip";
import type { CompanyMilestone } from "@/lib/content/types";

const milestones: CompanyMilestone[] = [
  { year: "1976", label: "Начало деятельности" },
  { year: "1992", label: "NOVIK", accentLabel: "Бренд" },
];

describe("MilestoneStrip", () => {
  test("renders dated periods and a reserved continuation section", () => {
    render(<MilestoneStrip
      milestones={milestones}
      periods={[
        { range: "1976–1992", label: "личная история" },
        { range: "1992–2026", label: "компания NOVIK" },
      ]}
      continuation={{ range: "2000–2026", title: "Продолжение", text: "Модели и даты будут добавлены здесь." }}
    />);
    expect(screen.getByText("1976")).toBeInTheDocument();
    expect(screen.getByText("1992")).toBeInTheDocument();
    expect(screen.getByText("личная история")).toBeInTheDocument();
    expect(screen.getByText("Модели и даты будут добавлены здесь.")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /историю/i });
    expect(link).toHaveAttribute("href", "/istoriya");
  });
});
