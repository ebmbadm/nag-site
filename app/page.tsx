import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Activity, ShieldHalf, Wrench } from "lucide-react";
import {
  Container,
  Eyebrow,
  Surface,
  SectionHeader,
  Rule,
  Badge,
  buttonVariants,
} from "@/components/ds";
import { SpecTicker } from "@/components/layout/spec-ticker";
import { HeroAmp } from "@/components/landing/hero-amp";
import type { Metadata } from "next";

const HERO_STATS = [
  { value: "40+", label: "лет на рынке" },
  { value: "100 %", label: "тестирование" },
  { value: "2 года", label: "гарантия · EAC" },
];

const CATEGORIES = [
  {
    eyebrow: "Процессоры · DSP",
    title: "Процессоры",
    text: "DSP-процессоры NAG: D-8000 Wi-Fi, F-8, F-8 PRO.",
    href: "/catalog/processors",
    price: "от 95 000 ₽",
  },
  {
    eyebrow: "Усилители мощности",
    title: "Усилители",
    text: "Транзисторные QM-400, серии TD и CX — 4 × 700 Вт с DSP.",
    href: "/catalog/amplifiers",
    price: "от 85 000 ₽",
  },
  {
    eyebrow: "Ламповые · NOVIK",
    title: "Лампа",
    text: "Ламповые усилители — наследие NOVIK с 1976 года.",
    href: "/catalog/tubes",
    price: "от 120 000 ₽",
  },
  {
    eyebrow: "Модули встраиваемые",
    title: "Модули",
    text: "Встраиваемые модули для активной акустики: TDS / TDH, TDX.",
    href: "/catalog/modules",
    price: "от 18 000 ₽",
  },
];

const ADVANTAGES = [
  {
    Icon: ShieldCheck,
    title: "EAC сертификация",
    text: "Техника сертифицирована по требованиям ЕАЭС.",
  },
  {
    Icon: Activity,
    title: "100 % тестирование",
    text: "Каждый аппарат проходит полный тест под нагрузкой перед отгрузкой.",
  },
  {
    Icon: ShieldHalf,
    title: "Гарантия 2 года",
    text: "Два года гарантии на всю технику NAG · NOVIK.",
  },
  {
    Icon: Wrench,
    title: "Сервис в Петербурге",
    text: "Собственный отдел ремонта: гарантийное и постгарантийное обслуживание.",
  },
];

const QM400_FEATURE_STATS = [
  { value: "4×2250", label: "Вт · 2 Ω", accent: true },
  { value: "0.1 %", label: "КНИ · 8 Ω", accent: false },
  { value: "950", label: "Демпинг", accent: false },
];

