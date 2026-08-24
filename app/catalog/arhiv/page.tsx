import type { Metadata } from "next";
import Link from "next/link";
import {
  Container,
  Eyebrow,
  Surface,
  SectionHeader,
  Breadcrumb,
  Chip,
  ProductCard,
  buttonVariants,
} from "@/components/ds";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { getProduct } from "@/lib/content/products";

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
  slugs?: string[];
  /** Label above the buttons. Not every group is offering a replacement. */
  ctaLabel?: string;
  replacements: Replacement[];
};

const GROUPS: ArchiveGroup[] = [
  {
    eyebrow: "DSP BY NAG",
    title: "Архивные процессоры NAG",
    note: "Эти модели сняты с актуального каталога и сохранены в архиве с карточками и документацией.",
    models: [],
    slugs: ["the-rogue", "d-4", "d-8"],
    replacements: [{ label: "Актуальные процессоры", href: "/catalog/processors" }],
  },
  {
    eyebrow: "Усилители мощности",
    title: "Архивные усилители мощности NAG",
    note: "Транзисторные серии QM, MA, RA, RD, Q, RF и MQ сняты с производства. На карточках — характеристики с условиями измерения, коммутация и актуальные замены по мощности.",
    models: [],
    slugs: [
      "qm-series",
      "ma-series",
      "ra-series",
      "rd-series",
      "q-series",
      "rf-series",
      "mq-series",
    ],
    replacements: [
      { label: "NAG QM-400", href: "/catalog/qm-400" },
      { label: "NAG TD SERIES", href: "/catalog/td-series" },
      { label: "Все усилители", href: "/catalog/amplifiers" },
    ],
  },
  {
    eyebrow: "Без опубликованных характеристик",
    title: "Другие архивные обозначения NAG",
    note: "Эти модели выпускались раньше и отдельных страниц не имеют. Паспорт или схему на любую из них запросим и пришлём.",
    models: [
      "NAG Q-150",
      "NAG Q-250",
      "NAG Q-400",
      "NAG RF-300",
      "NAG RN-250",
      "NAG RN-400",
      "NAG RA-1800",
      "NAG RD-2000",
      "NAG MX-250",
      "NAG MX-400",
      "NAG PS600",
    ],
    ctaLabel: "Документы по запросу",
    replacements: [{ label: "Запросить паспорт", href: "/kontakty" }],
  },
  {
    eyebrow: "Усилители и модули Class-D",
    title: "Архивные CX и TDX",
    note: "CX и TDX сняты с производства. Руководства и программное обеспечение сохранены в разделе «Загрузки».",
    models: ["AMP By NAG CX-520", "AMP By NAG CX-540", "NAG TDX"],
    replacements: [
      { label: "NAG TD SERIES", href: "/catalog/td-series" },
      { label: "Модули TDS / TDH", href: "/catalog/modules" },
      { label: "Загрузки", href: "/zagruzki" },
    ],
  },
  {
    eyebrow: "Ламповые NOVIK",
    title: "Архивные ламповые усилители и акустика NOVIK",
    note: "Ламповые усилители мощности 602, 1202, 202, серий C, E и VIK PRO, а также акустические системы K, B, SW, AK и AB сняты с производства. На карточках — мощность, комплект ламп, габариты и вес по каждой модели.",
    models: [],
    slugs: ["novik-tube-archive", "novik-acoustics"],
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
  "Снятые с производства усилители мощности, процессоры и модули NAG, ламповые усилители и акустические системы NOVIK. Этих моделей больше нет в продаже — ниже актуальные замены. По ремонту и обслуживанию архивной техники свяжитесь с нами.";

export const metadata: Metadata = {
  title: "Архивные модели — сняты с производства",
  description:
    "Снятые с производства NAG / NOVIK: серии QM, MA, RA, RD, Q, RF и MQ, процессоры, CX-520/540 и TDX, ламповые NOVIK 602 / 1202 / 202 и акустика K / B / SW. Характеристики, коммутация, актуальные замены и сервис.",
  alternates: { canonical: "/catalog/arhiv" },
  openGraph: {
    title: "Архивные модели NAG · NOVIK — сняты с производства",
    description:
      "Старые модели NAG / NOVIK и их актуальные замены: транзисторные серии QM, MA, RA, RD, Q, RF и MQ, процессоры, ламповые усилители и акустические системы.",
  },
};

export default function ArchivePage() {
  return (
    <div>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />

      <Surface mode="dark" className="py-16">
        <Container>
          <Breadcrumb items={CRUMBS} />
          <div className="enter mt-6 max-w-prose">
            <Eyebrow accent>Сняты с производства</Eyebrow>
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

              {group.slugs && (
                <div className="reveal-stagger mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
                  {group.slugs.map((slug) => {
                    const product = getProduct(slug).frontmatter;
                    return <ProductCard key={slug} slug={slug} name={product.name} eyebrow={product.line} image={{ src: product.gallery[0].src, alt: product.gallery[0].alt }} price={{ amount: product.price?.amount, onRequest: product.price?.onRequest }} />;
                  })}
                </div>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                  {group.ctaLabel ?? "Актуальная замена"}
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
          <div className="reveal max-w-prose">
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
