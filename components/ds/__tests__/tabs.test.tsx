import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tabs } from "../tabs";

const ITEMS = [
  { value: "x", label: "Вкладка X", content: <p>Панель X</p> },
  { value: "y", label: "Вкладка Y", content: <p>Панель Y</p> },
];

describe("Tabs", () => {
  it("shows panel for defaultValue on mount", () => {
    const { container } = render(<Tabs items={ITEMS} defaultValue="x" />);
    expect(screen.getByText("Панель X")).toBeInTheDocument();
    // hidden panels are excluded from a11y tree; query by id instead
    const panelY = container.querySelector("#tabpanel-y");
    expect(panelY).toHaveAttribute("hidden");
  });

  it("switches panel on pill click", async () => {
    const user = userEvent.setup();
    const { container } = render(<Tabs items={ITEMS} defaultValue="x" />);
    await user.click(screen.getByRole("tab", { name: "Вкладка Y" }));
    const panelX = container.querySelector("#tabpanel-x");
    const panelY = container.querySelector("#tabpanel-y");
    expect(panelX).toHaveAttribute("hidden");
    expect(panelY).not.toHaveAttribute("hidden");
  });

  it("calls onChange when controlled", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Tabs items={ITEMS} value="x" onChange={handleChange} />);
    await user.click(screen.getByRole("tab", { name: "Вкладка Y" }));
    expect(handleChange).toHaveBeenCalledWith("y");
  });

  it("first item is default when no defaultValue", () => {
    const { container } = render(<Tabs items={ITEMS} />);
    const panelX = container.querySelector("#tabpanel-x");
    expect(panelX).not.toHaveAttribute("hidden");
  });
});
