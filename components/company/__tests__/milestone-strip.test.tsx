import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MilestoneStrip } from "../milestone-strip";
import type { HistoryChapter } from "@/lib/content/types";

const chapters: HistoryChapter[] = [
  { id: "a", year: "1976", label: "Начало", title: "Начало деятельности", blocks: [] },
  { id: "b", year: "1992", label: "Бренд", title: "NOVIK", blocks: [] },
];

describe("MilestoneStrip", () => {
  test("renders dated periods and a reserved continuation section", () => {
    render(<MilestoneStrip
      chapters={chapters}
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
