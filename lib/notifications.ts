export interface NotifyPayload {
  kind: "contact" | "product" | "boutique";
  product_slug?: string;
  name: string;
  contact: string;
  message?: string;
}

function kindLabel(kind: string): string {
  if (kind === "contact") return "Контакт";
  if (kind === "product") return "Товар";
  if (kind === "boutique") return "Бутик";
  return kind;
}

export function formatText(data: NotifyPayload): string {
  return [
    `Тип: ${kindLabel(data.kind)}`,
    data.product_slug ? `Товар: ${data.product_slug}` : null,
    `Имя: ${data.name}`,
    `Контакт: ${data.contact}`,
    data.message ? `Сообщение: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatTelegram(data: NotifyPayload): string {
  return [
    `<b>Новая заявка: ${kindLabel(data.kind)}</b>`,
    data.product_slug ? `Товар: <code>${data.product_slug}</code>` : null,
    `Имя: ${data.name}`,
    `Контакт: ${data.contact}`,
    data.message ? `Сообщение: ${data.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyEmail(data: NotifyPayload): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return;
  const subject = `Новая заявка: ${kindLabel(data.kind)}${data.product_slug ? ` — ${data.product_slug}` : ""}`;
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "NAG·NOVIK сайт <noreply@novikamps.com>",
      to: "novikamps@mail.ru",
      subject,
      text: formatText(data),
    }),
  });
}

export async function notifyTelegram(data: NotifyPayload): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: formatTelegram(data),
      parse_mode: "HTML",
    }),
  });
}
