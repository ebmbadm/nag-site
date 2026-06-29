import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Zap, Wrench, Award } from "lucide-react";
import {
  Container,
  Eyebrow,
  Surface,
  SectionHeader,
  Rule,
  buttonVariants,
} from "@/components/ds";
import { SpecTicker } from "@/components/layout/spec-ticker";

const QM400_SPECS = [
  { label: "Выходная мощность", value: "4 × 2250 Вт (2 Ω)" },
  { label: "Класс усиления", value: "Class-TD" },
  { label: "КНИ", value: "< 0.1 %" },
  { label: "Демпинг-фактор", value: "> 950" },
  { label: "АЧХ ±0.1 дБ", value: "20 Гц – 20 кГц" },
  { label: "Шум", value: "−99 дБ" },
];

const CATEGORIES = [
  {
    eyebrow: "DSP",
    title: "Процессоры",
    text: "Корректоры-контроллеры NAG D-серии: 4×8, 8×8, Wi-Fi, 192 кГц / 32 бит.",
    href: "/catalog/processors",
    image: "/products/d-8000/nag-d8000-front-panel.jpg",
    price: "от 95 000 ₽",
  },
  {
    eyebrow: "PA",
    title: "Усилители",
    text: "Транзисторные усилители мощности NAG QM-серии и TD-серии для инсталляции и тура.",
    href: "/catalog/amplifiers",
    image: "/products/qm-400/nag-qm400-front-panel.jpg",
    price: "от 85 000 ₽",
  },
  {
    eyebrow: "Boutique",
    title: "Лампа",
    text: "Ламповые усилители NOVIK: головы, комбо и стеки для студии и сцены.",
    href: "/catalog/tubes",
    image: "/history/novik-n1202-head.jpg",
    price: "от 120 000 ₽",
  },
  {
    eyebrow: "OEM",
    title: "Модули",
    text: "Силовые модули TDS/TDH-20 для интеграции в собственные корпуса и системы.",
    href: "/catalog/modules",
    image: "/products/modules/nag-module-tds-rear-panel.png",
    price: "от 18 000 ₽",
  },
];

