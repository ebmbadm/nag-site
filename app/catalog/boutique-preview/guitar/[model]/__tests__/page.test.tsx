import { render, screen } from "@testing-library/react";
import ModelDetailPage from "../page";

describe("ModelDetailPage", () => {
  it("shows the selected N1202 rear-panel photo with the model description", async () => {
    render(await ModelDetailPage({ params: Promise.resolve({ model: "n1202-n602" }) }));

    expect(screen.getByRole("heading", { name: "NOVIK N1202 / N602" })).toBeInTheDocument();
    expect(screen.getByAltText("NOVIK N1202 / N602 — задняя панель")).toHaveAttribute(
      "src",
      expect.stringContaining("novik-n1202-back.jpg"),
    );
    expect(screen.getByText(/описание готовится без неподтверждённых характеристик/i)).toBeInTheDocument();
  });

  it("uses the selected speaker view for N1202C / N602C", async () => {
    render(await ModelDetailPage({ params: Promise.resolve({ model: "n1202c-n602c" }) }));

    expect(screen.getByAltText("NOVIK N1202C / N602C — задний вид и динамики")).toHaveAttribute(
      "src",
      expect.stringContaining("novik-n602c-speakers-back.jpg"),
    );
  });
});
