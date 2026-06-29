import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { MilestoneStrip } from "../milestone-strip";
import type { HistoryChapter } from "@/lib/content/types";

const chapters: HistoryChapter[] = [
  { id: "a", year: "1976", label: "Начало", title: "Начало деятельности", blocks: [] },
  { id: "b", year: "1992", label: "Бренд", title: "NOVIK", blocks: [] },
];

describe("MilestoneStrip", () => {
  test("renders one node per chapter + a link to /istoriya + the stat", () => {
    render(<MilestoneStrip chapters={chapters} stat={{ value: "Более 40 лет", label: "ручной сборки" }} />);
    expect(screen.getByText("1976")).toBeInTheDocument();
    expect(screen.getByText("1992")).toBeInTheDocument();
    expect(screen.getByText("Более 40 лет")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /историю/i });
    expect(link).toHaveAttribute("href", "/istoriya");
  });
});
