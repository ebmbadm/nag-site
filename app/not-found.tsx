import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Surface, Rule, buttonVariants } from "@/components/ds";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

/**
 * 404. Not a dead end — a routing desk.
 *
 * Demand on this site is brand plus part number, and /catalog/[slug] runs with
 * dynamicParams = false, so every guessed or discontinued model URL lands here.
 * The archive link is the important one: someone typing /catalog/rf-250 is an
 * owner of gear we stopped making, i.e. a buyer for its replacement. Downloads
 * come second because they are the site's most frequent conversion by a wide
 * margin — documentation is what most visitors actually came for.
 */

const ROUTES = [
  {
    label: "01 · Каталог",
    title: "Найти по каталогу",
    text: "Усилители мощности, DSP-процессоры, встраиваемые модули и ламповые NOVIK.",
    href: "/catalog",
  },
  {
    label: "02 · Документация",
    title: "Паспорта и ПО",
    text: "Руководства, технические паспорта и программы для оборудования NAG.",
    href: "/zagruzki",
  },
  {
    label: "03 · Архив",
    title: "Снятые с производства",
    text: "Если вы искали модель по номеру — возможно, она уже не выпускается. Здесь её актуальная замена.",
    href: "/catalog/arhiv",
  },
  {
    label: "04 · Связь",
    title: "Спросить напрямую",
    text: "Телефон и почта. Подскажем модель под задачу или пришлём документ.",
    href: "/kontakty",
  },
];

export default function NotFound() {
  return (
    <div>
      <Surface mode="dark" className="py-20 md:py-28">
        <Container>
          <div className="max-w-prose">
            <Eyebrow accent>Ошибка 404</Eyebrow>

            {/* The numeral is the graphic. Mono, oversized, tracked out like a
                fault readout on a front panel — no illustration to maintain. */}
            <div
              aria-hidden
              className="mt-6 font-mono text-accent tabular-nums select-none"
              style={{
                fontSize: "clamp(var(--text-5xl), 18vw, var(--text-7xl))",
                lineHeight: "0.9",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              404
            </div>

            <h1
              className="mt-8 font-display uppercase text-text"
              style={{
                fontSize: "clamp(var(--text-2xl), 4vw, var(--text-4xl))",
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Такой страницы нет
            </h1>

            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              Адрес изменился, модель снята с производства или в ссылке опечатка.
              Ниже — четыре места, где почти наверняка есть то, за чем вы шли.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className={buttonVariants({ variant: "primary", size: "lg" })}>
                В каталог
              </Link>
              <Link href="/" className={buttonVariants({ variant: "outline", size: "lg" })}>
                На главную
              </Link>
            </div>
          </div>
        </Container>
      </Surface>

      <Container className="py-14 md:py-20">
        <Eyebrow>Куда идти дальше</Eyebrow>
        <Rule className="mt-3" />

        <div className="mt-8 grid gap-px bg-border sm:grid-cols-2">
          {ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className="group flex flex-col gap-2 bg-bg p-6 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--focus-ring)]"
            >
              <Eyebrow>{route.label}</Eyebrow>
              <span
                className="font-display uppercase text-text transition-colors group-hover:text-accent"
                style={{
                  fontSize: "var(--text-lg)",
                  lineHeight: "var(--lh-tight)",
                  letterSpacing: "var(--ls-tight)",
                }}
              >
                {route.title}
              </span>
              <span className="text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
                {route.text}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}
