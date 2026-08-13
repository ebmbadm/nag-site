import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb, Container, Eyebrow } from "@/components/ds";

const AREAS = [
  {
    title: "Ламповые гитарные усилители",
    text: "Гитарные модели NOVIK и RedBear: история, описание и возможность обсудить конкретный усилитель.",
    models: [
      "REDBEAR: MK120/60 · MKE120/60 · MKX50 · CUBCOMBO",
      "NOVIK: N1202/60 · N1202C/60C · MK50/25 · NG-1",
    ],
    status: "Материалы есть",
  },
  {
    title: "Ламповые PA-усилители",
    text: "Для концертных, студийных и бытовых систем. Самостоятельная линейка профессиональных ламповых усилителей NOVIK.",
    models: ["NOVIK PA: 602 · 1202 · 202 · E1202 · E202 · E12 · Black Fire"],
    status: "Материалы есть",
  },
  {
    title: "Лампы",
    text: "Подбор, проверка, состояние, происхождение и ориентировочная стоимость конкретных экземпляров.",
    status: "Формируется",
  },
  {
    title: "Измерительные приборы и стенды",
    text: "L1-3, L3-3, документация, история моделей и авторские стенды проверки мощных ламп.",
    status: "Материалы есть",
  },
  {
    title: "Сейверы и конверторы",
    text: "Два типа аксессуаров в одном направлении: сохранение панелек и расширение совместимости ламп.",
    status: "Материалы есть",
  },
  {
    title: "Статьи о звуке",
    text: "Технические наблюдения и практический опыт: лампы, усилители, измерения и слуховое восприятие.",
    status: "В разработке",
  },
] as const;

export const metadata: Metadata = {
  title: "Ламповый бутик NOVIK · предпросмотр",
  robots: { index: false, follow: false },
};

export default function BoutiquePreviewPage() {
  return (
    <div className="py-6">
      <Container>
        <Breadcrumb
          items={[{ label: "Главная", href: "/" }, { label: "Каталог" }, { label: "Ламповый бутик · предпросмотр" }]}
        />

        <header className="mt-8 max-w-prose">
          <Eyebrow accent>NOVIK · ламповая техника</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            Ламповый бутик
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            Избранные ламповые усилители, приборы, аксессуары и опыт работы со звуком — в одном самостоятельном разделе NOVIK.
          </p>
        </header>

        <section className="mt-10" aria-label="Направления лампового бутика">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>Шесть направлений</h2>
            <p className="max-w-[44ch] text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              Каждое направление сохраняет собственный характер и не смешивает ламповую технику NOVIK с линейкой NAG.
            </p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {AREAS.map((area, index) => {
              if (area.title.startsWith("Ламповые гитарные")) return (
                <Link
                  key={area.title}
                  href="/catalog/boutique-preview/guitar"
                  data-testid="tube-guitar-card"
                  className="flex min-h-[260px] flex-col bg-bg p-6 transition-colors hover:bg-surface"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">0{index + 1}</span>
                    <span className="rounded-full border border-border px-2 py-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{area.status}</span>
                  </div>
                  <h3 className="mt-10 font-display text-xl uppercase text-text" style={{ lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}>{area.title}</h3>
                  <p className="mt-3 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{area.text}</p>
                  {"models" in area ? (
                    <div className="mt-4 border-t border-border pt-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                      {area.models.map((modelLine) => <p key={modelLine} className="mt-1 first:mt-0">{modelLine}</p>)}
                    </div>
                  ) : null}
                  <span className="mt-auto pt-6 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Открыть модели →</span>
                </Link>
              );
              if (area.title.startsWith("Ламповые PA")) return (
                <Link key={area.title} href="/catalog/boutique-preview/pa" data-testid="tube-pa-card" className="flex min-h-[260px] flex-col bg-bg p-6 transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]">
                  <div className="flex items-start justify-between gap-3"><span className="font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">0{index + 1}</span><span className="rounded-full border border-border px-2 py-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{area.status}</span></div>
                  <h3 className="mt-10 font-display text-xl uppercase text-text" style={{ lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}>{area.title}</h3>
                  <p className="mt-3 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{area.text}</p>
                  <div className="mt-4 border-t border-border pt-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{area.models.map((modelLine) => <p key={modelLine}>{modelLine}</p>)}</div>
                  <span className="mt-auto pt-6 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Открыть модели →</span>
                </Link>
              );
              return (
              <article
                key={area.title}
                data-testid={
                  area.title.startsWith("Ламповые гитарные")
                    ? "tube-guitar-card"
                    : area.title.startsWith("Ламповые PA-усилители")
                      ? "tube-pa-card"
                      : undefined
                }
                className="flex min-h-[260px] flex-col bg-bg p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">0{index + 1}</span>
                  <span className="rounded-full border border-border px-2 py-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{area.status}</span>
                </div>
                <h3 className="mt-10 font-display text-xl uppercase text-text" style={{ lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}>{area.title}</h3>
                <p className="mt-3 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{area.text}</p>
                {"models" in area ? (
                  <div className="mt-4 border-t border-border pt-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                    {area.models.map((modelLine) => <p key={modelLine} className="mt-1 first:mt-0">{modelLine}</p>)}
                  </div>
                ) : null}
                <span className="mt-auto pt-6 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Предпросмотр структуры</span>
              </article>
              );
            })}
          </div>
        </section>
      </Container>
    </div>
  );
}
