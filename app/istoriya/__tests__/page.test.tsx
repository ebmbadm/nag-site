import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import HistoryPage from "../page";

test("renders the approved Novik history introduction and photographs", () => {
  render(<HistoryPage />);

  expect(screen.getByRole("heading", { name: /история компании novik/i })).toBeInTheDocument();
  expect(screen.getByText(/Первая часть этого текста была написана мной более 20 лет назад/i)).toBeInTheDocument();

  const imageSources = Array.from(document.querySelectorAll("img")).map((image) => image.getAttribute("src"));

  for (const src of [
    "/history/novik-history-ship-v5.png",
    "/history/redbear-mk120-1993-dark-stack.jpg",
    "/history/redbear-mke60-1994.jpg",
    "/history/redbear-mkx-cub-combo-1995-front.jpg",
    "/history/novik-n1202-1995.jpg",
    "/history/novik-n1202c-1996.jpg",
    "/history/novik-mk50-combo-1997-1998-front.jpg",
    "/history/novik-pa-602-1997.jpg",
    "/history/novik-pa-1202-1999.jpg",
    "/history/novik-pa-e12-2000.jpg",
    "/history/novik-pa-602-black-fire-2000.jpg",
  ]) {
    expect(imageSources.some((imageSrc) => imageSrc === src || imageSrc?.includes(encodeURIComponent(src)))).toBe(true);
  }

  expect(screen.getByAltText("NOVIK PA 602").getAttribute("src")).toBe("/history/novik-pa-602-1997.jpg");
  expect(screen.getByRole("button", { name: "Открыть фото: NOVIK MK50/25" })).toBeInTheDocument();
  expect(screen.getByAltText("NOVIK PA 1202").getAttribute("src")).toBe("/history/novik-pa-1202-1999.jpg");
});

test("ships PA 602 and PA 1202 as browser-decodable JPEG files", () => {
  for (const fileName of ["novik-pa-602-1997.jpg", "novik-pa-1202-1999.jpg"]) {
    const header = readFileSync(resolve(process.cwd(), "public", "history", fileName)).subarray(0, 3);

    expect([...header]).toEqual([0xff, 0xd8, 0xff]);
  }
});

test("continues directly through 2019 without a second-page link", () => {
  render(<HistoryPage />);

  expect(screen.queryByRole("link", { name: "Продолжение: 2000–2019" })).not.toBeInTheDocument();
  expect(screen.getAllByText("Китай изнутри")).toHaveLength(2);
  expect(screen.getAllByText("Меньше случайного в ассортименте")).toHaveLength(2);
  expect(screen.getByText("Продолжение ещё пишется.")).toBeInTheDocument();
  expect(screen.getByText("Хроника · 1976 — 2019")).toBeInTheDocument();
});

test("uses the standard history photo viewer for the continuation", () => {
  render(<HistoryPage />);

  expect(
    screen.getByRole("button", {
      name: "Открыть фото: Готовые комплекты NOVIK: усилитель и пара акустических систем",
    }),
  ).toBeInTheDocument();
  expect(screen.getByAltText("NOVIK K1512 — акустика начального периода второй части истории.")).toBeInTheDocument();
});

test("keeps low-resolution and portrait equipment photos at a natural reading size", () => {
  render(<HistoryPage />);

  expect(screen.getByRole("button", { name: "Открыть фото: PS600" }).closest("figure")).toHaveClass("max-w-[320px]");
  expect(
    screen.getByRole("button", {
      name: "Открыть фото: АК2512 — активная система с ламповым модулем; в хронологии VIK9 эта линия отнесена к 2002 году.",
    }).closest("figure"),
  ).toHaveClass("max-w-[360px]");
  expect(
    screen.getByRole("button", {
      name: "Открыть фото: SW6025 — сабвуфер собственной акустической линейки; в VIK9 и VK10 указан в группе 2001 года.",
    }).closest("figure"),
  ).toHaveClass("max-w-[360px]");
});
