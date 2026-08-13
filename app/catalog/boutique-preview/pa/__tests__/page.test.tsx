import { render, screen } from "@testing-library/react";
import PaPreviewPage from "../page";

describe("PaPreviewPage", () => {
  it("shows one front image per PA model and makes each card active", () => {
    render(<PaPreviewPage />);

    expect(screen.getByRole("heading", { name: "Ламповые PA-усилители" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /NOVIK 602/i })).toHaveAttribute("href", "/catalog/boutique-preview/pa/602");
    expect(screen.getByAltText("NOVIK E12")).toBeInTheDocument();
    expect(screen.getByAltText("NOVIK BLACK FIRE")).toBeInTheDocument();
    expect(screen.getByAltText("NOVIK 1202")).toHaveAttribute("src", expect.stringContaining("novik-pa-1202-1999.jpg"));
    expect(screen.getByAltText("NOVIK 202")).toHaveAttribute("src", expect.stringContaining("novik-pa-202-2000.jpg"));
  });
});
