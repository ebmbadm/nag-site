import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Activity, FileText, ShieldHalf, Wrench } from "lucide-react";
import {
  Container,
  Eyebrow,
  Surface,
  SectionHeader,
  Rule,
  buttonVariants,
} from "@/components/ds";
import { SpecTicker } from "@/components/layout/spec-ticker";
import { HeroAmp } from "@/components/landing/hero-amp";
import type { Metadata } from "next";

const HERO_STATS = [
  { value: "CLASS-TD", label: "качество звука" },
  { value: "НАДЁЖНОСТЬ", label: "длительная эксплуатация" },
  { value: "ПРЯМОЙ ДИАЛОГ", label: "до и после гарантии" },
];

const CATEGORIES = [
  {
    eyebrow: "D-8000 · F-8 · F-8 PRO",
    title: "Процессоры",
    text: "DSP-процессоры NAG: D-8000 Wi-Fi, F-8, F-8 PRO.",
    href: "/catalog/processors",
    price: "от 72 000 ₽",
    image: {
      src: "/products/d-8000/nag-d8000-front-panel.jpg",
      alt: "NAG D-8000 — передняя панель",
    },
  },
  {
    eyebrow: "QM400 · TD100/80 · TD40/30",
    title: "Усилители",
    text: "QM400 и серия усилителей Class-TD.",
    href: "/catalog/amplifiers",
    price: "от 70 000 ₽",
    image: {
      src: "/products/qm-400/nag-qm400-front-panel.jpg",
      alt: "NAG QM-400 — передняя панель",
    },
  },
  {
    eyebrow: "TDS20/10 · TDH20/10",
    title: "Модули",
    text: "Встраиваемые модули для активной акустики Class-TD.",
    href: "/catalog/modules",
    price: "от 41 900 ₽",
    image: {
      src: "/products/modules/nag-module-tds-rear-panel.jpg",
      alt: "NAG TDS — задняя панель модуля",
    },
  },
  {
    eyebrow: "602 · E12 · RedBear",
    title: "Лампа",
    text: "Ламповые усилители — часть истории Сергея Новикова с 1976 года.",
    href: "/catalog/tubes",
    price: "Цена по запросу",
    image: {
      src: "/products/redbear/novik-redbear-front.png",
      alt: "NOVIK RedBear — передняя панель",
    },
  },
];

const ADVANTAGES = [
  {
    Icon: Activity,
    title: "Подготовка к поставке",
    text: "Параметры и состав оборудования проверяются перед поставкой в рамках согласованной конфигурации проекта.",
  },
  {
    Icon: Wrench,
    title: "Настройка тракта",
    text: "Для модулей можно согласовать параметры входного тракта под задачу системы и способ её дальнейшего управления.",
  },
  {
    Icon: ShieldHalf,
    title: "Согласованные работы",
    text: "Техническую документацию и порядок допустимых изменений обсуждаем до начала работ — для конкретной модели и проекта.",
  },
  {
    Icon: FileText,
    title: "Сервисный маршрут",
    text: "Способ диагностики и обслуживания определяется по ситуации: с учётом модели, задачи и доступной логистики.",
  },
];

