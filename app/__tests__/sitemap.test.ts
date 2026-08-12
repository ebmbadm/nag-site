import { describe, expect, test } from "vitest";
import sitemap from "../sitemap";

describe("sitemap", () => {
  test("lists the Modules category and TDS TDH series but not archived TDX", () => {
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toContain("https://novikamps.com/catalog/modules");
    expect(urls).toContain("https://novikamps.com/catalog/tds-tdh");
    expect(urls).not.toContain("https://novikamps.com/catalog/tdx");
  });
});
