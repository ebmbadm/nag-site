import * as React from "react";
import Link from "next/link";
import {
  Container,
  Breadcrumb,
  PageHeader,
  Section,
  Tabs,
  SpecTable,
  SpecGroups,
  SpecMatrixTable,
  Figure,
  Prose,
  DownloadList,
  ProductRow,
  type BreadcrumbItem,
  type TabItem,
} from "@/components/ds";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/format";
import { describeDownload } from "@/lib/content/downloads";
import { FRONT_PHOTO, fromPrice, productRow } from "@/lib/content/catalog";
import { getContacts } from "@/lib/content/company";
import type { ProductFrontmatter } from "@/lib/content/schema";
import { ProductCtaButtons } from "./product-cta-buttons";

/**
 * Content the QM-400 and modules pages carried in their own layouts before the
 * redesign. The generic card shows it in the same Section language.
 */
const EXTRAS: Record<
  string,
  {
    specsNote?: string;
    construction?: { title: string; text: string; image: { src: string; alt: string; width: number; height: number } };
  }
> = {
  "qm-400": {
    construction: {
      title: "Четыре канала в одном шасси",
      text: "Каждый из четырёх каналов работает как самостоятельный усилительный тракт со своим блоком питания. Такая архитектура уменьшает взаимное влияние каналов и сохраняет работу остальных при неисправности одного.",
      image: { src: "/products/amplifiers/qm-400-top-open.jpg", alt: "QM-400 со снятой верхней крышкой", width: 1680, height: 945 },
    },
  },
  modules: {
    specsNote:
      "Общие характеристики едины для TDS-10, TDH-10, TDS-20 и TDH-20. Подключение: XLR M/F с LINK, питание POWERCON и последовательное подключение AC LINK.",
  },
};

/**
 * The order box: price, its note, one red action, the phone, 3–4 key
 * parameters and the manual. Archived models have no price, only a repair and
 * trade-in request.
 */
export function ProductBuyBox({ product }: { product: ProductFrontmatter }) {
  const { price, archived, docs } = product;
  const phone = getContacts().phone;
  const from = fromPrice(product);
  const manual = docs?.find((d) => /руководство/i.test(d.label));
  const keyParams = product.specGroups.flatMap((g) => g.rows).slice(0, 4);

  return (
    <aside aria-label="Цена и заказ" className="flex flex-col gap-4 rounded-lg border border-line p-6">
      {!archived && from ? (
        <p className="m-0 text-site-section">
          {from.from ? "от " : ""}
          {formatPrice(from.amount, price?.currency ?? "₽")}
        </p>
      ) : null}
      {!archived && !from && price?.onRequest ? (
        <p className="m-0 text-site-title font-medium text-ink-2">По запросу</p>
      ) : null}
      {!archived && price?.note ? <p className="-mt-3 mb-0 text-site-small text-ink-3">{price.note}</p> : null}

      <ProductCtaButtons price={price} archived={archived} name={product.name} slug={product.slug} />

      <p className="m-0 text-site-small text-ink-2">
        Или позвоните:{" "}
        <a href={phone.href} className="font-medium text-ink">
          {phone.display}
        </a>
      </p>

      {keyParams.length > 0 ? <SpecTable compact rows={keyParams} /> : null}

      {manual ? (
        <a href={manual.href} className="text-site-small text-ink">
          {manual.label}
          {manual.href.endsWith(".pdf") ? ", PDF" : ""}
        </a>
      ) : null}
    </aside>
  );
}

export function SpecsSection({
  groups,
  specMatrix,
  note,
}: {
  groups: ProductFrontmatter["specGroups"];
  specMatrix?: ProductFrontmatter["specMatrix"];
  note?: string;
}) {
  return (
    <Section id="specs" title="Характеристики" description={note}>
      {specMatrix ? (
        <div className="mb-12">
          <SpecMatrixTable
            columns={specMatrix.columns}
            rows={specMatrix.rows}
            caption={specMatrix.caption ?? "Сравнение моделей"}
          />
        </div>
      ) : null}
      <SpecGroups groups={groups} />
    </Section>
  );
}

