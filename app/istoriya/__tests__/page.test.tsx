import { render, screen } from "@testing-library/react";
import HistoryPage from "../page";

test("renders the restored 1993–1998 history photographs", () => {
  render(<HistoryPage />);

  expect(screen.getByRole("heading", { name: /история компании novik/i })).toBeInTheDocument();

  const imageSources = Array.from(document.querySelectorAll("img")).map((image) => image.getAttribute("src"));

  for (const src of [
    "/history/redbear-mk120-1993-dark-stack.jpg",
    "/history/redbear-mke120-1994-front-stack.jpg",
    "/history/redbear-mkx-cub-combo-1995-front.jpg",
    "/history/novik-n1202-n602-1995-front.jpg",
    "/history/novik-n1202c-n602c-1996-rear.jpg",
    "/history/novik-mk50-combo-1997-1998-front.jpg",
  ]) {
    expect(imageSources.some((imageSrc) => imageSrc?.includes(encodeURIComponent(src)))).toBe(true);
  }
});
