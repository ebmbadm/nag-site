import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MobileNav } from "../mobile-nav";

const NAV = [
  { label: "Каталог", href: "/catalog" },
  { label: "О компании", href: "/istoriya" },
];

describe("MobileNav", () => {
  it("renders hamburger button initially", () => {
    render(<MobileNav nav={NAV} />);
    expect(screen.getByRole("button", { name: /открыть меню/i })).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("opens overlay on hamburger click", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    await user.click(screen.getByRole("button", { name: /открыть меню/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Каталог")).toBeInTheDocument();
  });

  it("closes overlay on close button click", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    await user.click(screen.getByRole("button", { name: /открыть меню/i }));
    await user.click(screen.getByRole("button", { name: /закрыть меню/i }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes overlay on Escape key", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    await user.click(screen.getByRole("button", { name: /открыть меню/i }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("hamburger has aria-expanded=true when open", async () => {
    const user = userEvent.setup();
    render(<MobileNav nav={NAV} />);
    const btn = screen.getByRole("button", { name: /открыть меню/i });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
  });
});