/** Title → text pairs in two columns: features and tech cards without the cards. */
function DefinitionList({ items }: { items: { term: string; value?: string; text: string }[] }) {
  return (
    <dl className="m-0 grid gap-x-10 gap-y-8 sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.term}>
          <dt className="font-semibold">{item.term}</dt>
          {item.value ? <dd className="mt-1 ml-0">{item.value}</dd> : null}
          <dd className="mt-2 ml-0 text-site-small text-ink-2">{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * The whole product card, synchronous so tests can render it. `body` is the
 * rendered MDX, `related` the other models of the same category.
 */
export function ProductPageView({
  product: p,
  body,
  related = [],
}: {
  product: ProductFrontmatter;
  body?: React.ReactNode;
  related?: ProductFrontmatter[];
}) {
  const crumbs: BreadcrumbItem[] = [{ label: "Главная", href: "/" }, ...p.breadcrumb];
  const extra = EXTRAS[p.slug] ?? {};
  const front = FRONT_PHOTO[p.slug];
  const hero = front
    ? { src: front.src, alt: `${p.name}, ${front.boxed ? "вид модуля" : "передняя панель"}`, width: front.width, height: front.height }
    : { ...p.gallery[0], width: 1200, height: 750 };
  // gallery[0] is the hero view (or its uncleaned twin with badges on it).
  const photos = p.gallery.slice(1);
  const category = [...p.breadcrumb].reverse().find((b) => b.href);

  const tabs: TabItem[] = [
    p.specGroups.length > 0 && { label: "Характеристики", href: "#specs" },
    photos.length > 0 && { label: "Фото", href: "#photos" },
    p.docs && p.docs.length > 0 && { label: "Документы", href: "#docs" },
    related.length > 0 && { label: "Другие модели", href: "#related" },
  ].filter((t): t is TabItem => Boolean(t));

  return (
    <>
      <Container className="pt-6">
        <Breadcrumb items={crumbs} />
        <PageHeader title={p.name} lead={p.subtitle} className="mt-10" />

        <Figure
          src={hero.src}
          alt={hero.alt}
          width={hero.width}
          height={hero.height}
          priority
          className="mt-12"
          imgClassName={cn(!front || front.boxed ? "mx-auto max-h-120 w-auto" : undefined)}
        />

        <div className="mt-12 flex flex-wrap items-start gap-12">
          <div className="min-w-0 max-w-2xl flex-[3_1_480px]">
            {/* The MDX body restates the summary; the summary stands in only when there is no body. */}
            {body ? <Prose>{body}</Prose> : <p className="m-0 text-site-body">{p.summary}</p>}
          </div>
          <div className="min-w-0 flex-[1_1_320px]">
            <ProductBuyBox product={p} />
          </div>
        </div>

        {tabs.length > 0 ? <Tabs items={tabs} className="mt-16" /> : null}
      </Container>

      <Container className="flex flex-col gap-24 pt-16 pb-24">
        {p.specGroups.length > 0 ? (
          <SpecsSection groups={p.specGroups} specMatrix={p.specMatrix} note={extra.specsNote} />
        ) : null}

        {photos.length > 0 ? (
          <Section id="photos" title="Фото">
            <div className="grid gap-8 sm:grid-cols-2">
              {photos.map((img) => (
                <Figure key={img.src} src={img.src} alt={img.alt} caption={img.caption} />
              ))}
            </div>
          </Section>
        ) : null}

        {p.features ? (
          <Section title={p.features.title}>
            <DefinitionList items={p.features.cards.map((c) => ({ term: c.title, text: c.text }))} />
          </Section>
        ) : null}

        {p.tech ? (
          <Section title={p.tech.title} description={p.tech.lede}>
            <DefinitionList items={p.tech.cards.map((c) => ({ term: c.label, value: c.chip, text: c.text }))} />
            {p.tech.image ? (
              <Figure src={p.tech.image.src} alt={p.tech.image.alt} caption={p.tech.image.caption} className="mt-10" />
            ) : null}
          </Section>
        ) : null}

        {extra.construction ? (
          <Section title={extra.construction.title}>
            <p className="mt-0 mb-8 max-w-2xl text-site-body">{extra.construction.text}</p>
            <Figure {...extra.construction.image} />
          </Section>
        ) : null}

        {p.software ? (
          <Section id="software" title={p.software.title} description={p.software.lede}>
            <Figure src={p.software.hero.src} alt={p.software.hero.alt} caption={p.software.hero.caption} />
            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {p.software.items.map((item) => (
                <div key={item.title}>
                  {/* contain, not cover: square UI captures would lose their title bar. */}
                  <Figure src={item.src} alt={item.alt} height={400} imgClassName="aspect-video object-contain" />
                  <h3 className="mt-4 mb-0 text-site-title">{item.title}</h3>
                  {item.text ? <p className="mt-1 mb-0 text-site-small text-ink-2">{item.text}</p> : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {p.docs && p.docs.length > 0 ? (
          <Section id="docs" title="Документы">
            <DownloadList links={p.docs.map(describeDownload)} />
          </Section>
        ) : null}

        {related.length > 0 ? (
          <Section
            id="related"
            title="Другие модели"
            aside={
              category?.href ? (
                <Link href={category.href} className="text-ink">
                  {category.label}
                </Link>
              ) : undefined
            }
          >
            {related.map((r) => (
              <ProductRow key={r.slug} {...productRow(r)} />
            ))}
          </Section>
        ) : null}
      </Container>
    </>
  );
}
