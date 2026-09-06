import { describe, expect, test } from "vitest";
import sitemap from "../sitemap";

describe("sitemap", () => {
  test("keeps the Modules page but excludes archived CX and TDX", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://novikamps.com/catalog/modules");
    expect(urls).not.toContain("https://novikamps.com/catalog/cx-series");
    expect(urls).not.toContain("https://novikamps.com/catalog/tdx");
  });

  test("publishes only the unified history route", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://novikamps.com/istoriya");
    expect(urls).not.toContain("https://novikamps.com/istoriya-2");
  });
});
