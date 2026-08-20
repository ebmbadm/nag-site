import type { CompanyHubContent } from "@/lib/content/types";

export const oKompanii: CompanyHubContent = {
  eyebrow: "О компании",
  title: "Компания NOVIK · бренд NAG",
  lede: "Профессиональное звуковое оборудование NAG · NOVIK. Компания NOVIK создана в 1992 году; NAG — бренд компании NOVIK.",
  cards: [
    { kicker: "1976–2000 · опубликованная часть", title: "История", text: "1976–1992 — личная история; 1992–2000 — история компании. Продолжение с 2000 года: модели и даты будут добавлены до публикации второй части истории.", href: "/istoriya" },
    { kicker: "2 года", title: "Гарантия и сервис", text: "Гарантийные условия и обслуживание ламповой и транзисторной техники.", href: "/garantiya" },
    { kicker: "1992–2026 · компания NOVIK", title: "Контакты", text: "Телефон, почта и адрес офиса в Санкт-Петербурге.", href: "/kontakty" },
  ],
  historyPeriods: [
    { range: "1976–1992", label: "личная история" },
    { range: "1992–2026", label: "компания NOVIK" },
  ],
  historyContinuation: { range: "2000–2026", title: "Продолжение", text: "Модели и даты будут добавлены здесь до публикации второй части истории." },
};
