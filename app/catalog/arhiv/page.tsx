import type { Metadata } from "next";
import Link from "next/link";
import {
  Container,
  Eyebrow,
  Surface,
  SectionHeader,
  Breadcrumb,
  Chip,
  buttonVariants,
} from "@/components/ds";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";

/**
 * Archive page — snято с производства. These models still get search demand
 * (Yandex/Google queries by old part numbers) but no longer have product pages.
 * One landing page captures those queries and routes visitors to current
 * replacements instead of 404-ing or fabricating specs for discontinued gear.
 */

type Replacement = { label: string; href: string };
type ArchiveGroup = {
  eyebrow: string;
  title: string;
  note: string;
  models: string[];
  replacements: Replacement[];
};

const GROUPS: ArchiveGroup[] = [
  {
    eyebrow: "Усилители мощности",
    title: "Архивные усилители мощности NAG",
    note: "Сняты с производства. Актуальная замена — флагман QM-400 и серии Class-TD.",
    models: [
      "NAG QM-60",
      "NAG QM-40",
      "NAG QM-25",
      "NAG QM-1",
      "NAG Q40",
      "NAG RF-400",
      "NAG RF-250",
      "NAG RD-1600",
      "NAG PS600",
    ],
    replacements: [
      { label: "NAG QM-400", href: "/catalog/qm-400" },
      { label: "NAG TD SERIES", href: "/catalog/td-series" },
      { label: "Все усилители", href: "/catalog/amplifiers" },
    ],
  },
  {
    eyebrow: "Серия TD",
    title: "Архивные TD-усилители",
    note: "TD-40 / TD-80 / TD-100 заменены актуальной серией TD и встраиваемым TDX.",
    models: ["NAG TD-40", "NAG TD-80", "NAG TD-100"],
    replacements: [
      { label: "NAG TD SERIES", href: "/catalog/td-series" },
      { label: "NAG TDX", href: "/catalog/tdx" },
    ],
  },
  {
    eyebrow: "Встраиваемые модули",
    title: "Архивные модули для активной акустики",
    note: "Модули MQ заменены модулями Class-TD серий TDS / TDH.",
    models: ["NAG MQ-10", "NAG MQ-20", "NAG MQ-30"],
    replacements: [{ label: "Модули TDS / TDH", href: "/catalog/modules" }],
  },
  {
    eyebrow: "Ламповые NOVIK",
    title: "Архивные ламповые усилители NOVIK",
    note: "NOVIK 602, MKE120 и акустика 1512 сняты с производства.",
    models: ["NOVIK 602", "NOVIK MKE120", "NOVIK 1512 (АС)"],
    replacements: [
      { label: "NOVIK N1202", href: "/catalog/n1202" },
      { label: "NOVIK E12", href: "/catalog/e12" },
      { label: "NOVIK BLACK FIRE", href: "/catalog/black-fire" },
    ],
  },
];

const CRUMBS = [
  { label: "Главная", href: "/" },
  { label: "Каталог" },
  { label: "Архивные модели" },
];

const LEDE =
  "Снятые с производства усилители мощности и модули NAG и ламповые усилители NOVIK. Этих моделей больше нет в продаже — ниже актуальные замены. По ремонту и обслуживанию архивной техники свяжитесь с нами.";

export const metadata: Metadata = {
  title: "Архивные модели — сняты с производства",
  description:
    "Снятые с производства NAG / NOVIK: QM-60/40/25, Q40, RF-400/250, RD-1600, TD-40/80/100, MQ-10/20/30, ламповые NOVIK 602 / MKE120. Актуальные замены и сервис.",
  alternates: { canonical: "/catalog/arhiv" },
  openGraph: {
    title: "Архивные модели NAG · NOVIK — сняты с производства",
    description:
      "Старые модели NAG / NOVIK и их актуальные замены: усилители мощности, встраиваемые модули, ламповые усилители.",
  },
};

export default function ArchivePage() {
  return (
    <div>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <Surface mode="dark" className="py-16">
        <Container>
          <Breadcrumb items={CRUMBS} />
          <div className="mt-6 max-w-prose">
            <Eyebrow accent>Каталог · Архив</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{
                fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Архивные модели
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {LEDE}
            </p>
          </div>
        </Container>
      </Surface>

      <Container className="py-12">
        <div className="space-y-12">
          {GROUPS.map((group) => (
            <section key={group.title}>
              <SectionHeader eyebrow={group.eyebrow} title={group.title} lede={group.note} className="mb-6" />

              <div className="flex flex-wrap gap-2">
                {group.models.map((model) => (
                  <Chip key={model}>{model}</Chip>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                  Актуальная замена
                </span>
                {group.replacements.map((r) => (
                  <Link key={r.href} href={r.href} className={buttonVariants({ variant: "outline", size: "sm" })}>
                    {r.label}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </Container>

      <section className="border-t border-border bg-surface-2 py-16">
        <Container>
          <div className="max-w-prose">
            <Eyebrow accent>Сервис и подбор</Eyebrow>
            <p
              className="mt-3 font-display text-xl uppercase text-text"
              style={{ letterSpacing: "var(--ls-tight)" }}
            >
              Нужна замена или ремонт архивной модели?
            </p>
            <p className="mt-3 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              Подберём актуальный аналог под вашу задачу и обслужим снятую с производства технику NAG · NOVIK.
            </p>
            <Link href="/kontakty" className={`mt-6 ${buttonVariants({ variant: "primary", size: "lg" })}`}>
              Связаться с нами
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
