import { expect, test } from "vitest";
import { cn } from "../utils";

test("cn keeps a site type-scale size next to a text colour", () => {
  expect(cn("text-site-caption text-ink-2")).toBe("text-site-caption text-ink-2");
  expect(cn("text-site-small", "text-site-caption")).toBe("text-site-caption");
});
