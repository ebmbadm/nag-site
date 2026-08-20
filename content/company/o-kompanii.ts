import type { CompanyHubContent } from "@/lib/content/types";

export const oKompanii: CompanyHubContent = {
  eyebrow: "О компании",
  title: "О компании NAG · NOVIK",
  lede: "Профессиональное звуковое оборудование NAG · NOVIK. Компания NAG создана в 1992 году.",
  cards: [
    { kicker: "1976–2000 · опубликованная часть", title: "История", text: "1976–1992 — личная история; 1992–2000 — история компании. Продолжение с 2000 года: модели и даты будут добавлены до публикации второй части истории.", href: "/istoriya" },
    { kicker: "2 года", title: "Гарантия и сервис", text: "Гарантийные условия и обслуживание ламповой и транзисторной техники.", href: "/garantiya" },
    { kicker: "1992–2026 · компания NAG", title: "Контакты", text: "Телефон, почта и адрес офиса в Санкт-Петербурге.", href: "/kontakty" },
  ],
  historyPeriods: [
    { range: "1976–1992", label: "личная история" },
    { range: "1992–2026", label: "компания NAG" },
  ],
  historyContinuation: { range: "2000–2026", title: "Продолжение", text: "Модели и даты будут добавлены здесь до публикации второй части истории." },
};