export const metadata: Metadata = {
  description:
    "NAG · NOVIK — производитель профессионального звукового оборудования из Санкт-Петербурга: DSP-процессоры, усилители мощности Class-TD, ламповые усилители. Производство и сервис с 1992 года.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "NAG · NOVIK — профессиональное звуковое оборудование",
    description:
      "Производитель профессионального звукового оборудования из Санкт-Петербурга: DSP-процессоры, усилители Class-TD, ламповые усилители. С 1992 года.",
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
              <Rule className="w-[38px]" />
              <Eyebrow>NOVIK Amplifiers Group · Pro Audio · с 1992</Eyebrow>
            </div>
            <h1
              className="font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(46px,6.6vw,92px)",
                lineHeight: 0.93,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              МОЩНОСТЬ,
              <br />
              ПРОВЕРЕННАЯ
              <br />
              <span className="text-accent">ГОДАМИ.</span>
            </h1>
            <p
              className="mt-6 max-w-[46ch] text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)" }}
            >
              Производим, продаём и обслуживаем усилители мощности, DSP-процессоры и ламповые
              усилители. Каждый аппарат проходит 100% тестирование, сертифицирован EAC и обеспечен
              гарантией два года.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/catalog/amplifiers" className={buttonVariants({ variant: "primary", size: "lg" })}>
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
            <div className="mt-[38px] flex gap-[clamp(20px,3vw,46px)] border-t border-border pt-6">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <div
                    className="font-display font-bold uppercase tabular-nums text-text"
                    style={{ fontSize: "var(--text-4xl)", lineHeight: 1 }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
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
      <Container className="py-[clamp(52px,6vw,92px)]">
        <div className="mb-[34px] flex flex-wrap items-end justify-between gap-5">
          <SectionHeader eyebrow="Каталог" title="Четыре направления техники" />
          <Link
            href="/catalog/amplifiers"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent"
          >
            Весь каталог
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex min-h-[226px] flex-col bg-bg p-[26px] transition-colors hover:bg-surface-2"
            >
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
                <ArrowRight className="size-[18px] text-accent" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* ── TRUST BAND ── */}
      <Surface mode="dark" className="relative overflow-hidden border-y border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(70% 120% at 84% 0%, rgba(225,21,7,.10), transparent 60%)",
          }}
        />
        <Container className="relative py-[clamp(48px,5vw,80px)]">
          <SectionHeader
            eyebrow="Почему NOVIK"
            title="Гарантия не на словах, а на стенде"
            className="mb-10 max-w-[18ch]"
          />
          <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
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

      {/* ── FEATURED QM-400 ── */}
      <Container className="py-[clamp(52px,6vw,96px)]">
        <div className="grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-2">
          <div
            className="rounded-[var(--radius-lg)] p-[30px] shadow-[var(--shadow-3)]"
            style={{ background: "var(--nag-ivory-50)" }}
          >
            <Image
              src="/products/qm-400/nag-qm400-front-panel.jpg"
              alt="NAG QM-400 — передняя панель"
              width={600}
              height={360}
              className="h-auto w-full rounded-[var(--radius-sm)] object-cover"
            />
            <div className="mt-3.5 flex justify-between font-mono text-xs text-[#54545E]">
              <span>QM-400 · передняя панель</span>
              <span>483 × 463 × 88 мм · 17.3 кг</span>
            </div>
          </div>
          <div>
            <div className="mb-[18px] flex gap-2">
              <Badge>Флагман</Badge>
              <Badge className="bg-transparent border border-[var(--nag-green-500)] text-[var(--nag-green-500)]">
                EAC
              </Badge>
            </div>
            <Eyebrow className="mb-2.5 block">Усилитель мощности · Class-TD</Eyebrow>
            <h2
              className="mb-4 font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(36px,4.6vw,64px)",
                lineHeight: 0.96,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              NAG QM-400
            </h2>
            <p
              className="mb-[26px] max-w-[48ch] text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)" }}
            >
              Флагманский четырёхканальный усилитель. Четыре автономных канала — высокая надёжность;
              схемотехнически это четыре модуля TDS/TDH-20 в одном корпусе.
            </p>
            <div className="mb-7 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-md)] border border-border bg-border">
              {QM400_FEATURE_STATS.map((s) => (
                <div key={s.label} className="bg-bg p-4">
                  <div
                    className="font-display font-bold uppercase tabular-nums"
                    style={{
                      fontSize: "var(--text-2xl)",
                      lineHeight: 1,
                      color: s.accent ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-[22px]">
              <div>
                <div
                  className="font-display font-bold uppercase tabular-nums text-text"
                  style={{ fontSize: "var(--text-3xl)", lineHeight: 1 }}
                >
                  от 285 000 ₽
                </div>
                <div className="mt-1.5 font-mono text-xs text-text-faint">
                  Без НДС · Гарантия 2 года · EAC
                </div>
              </div>
              <Link
                href="/catalog/qm-400"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Открыть QM-400
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* ── HISTORY ── */}
      <section className="border-t border-border bg-surface py-[clamp(48px,5vw,84px)]">
        <Container>
          <div className="grid items-center gap-[clamp(28px,4vw,60px)] lg:grid-cols-[.85fr_1.15fr]">
            <div className="overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-3)]">
              <Image
                src="/history/redbear-mk60.jpg"
                alt="RedBear — ламповое наследие NOVIK"
                width={560}
                height={420}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div>
              <Eyebrow className="mb-3.5 block">Компания · с 1976</Eyebrow>
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
                От первых ламповых усилителей Сергея Новикова и серии RedBear для Gibson — до бренда
                NOVIK и профессиональной линейки NAG. Сорок лет схемотехники, собранной в
                Санкт-Петербурге.
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
        <Container className="relative grid items-center gap-[clamp(28px,4vw,56px)] py-[clamp(52px,6vw,92px)] lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h2
              className="mb-[18px] font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(30px,4vw,56px)",
                lineHeight: 0.98,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Подберём усилитель
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
