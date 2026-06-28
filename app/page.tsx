import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, Eyebrow, Rule, buttonVariants } from "@/components/ds";

const CARDS = [
  {
    href: "/catalog/d-8000",
    eyebrow: "Процессоры · DSP",
    title: "NAG D-8000 WI-FI",
    text: "Корректор-контроллер 4 × 8, 192 кГц / 32 бит, ЦАП Burr-Brown, управление по Wi-Fi.",
  },
  {
    href: "/istoriya",
    eyebrow: "Компания · с 1976",
    title: "История NOVIK",
    text: "Мемуары основателя: от первых ламповых усилителей до бренда NOVIK и линейки PA.",
  },
];

export default function HomePage() {
  return (
    <div>
      <Container className="py-[clamp(48px,9vw,110px)]">
        <Eyebrow accent className="mb-5 block">
          Профессиональное звуковое оборудование · с 1992
        </Eyebrow>
        <h1
          className="max-w-[16ch] font-display font-bold uppercase text-text"
          style={{ fontSize: "clamp(46px,9vw,98px)", lineHeight: 0.92, letterSpacing: "var(--ls-tight)" }}
        >
          NAG <span className="text-accent">·</span> NOVIK
        </h1>
        <p className="mt-6 max-w-prose text-md text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
          Производство, продажа и сервис усилителей мощности, DSP-процессоров и ламповых
          усилителей. 100% тестирование, сертификация EAC, гарантия и постгарантийное обслуживание.
        </p>
        <Rule className="mt-8" />
      </Container>

      <Container className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border md:grid-cols-2">
        {CARDS.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="group flex flex-col bg-bg p-8 transition-colors hover:bg-surface-2"
          >
            <Eyebrow className="mb-3 block">{card.eyebrow}</Eyebrow>
            <h2
              className="font-display uppercase text-text"
              style={{ fontSize: "var(--text-2xl)", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {card.title}
            </h2>
            <p className="mt-3 flex-1 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {card.text}
            </p>
            <span className="mt-6 inline-flex items-center gap-2 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-accent">
              Открыть
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </span>
          </Link>
        ))}
      </Container>

      <Container className="py-14">
        <Link href="/istoriya" className={buttonVariants({ variant: "outline" })}>
          О компании
        </Link>
      </Container>
    </div>
  );
}
