import { render, screen } from "@testing-library/react";
import PaModelDetailPage from "../page";

describe("PaModelDetailPage", () => {
  it("uses the agreed shared second view for 602 and 1202", async () => {
    render(await PaModelDetailPage({ params: Promise.resolve({ model: "602" }) }));
    expect(screen.getByAltText("NOVIK 602 — второй вид")).toHaveAttribute("src", expect.stringContaining("novik-pa-602-1202-inside.jpg"));
  });

  it("uses the selected internal view as Black Fire's second photo", async () => {
    render(await PaModelDetailPage({ params: Promise.resolve({ model: "black-fire" }) }));
    expect(screen.getByAltText("NOVIK BLACK FIRE — второй вид")).toHaveAttribute("src", expect.stringContaining("novik-black-fire-inside.jpg"));
  });
});
