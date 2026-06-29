import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Surface, SectionHeader, Breadcrumb, buttonVariants } from "@/components/ds";
import { Block } from "@/components/history/blocks";
import { getGuarantee } from "@/lib/content/company";

const g = getGuarantee();

export const metadata: Metadata = {
  title: "Гарантия и сервис · NAG · NOVIK",
  description:
    "Гарантия 1 год на каждый продукт, до 4 лет при заводском дефекте. Сервис и обслуживание ламповых и транзисторных усилителей NOVIK · NAG.",
};

export default function GuaranteePage() {
  return (
    <div>
      <Surface mode="dark" className="py-16">
        <Container>
          <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Гарантия и сервис" }]} />
          <div className="mt-6 max-w-prose">
            <Eyebrow accent>{g.hero.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {g.hero.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {g.hero.lede}
            </p>
          </div>
        </Container>
      </Surface>

      <Container className="py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          {g.terms.map((t) => (
            <div key={t.value} className="rounded-[var(--radius-lg)] border border-border bg-surface p-6 shadow-[var(--shadow-1)]">
              <div className="font-display text-4xl uppercase text-accent" style={{ letterSpacing: "var(--ls-tight)" }}>
                {t.value}
              </div>
              <div className="mt-2 text-sm text-text-muted">{t.label}</div>
            </div>
          ))}
        </div>
      </Container>

      <section className="border-t border-border bg-surface-2 py-16">
        <Container>
          <SectionHeader eyebrow={g.service.eyebrow} title={g.service.title} className="mb-8" />
          <div className="max-w-[760px]">
            {g.service.blocks.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
          <div className="mt-10">
            <p className="mb-4 font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
              {g.cta.text}
            </p>
            <Link href={g.cta.href} className={buttonVariants({ variant: "primary", size: "lg" })}>
              {g.cta.label}
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
