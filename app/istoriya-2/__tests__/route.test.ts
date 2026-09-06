import { describe, expect, it } from "vitest";
import { GET } from "../route";

describe("GET /istoriya-2", () => {
  it("uses a host-independent permanent redirect to the unified history", () => {
    const response = GET(new Request("https://novikamps.com/istoriya-2"));

    expect(response.status).toBe(308);
    expect(response.headers.get("location")).toBe("/istoriya");
  });
});
