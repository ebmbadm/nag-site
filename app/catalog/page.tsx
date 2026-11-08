import type { Metadata } from "next";
import { Container, Breadcrumb, PageHeader } from "@/components/ds";
import { HubCard } from "@/components/company/hub-card";
import type { CompanyHubCard } from "@/lib/content/types";

const LEDE =
  "Профессиональное звуковое оборудование NAG и NOVIK: DSP-процессоры, усилители мощности, встраиваемые модули, ламповая техника и аксессуары для винтажных радиоламп.";

/** Six live category landings + the archive. Keep in sync with app/catalog/*. */
const CATEGORIES: CompanyHubCard[] = [
  {
    kicker: "Процессоры · DSP",
    title: "Процессоры",
    text: "Цифровые корректоры-контроллеры NAG: флагман D-8000 Wi-Fi, серия F с FIR и AES/EBU, линейка DSP BY NAG.",
    href: "/catalog/processors",
  },
  {
    kicker: "Транзисторные · Class-TD",
    title: "Усилители мощности",
    text: "Флагман QM-400 (4 × 2400 Вт) и серия TD.",
    href: "/catalog/amplifiers",
  },
  {
    kicker: "TDS / TDH · Class-TD",
    title: "Модули",
    text: "Встраиваемые модули для активной акустики: TDS-10, TDH-10, TDS-20 и TDH-20.",
    href: "/catalog/modules",
  },
  {
    kicker: "Ламповые · NOVIK",
    title: "Ламповые усилители",
    text: "Ламповые усилители мощности NOVIK: E12, RedBear, Black Fire, N1202.",
    href: "/catalog/tubes",
  },
  {
    kicker: "NOVIK Tubes Boutique",
    title: "Ламповый бутик",
    text: "Подбор ламп и аксессуары для ламповой техники. Ручная сборка из старых (NOS) советских деталей.",
    href: "/catalog/boutique",
  },
  {
    kicker: "NOVIK Tubes Boutique",
    title: "Сейверы и конверторы",
    text: "Аксессуары для винтажных ламп: сохраняют оригинальные разъёмы и расширяют выбор совместимых ламп.",
    href: "/catalog/boutique",
  },
  {
    kicker: "Снято с производства",
    title: "Архив моделей",
    text: "Архивные модели NAG и NOVIK и актуальная замена для каждой снятой с производства позиции.",
    href: "/catalog/arhiv",
  },
];

export const metadata: Metadata = {
  title: "Каталог оборудования",
  description: LEDE,
  alternates: { canonical: "/catalog" },
  openGraph: {
    title: "Каталог оборудования — NAG · NOVIK",
    description: LEDE,
    images: ["/products/qm-400/nag-qm400-front-panel.jpg"],
  },
};

export default function CatalogIndexPage() {
  return (
    <Container className="pt-6 pb-24">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Каталог" }]} />
      <PageHeader className="mt-12" title="Каталог" lead={LEDE} />
      <nav aria-label="Разделы каталога" className="mt-16 max-w-3xl border-t border-line-strong pt-6">
        {CATEGORIES.map((card) => (
          <HubCard key={card.title} card={card} />
        ))}
      </nav>
    </Container>
  );
}
