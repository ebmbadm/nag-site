import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PillGroup } from "../pill-group";

const OPTIONS = [
  { value: "a", label: "Alpha" },
  { value: "b", label: "Beta" },
];

describe("PillGroup", () => {
  it("renders all options", () => {
    render(<PillGroup options={OPTIONS} value="a" onChange={() => {}} />);
    expect(screen.getByText("Alpha")).toBeInTheDocument();
    expect(screen.getByText("Beta")).toBeInTheDocument();
  });

  it("calls onChange with clicked value", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PillGroup options={OPTIONS} value="a" onChange={handleChange} />);
    await user.click(screen.getByText("Beta"));
    expect(handleChange).toHaveBeenCalledWith("b");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  it("does not call onChange when clicking already-selected option", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<PillGroup options={OPTIONS} value="a" onChange={handleChange} />);
    await user.click(screen.getByText("Alpha"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("uses tablist role when tabRole=true", () => {
    render(<PillGroup options={OPTIONS} value="a" onChange={() => {}} tabRole />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
  });

  it("uses group role by default", () => {
    render(<PillGroup options={OPTIONS} value="a" onChange={() => {}} />);
    expect(screen.getByRole("group")).toBeInTheDocument();
  });
});
