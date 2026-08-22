import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import HistoryPage from "../page";

test("renders the approved Novik history introduction and photographs", () => {
  render(<HistoryPage />);

  expect(screen.getByRole("heading", { name: /история компании novik/i })).toBeInTheDocument();
  expect(screen.getByText(/Этот текст был написан мной более 20 лет назад/i)).toBeInTheDocument();

  const imageSources = Array.from(document.querySelectorAll("img")).map((image) => image.getAttribute("src"));

  for (const src of [
    "/history/novik-history-ship-v5.png",
    "/history/redbear-mk120-1993-dark-stack.jpg",
    "/history/redbear-mke60-1994.jpg",
    "/history/redbear-mkx-cub-combo-1995-front.jpg",
    "/history/novik-n1202-1995.jpg",
    "/history/novik-n1202c-1996.jpg",
    "/history/novik-pa-602-1997.jpg",
    "/history/novik-pa-1202-1999.jpg",
    "/history/novik-pa-e12-2000.jpg",
    "/history/novik-pa-602-black-fire-2000.jpg",
  ]) {
    expect(imageSources.some((imageSrc) => imageSrc === src || imageSrc?.includes(encodeURIComponent(src)))).toBe(true);
  }

  expect(screen.getByAltText("NOVIK PA 602").getAttribute("src")).toBe("/history/novik-pa-602-1997.jpg");
  expect(screen.getByAltText("NOVIK PA 1202").getAttribute("src")).toBe("/history/novik-pa-1202-1999.jpg");
});

test("ships PA 602 and PA 1202 as browser-decodable JPEG files", () => {
  for (const fileName of ["novik-pa-602-1997.jpg", "novik-pa-1202-1999.jpg"]) {
    const header = readFileSync(resolve(process.cwd(), "public", "history", fileName)).subarray(0, 3);

    expect([...header]).toEqual([0xff, 0xd8, 0xff]);
  }
});
