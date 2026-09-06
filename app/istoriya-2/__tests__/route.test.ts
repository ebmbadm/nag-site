import { describe, expect, it } from "vitest";
import { GET } from "../route";

describe("GET /istoriya-2", () => {
  it("serves the approved NOVIK 2.0 longread contract", async () => {
    const response = GET();
    const html = await response.text();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toContain("text/html");
    expect(html).toContain("<h1>История NOVIK 2.0</h1>");
    expect(html).toContain("<h2>Как менялось дело. 2000–2019</h2>");
    expect(html).toContain("Продолжение ещё пишется.");
    expect(html.match(/<h3>/g)).toHaveLength(12);
    expect(html.match(/<img /g)).toHaveLength(15);
    expect(html.match(/<figure/g)).toHaveLength(14);
    expect(html).toContain("<details><summary>Редакторская сверка и источники</summary>");
    expect(html).toContain("max-width:960px");
    expect(html).toContain("background:#eeece6");
    expect(html).toContain("font:20px/1.75 Georgia,serif");
  });
});