const ADVANTAGES = [
  {
    Icon: Award,
    title: "Сертифицировано по ЕВРАЗЭС.",
    text: "Вся техника NAG · NOVIK сертифицирована EAC и соответствует требованиям Таможенного союза.",
  },
  {
    Icon: Zap,
    title: "100 % тест под нагрузкой.",
    text: "Каждый аппарат тестируем под нагрузкой перед отгрузкой: измеряем мощность, шум и КНИ.",
  },
  {
    Icon: Shield,
    title: "Два года гарантии.",
    text: "Гарантия распространяется на всю технику NAG · NOVIK; при заводском дефекте срок увеличивается.",
  },
  {
    Icon: Wrench,
    title: "Свой сервис в Петербурге.",
    text: "Ремонтируем в гарантию и после. Инженеры, которые собирали аппарат, его и обслуживают.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <Surface mode="dark">
        <Container className="grid items-center gap-10 py-[clamp(56px,10vw,120px)] lg:grid-cols-[1fr_auto]">
          <div className="max-w-[580px]">
            <Eyebrow accent className="mb-5 block">
              NOVIK Amplifiers Group · Pro Audio · с 1992
            </Eyebrow>

            <h1
              className="font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(52px,9vw,var(--text-7xl))",
                lineHeight: 0.9,
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
              className="mt-6 max-w-prose text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)" }}
            >
              Производим, продаём и обслуживаем усилители мощности, DSP-процессоры и ламповые
              усилители. Каждый аппарат тестируем под нагрузкой, сертифицирован EAC, гарантия - два
              года.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className={buttonVariants({ variant: "primary" })}>
                Каталог
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link href="/kontakty" className={buttonVariants({ variant: "outline" })}>
                Связаться
              </Link>
            </div>

            <Rule className="mt-10" />

            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { value: "40+", label: "лет опыта" },
                { value: "100 %", label: "тестирование" },
                { value: "2 года", label: "гарантия" },
              ].map((s) => (
                <div key={s.label}>
                  <div
                    className="font-display font-bold uppercase text-accent"
                    style={{
                      fontSize: "clamp(22px,3.5vw,var(--text-3xl))",
                      letterSpacing: "var(--ls-tight)",
                      lineHeight: "var(--lh-tight)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-0.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <Image
              src="/products/qm-400/nag-qm400-front-panel.jpg"
              alt="NAG QM-400 — флагманский четырёхканальный усилитель"
              width={400}
              height={240}
              priority
              className="rounded-[var(--radius-lg)] object-cover shadow-[var(--shadow-2)]"
              style={{ maxHeight: 280, width: "auto" }}
            />
          </div>
        </Container>
      </Surface>

      {/* ── SPEC TICKER ── */}
      <SpecTicker />

      {/* ── CATEGORIES ── */}
      <Container className="py-[clamp(48px,8vw,96px)]">
        <SectionHeader eyebrow="Каталог" title="Четыре направления техники" className="mb-10" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group flex flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-1)] transition-shadow hover:shadow-[var(--shadow-2)]"
            >
              <div className="relative h-44 overflow-hidden bg-surface-2">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <Eyebrow className="mb-2 block">{cat.eyebrow}</Eyebrow>
                <h2
                  className="font-display uppercase text-text"
                  style={{
                    fontSize: "var(--text-2xl)",
                    lineHeight: "var(--lh-tight)",
                    letterSpacing: "var(--ls-tight)",
                  }}
                >
                  {cat.title}
                </h2>
                <p
                  className="mt-2 flex-1 text-sm text-text-muted"
                  style={{ lineHeight: "var(--lh-relaxed)" }}
                >
                  {cat.text}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                    {cat.price}
                  </span>
                  <ArrowRight
                    className="size-4 text-accent transition-transform group-hover:translate-x-1"
                    aria-hidden
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* ── ADVANTAGES ── */}
      <Surface mode="dark">
        <Container className="py-[clamp(48px,8vw,96px)]">
          <SectionHeader
            eyebrow="Качество"
            title="Гарантия не на словах, а на стенде"
            className="mb-10"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map(({ Icon, title, text }) => (
              <div key={title} className="flex flex-col gap-3">
                <div className="flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-accent/15">
                  <Icon className="size-5 text-accent" aria-hidden />
                </div>
                <h3
                  className="font-display uppercase text-text"
                  style={{
                    fontSize: "var(--text-sm)",
                    lineHeight: "var(--lh-tight)",
                    letterSpacing: "var(--ls-tight)",
                  }}
                >
                  {title}
                </h3>
                <p className="text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Surface>

      {/* ── QM-400 FEATURE ── */}
      <Container className="py-[clamp(48px,8vw,96px)]">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="overflow-hidden rounded-[var(--radius-lg)] bg-surface-2">
            <Image
              src="/products/qm-400/nag-qm400-front-panel.jpg"
              alt="NAG QM-400 — вид спереди"
              width={600}
              height={360}
              className="h-auto w-full object-cover"
            />
          </div>

          <div>
            <Eyebrow accent className="mb-4 block">
              Флагман · 4 канала · Class-TD
            </Eyebrow>
            <h2
              className="font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              NAG QM-400
            </h2>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              Флагманский четырёхканальный усилитель. Четыре автономных канала, каждый работает
              независимо; схемотехнически это четыре модуля TDS/TDH-20 в одном корпусе.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-3 border-t border-border pt-6">
              {QM400_SPECS.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                    {s.label}
                  </div>
                  <div className="mt-0.5 font-mono text-sm text-text">{s.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/catalog/qm-400" className={buttonVariants({ variant: "primary" })}>
                Подробнее
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <span className="font-mono text-sm text-text-muted">
                от <span className="text-text">285 000 ₽</span>
              </span>
            </div>
          </div>
        </div>
      </Container>

      {/* ── HISTORY TEASER ── */}
      <section className="border-t border-border bg-surface-2 py-[clamp(48px,8vw,96px)]">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div
                className="font-display font-bold uppercase text-accent"
                style={{
                  fontSize: "clamp(72px,14vw,var(--text-7xl))",
                  lineHeight: 0.85,
                  letterSpacing: "var(--ls-tight)",
                }}
                aria-hidden="true"
              >
                1976
              </div>
              <Eyebrow className="mt-4 block">История компании</Eyebrow>
              <p
                className="mt-3 max-w-md text-text-muted"
                style={{ lineHeight: "var(--lh-relaxed)" }}
              >
                От первых ламповых усилителей Сергея Новикова и серии RedBear для Gibson - до бренда
                NOVIK и профессиональной линейки NAG. Сорок лет схемотехники, собранной в
                Санкт-Петербурге.
              </p>
              <Link
                href="/istoriya"
                className={buttonVariants({ variant: "outline", className: "mt-6" })}
              >
                Читать историю
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>

            <div className="overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-2)]">
              <Image
                src="/history/redbear-mk60.jpg"
                alt="RedBear MK-60 — ранние усилители NOVIK"
                width={560}
                height={380}
                className="h-auto w-full object-cover"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* ── CONTACT CTA ── */}
      <Container className="py-[clamp(48px,8vw,96px)]">
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow accent className="mb-4 block">
            Контакты
          </Eyebrow>
          <h2
            className="font-display font-bold uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-2xl), 4.5vw, var(--text-4xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            Подберём усилитель под вашу задачу
          </h2>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            Звоните или пишите: поможем подобрать, рассчитать и скомплектовать под инсталляцию, тур
            или прокат.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a href="tel:+79219372508" className={buttonVariants({ variant: "primary" })}>
              +7 921 937 25 08
            </a>
            <a href="mailto:novikamps@mail.ru" className={buttonVariants({ variant: "outline" })}>
              novikamps@mail.ru
            </a>
          </div>

          <p className="mt-6 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Санкт-Петербург, Московское шоссе, 25А · офис 216А
          </p>
        </div>
      </Container>
    </div>
  );
}
