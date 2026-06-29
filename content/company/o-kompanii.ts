import type { CompanyHubContent } from "@/lib/content/types";

export const oKompanii: CompanyHubContent = {
  eyebrow: "О компании",
  title: "О компании NAG · NOVIK",
  lede: "Производство, продажа и сервис профессионального звукового оборудования. На рынке с 1992 года.",
  cards: [
    { kicker: "1976 - 2000", title: "История", text: "Путь компании: от первых ламповых усилителей до серийного производства.", href: "/istoriya" },
    { kicker: "1 год / до 4 лет", title: "Гарантия и сервис", text: "Гарантийные условия и обслуживание ламповой и транзисторной техники.", href: "/garantiya" },
    { kicker: "СПб · с 1992", title: "Контакты", text: "Телефон, почта и адрес офиса в Санкт-Петербурге.", href: "/kontakty" },
  ],
  stat: { value: "Более 40 лет", label: "ручной сборки усилителей" },
};
