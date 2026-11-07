import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { formatText, formatTelegram, notifyTelegram } from "@/lib/notifications";

const base = { kind: "contact" as const, name: "Иван", contact: "+79001234567" };

describe("formatText", () => {
  test("includes kind label, name, contact", () => {
    const text = formatText(base);
    expect(text).toContain("Контакт");
    expect(text).toContain("Иван");
    expect(text).toContain("+79001234567");
  });

  test("includes product slug when present", () => {
    const text = formatText({ ...base, kind: "product", product_slug: "d-8000" });
    expect(text).toContain("d-8000");
  });

  test("includes message when present", () => {
    const text = formatText({ ...base, message: "Нужна доставка" });
    expect(text).toContain("Нужна доставка");
  });

  test("omits message line when absent", () => {
    const text = formatText(base);
    expect(text).not.toContain("Сообщение");
  });
});

describe("notifyTelegram delivery", () => {
  const log = vi.spyOn(console, "error");
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "secret-token");
    vi.stubEnv("TELEGRAM_CHAT_ID", "1");
    vi.stubGlobal("fetch", fetchMock);
    log.mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    fetchMock.mockReset();
    log.mockReset();
  });

  test("retries once after a dropped connection", async () => {
    fetchMock.mockRejectedValueOnce(new TypeError("fetch failed"));
    fetchMock.mockResolvedValueOnce({ ok: true, status: 200 });

    await notifyTelegram(base);

    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  test("does not retry a rejected token, and logs it without the token", async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 401 });

    await notifyTelegram(base);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(log).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(log.mock.calls)).not.toContain("secret-token");
  });

  test("never throws when both attempts fail, so the lead still reports success", async () => {
    fetchMock.mockRejectedValue(new TypeError("fetch failed"));

    await expect(notifyTelegram(base)).resolves.toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});

describe("formatTelegram", () => {
  test("wraps kind in bold HTML tag", () => {
    const html = formatTelegram(base);
    expect(html).toContain("<b>");
    expect(html).toContain("Контакт");
  });

  test("wraps product slug in code tag", () => {
    const html = formatTelegram({ ...base, kind: "product", product_slug: "f-8-pro" });
    expect(html).toContain("<code>f-8-pro</code>");
  });
});
