import type { Metadata } from "next";
import Link from "next/link";
import { Container, Breadcrumb, PageHeader, Section, ProductRow, Tag, buttonVariants } from "@/components/ds";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { getProduct } from "@/lib/content/products";
import { productRow } from "@/lib/content/catalog";

/**
 * Archive page — snято с производства. These models still get search demand
 * (Yandex/Google queries by old part numbers) but no longer have product pages.
 * One landing page captures those queries and routes visitors to current
 * replacements instead of 404-ing or fabricating specs for discontinued gear.
 */

type Replacement = { label: string; href: string };
type ArchiveGroup = {
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
    title: "Архивные процессоры NAG",
    note: "Эти модели сняты с актуального каталога и сохранены в архиве с карточками и документацией.",
    models: [],
    slugs: ["the-rogue", "d-4", "d-8"],
    replacements: [{ label: "Актуальные процессоры", href: "/catalog/processors" }],
  },
  {
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
    <>
      <JsonLd data={breadcrumbSchema(CRUMBS)} />
      <Container className="pt-6">
        <Breadcrumb items={CRUMBS} />
        <PageHeader className="mt-12" title="Архивные модели" lead={LEDE} />
      </Container>

      <Container className="flex flex-col gap-24 pt-24 pb-24">
        {GROUPS.map((group) => (
          <Section
            key={group.title}
            title={group.title}
            description={group.note}
            aside={
              <>
                <p className="m-0 text-ink-2">{group.ctaLabel ?? "Актуальная замена"}</p>
                <ul role="list" className="mt-2 mb-0 flex list-none flex-col gap-2 p-0">
                  {group.replacements.map((r) => (
                    <li key={r.href}>
                      <Link href={r.href} className="text-ink">
                        {r.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            }
          >
            {group.models.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {group.models.map((model) => (
                  <Tag key={model}>{model}</Tag>
                ))}
              </div>
            )}
            {/* Archived models are not sold: the price slot says so instead of «По запросу». */}
            {group.slugs?.map((slug) => (
              <ProductRow key={slug} {...productRow(getProduct(slug).frontmatter, { price: "Нет в продаже" })} />
            ))}
          </Section>
        ))}

        <Section id="service" title="Нужна замена, обмен или ремонт архивной модели?">
          <p className="mt-0 mb-0 max-w-2xl text-ink-2">
            Подберём актуальный аналог под вашу задачу, обсудим обмен старого аппарата и обслужим снятую с производства технику NAG · NOVIK.
          </p>
          <Link href="/kontakty" className={buttonVariants({ variant: "primary", className: "mt-6" })}>
            Обмен и ремонт
          </Link>
        </Section>
      </Container>
    </>
  );
}