export const metadata: Metadata = {
  // Absolute: the default layout title leads with the brand, which almost nobody
  // searches. Lead with the category words instead.
  //
  // Metadata here deliberately makes no claim about where the hardware is made.
  // The gear is OEM, so "производство в Санкт-Петербурге" / "от производителя"
  // would be a false origin claim — and this copy is what Yandex shows in the
  // SERP snippet and in the Direct ad link preview. What is safe to state:
  // "на рынке с 1992 года", the guarantee, and the service department in SPb.
  title: { absolute: "Усилители мощности и DSP-процессоры NAG · NOVIK" },
  description:
    "Усилители мощности, DSP-процессоры и встраиваемые модули для активной акустики. NAG · NOVIK.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NAG · NOVIK — профессиональное звуковое оборудование",
    description:
      "Профессиональное звуковое оборудование NAG и NOVIK: DSP-процессоры, усилители мощности Class-TD, ламповые усилители. Компания NOVIK создана в 1992 году; NAG — её бренд.",
  },
};

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <Surface mode="dark" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 78% 18%, rgba(225,21,7,.16), transparent 52%), radial-gradient(90% 70% at 8% 90%, rgba(255,90,12,.07), transparent 60%)",
          }}
        />
        <Container className="relative grid items-center gap-[clamp(24px,3vw,48px)] py-[clamp(48px,6vw,84px)] lg:grid-cols-[1.04fr_.96fr]">
          <div>
            <div className="mb-[22px] flex items-center gap-3">
              <Rule className="power-rule w-[38px]" />
              <Eyebrow className="power-fade" style={{ ["--pd" as string]: "160ms" }}>
                NOVIK Amplifiers Group · Pro Audio · с 1992
              </Eyebrow>
            </div>
            {/* Три строки — три отдельных элемента: последовательность включения
                читается построчно, а последняя строка «зажигается» красным. */}
            <h1
              className="font-display font-bold uppercase text-text text-[clamp(34px,3.5vw,50px)]"
              aria-label="ВСЁ ДЛЯ РЕАЛЬНОЙ РАБОТЫ СО ЗВУКОМ."
              style={{
                lineHeight: 1,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              <span className="power-rise block" style={{ ["--pd" as string]: "120ms" }}>
                ВСЁ
              </span>
              <span className="power-rise block" style={{ ["--pd" as string]: "190ms" }}>
                ДЛЯ РЕАЛЬНОЙ
              </span>
              <span
                className="power-ignite block text-accent"
                style={{ ["--pd" as string]: "260ms" }}
              >
                РАБОТЫ СО ЗВУКОМ.
              </span>
            </h1>
            <p
              className="power-rise mt-6 max-w-[46ch] text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)", ["--pd" as string]: "420ms" }}
            >
              <span>DSP-процессоры, усилители мощности и встраиваемые модули NAG. Ламповая техника NOVIK.</span>{" "}
              Подбор и инженерная адаптация под задачу проекта.
            </p>
            <div
              className="power-rise mt-8 flex flex-wrap gap-3.5"
              style={{ ["--pd" as string]: "520ms" }}
            >
              <Link href="#catalog" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Смотреть каталог
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/o-kompanii"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                О компании
              </Link>
            </div>
            {/* Линейка — отдельный элемент, а не border-top: её можно прочертить
                трансформом, и тест на три ячейки в hero-principles не ломается. */}
            <div
              aria-hidden
              className="power-hairline mt-[38px] h-px w-full bg-border"
              style={{ ["--pd" as string]: "600ms" }}
            />
            <div
              data-testid="hero-principles"
              className="grid grid-cols-1 gap-x-[clamp(12px,3vw,28px)] gap-y-5 pt-6 sm:grid-cols-3 sm:gap-x-3"
            >
              {HERO_STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="power-rise"
                  style={{ ["--pd" as string]: `${660 + i * 60}ms` }}
                >
                  <div
                    className="font-display font-bold uppercase tabular-nums text-text"
                    style={{
                      fontSize: "clamp(16px, 1.6vw, 20px)",
                      lineHeight: 1,
                    }}
                  >
                    {s.value}
                  </div>
                  {/* На 320px «тестирование» (97.7px при полном трекинге) не
                      влезает в 88px ячейку. Ужимаем трекинг до sm; break-words
                      остаётся страховкой, а не основным механизмом. */}
                  <div className="mt-1.5 break-words font-mono text-[10px] uppercase tracking-normal text-text-faint sm:text-2xs sm:tracking-[var(--ls-label)]">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <HeroAmp />
        </Container>
      </Surface>

      {/* ── SPEC TICKER ── */}
      <SpecTicker />

      {/* ── CATEGORIES ── */}
      <Surface
        id="catalog"
        mode="dark"
        className="catalog-v5 border-y border-border"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <Container className="py-[clamp(52px,6vw,92px)]">
          <div className="mb-[34px] flex flex-wrap items-end justify-between gap-5">
            <SectionHeader eyebrow="Каталог" title="Четыре направления техники" />
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent"
            >
              Весь каталог
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="reveal-fade-stagger grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group flex min-h-[226px] flex-col bg-surface-2 p-[26px] transition-colors hover:bg-surface-inset"
              >
              {/* Panels, a square module shot and a tube chassis share this frame —
                  contained on the photo backdrop so every device stays whole. */}
              <div className="-mt-1 mb-4 overflow-hidden rounded-[var(--radius-sm)] bg-photo-backdrop">
                <Image
                  src={cat.image.src}
                  alt={cat.image.alt}
                  width={320}
                  height={160}
                  className="h-[120px] w-full object-contain p-2 mix-blend-multiply transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.05] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <Eyebrow accent className="mb-3.5 block">
                {cat.eyebrow}
              </Eyebrow>
              <h3
                className="mb-2.5 font-display uppercase text-text"
                style={{ fontSize: "var(--text-xl)", lineHeight: 1.04 }}
              >
                {cat.title}
              </h3>
              <p
                className="flex-1 text-sm text-text-muted"
                style={{ lineHeight: "var(--lh-normal)" }}
              >
                {cat.text}
              </p>
              <div className="mt-[18px] flex items-center justify-between">
                <span className="font-mono text-xs text-text-faint">{cat.price}</span>
                <ArrowRight
                  className="size-[18px] text-accent transition-transform duration-[var(--dur-base)] ease-[var(--ease-out)] group-hover:translate-x-1 motion-reduce:transition-none"
                  aria-hidden
                />
              </div>
              </Link>
            ))}
          </div>
        </Container>
      </Surface>

      {/* ── TRUST BAND ── */}
      <Surface
        mode="dark"
        className="relative overflow-hidden border-y border-border"
        style={{ backgroundColor: "var(--surface-2)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(70% 120% at 84% 0%, rgba(225,21,7,.10), transparent 60%)",
          }}
        />
        <Container className="relative py-[clamp(48px,5vw,80px)]">
          <SectionHeader
            eyebrow="Инженерный подход"
            title="Техника для задач, где важна предсказуемость"
            className="mb-10"
          />
          <div className="reveal-stagger grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map(({ Icon, title, text }) => (
              <div key={title}>
                <div className="mb-4 inline-flex size-[46px] items-center justify-center rounded-[var(--radius-md)] bg-accent text-on-accent">
                  <Icon className="size-[22px]" aria-hidden />
                </div>
                <h3
                  className="mb-2 font-display uppercase text-text"
                  style={{ fontSize: "var(--text-md)", lineHeight: "var(--lh-tight)" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-text-muted" style={{ lineHeight: "var(--lh-normal)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Surface>

      {/* ── HISTORY ── */}
      <section className="border-t border-border bg-surface py-[clamp(48px,5vw,84px)]">
        <Container>
          <div className="reveal-stagger grid items-center gap-[clamp(28px,4vw,60px)] lg:grid-cols-[.85fr_1.15fr]">
            <div className="w-full max-w-[380px] overflow-hidden rounded-[var(--radius-lg)] bg-surface-2 shadow-[var(--shadow-3)] lg:max-w-none">
              {/* The archival N602 photograph is kept contained to preserve its original framing. */}
              <Image
                src="/history/novik-n602-guitar-stack.jpg"
                alt="NOVIK N602 с колонкой и гитарой"
                width={400}
                height={574}
                className="aspect-[3/4] h-full w-full object-contain"
              />
            </div>
            <div>
              <Eyebrow className="mb-3.5 block">История · 1976–2000</Eyebrow>
              <h2
                className="mb-[18px] font-display font-bold uppercase text-text"
                style={{
                  fontSize: "clamp(30px,3.6vw,50px)",
                  lineHeight: 1,
                  letterSpacing: "var(--ls-tight)",
                }}
              >
                История NOVIK
              </h2>
              <p
                className="mb-7 max-w-[52ch] text-md text-text-muted"
                style={{ lineHeight: "var(--lh-relaxed)" }}
              >
                Опубликованная часть истории: от первых ламповых усилителей Сергея Новикова до
                2000 года. Продолжение о периоде 2000–2026 готовится к публикации.
              </p>
              <Link href="/istoriya" className={buttonVariants({ variant: "outline" })}>
                Читать историю
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CONTACT CTA ── */}
      <Surface mode="dark" className="relative overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(90% 130% at 18% 0%, rgba(225,21,7,.14), transparent 58%)",
          }}
        />
        <Container className="reveal-stagger relative grid items-center gap-[clamp(28px,4vw,56px)] py-[clamp(52px,6vw,92px)] lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h2
              className="mb-[18px] font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(30px,4vw,56px)",
                lineHeight: 0.98,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Подберём оборудование
              <br />
              под вашу задачу
            </h2>
            <p
              className="mb-7 max-w-[42ch] text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)" }}
            >
              Звоните или пишите — поможем с подбором, расчётом и комплектацией под инсталляцию, тур
              или прокат.
            </p>
            <Link href="/catalog/amplifiers" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Смотреть каталог
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="flex flex-col gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border">
            <a
              href="tel:+79219372508"
              className="flex items-center gap-3.5 bg-surface px-[22px] py-[18px] transition-colors hover:bg-surface-2"
            >
              <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                Телефон
              </span>
              <span className="ml-auto font-mono text-md text-text">+7 921 937 25 08</span>
            </a>
            <a
              href="mailto:novikamps@mail.ru"
              className="flex items-center gap-3.5 bg-surface px-[22px] py-[18px] transition-colors hover:bg-surface-2"
            >
              <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                Почта
              </span>
              <span className="ml-auto font-mono text-md text-text">novikamps@mail.ru</span>
            </a>
            <div className="flex items-center gap-3.5 bg-surface px-[22px] py-[18px]">
              <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                Адрес
              </span>
              <span className="ml-auto text-right text-sm text-text">
                Санкт-Петербург, Московское шоссе, 25 литера А, офис 216А
              </span>
            </div>
          </div>
        </Container>
      </Surface>
    </div>
  );
}
