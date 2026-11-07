import { render } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { MetrikaPageviews } from "../metrika-pageviews";
import { METRIKA_ID } from "../yandex-metrika";

const nav = vi.hoisted(() => ({ pathname: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => nav.pathname }));

test("counts client-side navigation, not the landing page the tag already saw", () => {
  const ym = vi.fn();
  (window as unknown as { ym: typeof ym }).ym = ym;
  const landing = window.location.href;

  const { rerender } = render(<MetrikaPageviews />);
  expect(ym).not.toHaveBeenCalled();

  window.history.pushState({}, "", "/catalog/qm-400");
  nav.pathname = "/catalog/qm-400";
  rerender(<MetrikaPageviews />);

  expect(ym).toHaveBeenCalledTimes(1);
  expect(ym).toHaveBeenCalledWith(METRIKA_ID, "hit", window.location.href, { referer: landing });

  rerender(<MetrikaPageviews />);
  expect(ym).toHaveBeenCalledTimes(1);
});
