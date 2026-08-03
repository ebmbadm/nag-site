import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb } from "@/components/ds";
import { HubCard } from "@/components/company/hub-card";
import type { CompanyHubCard } from "@/lib/content/types";

const LEDE =
  "Профессиональное звуковое оборудование NAG и NOVIK: DSP-процессоры, транзисторные и ламповые усилители мощности, ламповый бутик — сейверы и конвертеры для винтажных радиоламп.";

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
    text: "Флагман QM-400 (4 × 2250 Вт), серии TD и CX, встраиваемые модули TDS / TDH и TDX.",
    href: "/catalog/amplifiers",
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
    title: "Конвертеры",
    text: "Позволяют использовать разные лампы в одном усилителе — часть переходников не найти больше нигде.",
    href: "/catalog/converters",
  },
  {
    kicker: "NOVIK Tubes Boutique",
    title: "Сейверы",
    text: "Сохраняют оригинальные разъёмы усилителя и избавляют от дорогой замены панелек.",
    href: "/catalog/savers",
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
    <div className="py-6">
      <Container>
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Каталог" }]} />

        <header className="mt-8 max-w-prose">
          <Eyebrow accent>NAG · NOVIK</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            Каталог
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            {LEDE}
          </p>
        </header>

        {/*
          7 cards: the archive spans the trailing row so no cell is orphaned.
          The wrapper is `grid` so each card stretches to its row height.
        */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {CATEGORIES.map((card) => (
            <div
              key={card.href}
              className={
                card.href === "/catalog/arhiv"
                  ? "grid sm:col-span-2 lg:col-span-3"
                  : "grid"
              }
            >
              <HubCard card={card} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
