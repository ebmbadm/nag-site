import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { getDownloadGroups } from "@/lib/content/downloads";

describe("downloads", () => {
  const groups = getDownloadGroups();

  test("products expose downloads", () => {
    expect(groups.length).toBeGreaterThan(0);
  });

  // The one thing that breaks silently: a docs href pointing at a file that was
  // never copied into /public → 404 on the download button.
  test("every local href resolves to a file in /public, with size + type", () => {
    for (const group of groups) {
      for (const link of group.links) {
        if (!link.href.startsWith("/")) continue;
        const file = path.join(process.cwd(), "public", link.href);
        expect(fs.existsSync(file), `${group.slug}: ${link.href}`).toBe(true);
        expect(link.ext, `${group.slug}: ${link.href}`).toBeTruthy();
        expect(link.size, `${group.slug}: ${link.href}`).toBeTruthy();
      }
    }
  });
});
