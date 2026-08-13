import { render, screen } from "@testing-library/react";
import BoutiquePreviewPage from "../page";

describe("BoutiquePreviewPage", () => {
  it("presents the six approved directions without mixing PA with NAG", () => {
    render(<BoutiquePreviewPage />);

    expect(screen.getByRole("heading", { name: "Ламповый бутик" })).toBeInTheDocument();
    expect(screen.getByText("Ламповые гитарные усилители")).toBeInTheDocument();
    expect(screen.getByText("Ламповые PA-усилители")).toBeInTheDocument();
    expect(screen.getByText("Лампы")).toBeInTheDocument();
    expect(screen.getByText("Измерительные приборы и стенды")).toBeInTheDocument();
    expect(screen.getByText("Сейверы и конверторы")).toBeInTheDocument();
    expect(screen.getByText("Статьи о звуке")).toBeInTheDocument();

    const paCard = screen.getByTestId("tube-pa-card");
    expect(paCard).not.toHaveTextContent("NAG");
    expect(paCard).toHaveTextContent("Для концертных, студийных и бытовых систем.");
    expect(paCard).toHaveTextContent("NOVIK PA: 602 · 1202 · 202 · E1202 · E202 · E12 · Black Fire");

    const guitarCard = screen.getByTestId("tube-guitar-card");
    expect(guitarCard).toHaveAttribute("href", "/catalog/boutique-preview/guitar");
    expect(guitarCard).toHaveTextContent("REDBEAR: MK120/60 · MKE120/60 · MKX50 · CUBCOMBO");
    expect(guitarCard).toHaveTextContent("NOVIK: N1202/60 · N1202C/60C · MK50/25 · NG-1");

    expect(screen.getByTestId("tube-pa-card")).toHaveAttribute("href", "/catalog/boutique-preview/pa");
  });
});
