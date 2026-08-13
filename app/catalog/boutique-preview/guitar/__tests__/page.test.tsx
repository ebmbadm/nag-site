import { render, screen } from "@testing-library/react";
import GuitarPreviewPage from "../page";

describe("GuitarPreviewPage", () => {
  it("shows the available guitar-amplifier model photos and labels NG-1 honestly", () => {
    render(<GuitarPreviewPage />);

    expect(screen.getByRole("heading", { name: "Ламповые гитарные усилители" })).toBeInTheDocument();
    expect(screen.getByAltText("RedBear MK120 / MK60")).toBeInTheDocument();
    expect(screen.getByAltText("RedBear MK120 / MK60")).toHaveAttribute(
      "src",
      expect.stringContaining("redbear-mk120-1993-head-crop.jpg"),
    );
    expect(screen.getByAltText("RedBear MKE120 / MKE60")).toBeInTheDocument();
    expect(screen.getByAltText("RedBear MKX50 / CUBCOMBO")).toBeInTheDocument();
    expect(screen.getByAltText("NOVIK N1202 / N602")).toBeInTheDocument();
    expect(screen.getByAltText("NOVIK N1202C / N602C")).toBeInTheDocument();
    expect(screen.getByAltText("NOVIK MK50 / MK25")).toBeInTheDocument();
    expect(screen.getByAltText("NOVIK NG-1")).toBeInTheDocument();
    expect(screen.getByAltText("RedBear MKE120 / MKE60")).toHaveClass("object-contain");
    expect(screen.getByRole("link", { name: /RedBear MKE120/i })).toHaveAttribute(
      "href",
      "/catalog/boutique-preview/guitar/mke120-mke60",
    );
  });
});
