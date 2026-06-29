import Link from "next/link";
import Image from "next/image";
import { FileText, MonitorSmartphone } from "lucide-react";
import {
  Container,
  Eyebrow,
  Badge,
  Chip,
  Divider,
  Surface,
  SpecTable,
  AccordionItem,
  Figure,
  Gallery,
  Breadcrumb,
  buttonVariants,
} from "@/components/ds";
import { FeatureIcon } from "./icon-map";
import { formatPrice } from "@/lib/format";
import type { ProductFrontmatter } from "@/lib/content/schema";

const CONTACT_EMAIL = "novikamps@mail.ru";
const CONTACT_TEL = "+79219372508";

export function ProductHero({ product }: { product: ProductFrontmatter }) {
  const { price, models, partnerLogos, software, specGroups } = product;

  // Derived price display
  const minModelPrice =
    models && models.length > 0
      ? models.filter((m) => m.price != null).map((m) => m.price!)
      : [];
  const displayPrice =
    minModelPrice.length > 0
      ? `от ${formatPrice(Math.min(...minModelPrice))}`
      : price?.amount != null
        ? formatPrice(price.amount, price.currency ?? "₽")
        : null;

  return (
    <Container className="grid gap-10 py-10 lg:grid-cols-2 lg:gap-14">
      <Gallery images={product.gallery} />

      <div className="flex flex-col">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Eyebrow accent>{product.line}</Eyebrow>
          {product.badges.map((b) => (
            <Badge key={b}>{b}</Badge>
          ))}
        </div>

        <h1
          className="font-display uppercase text-text"
          style={{
            fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
            lineHeight: "var(--lh-tight)",
            letterSpacing: "var(--ls-tight)",
          }}
        >
          {product.name}
        </h1>
        {product.subtitle ? (
          <p className="mt-2 font-mono text-sm text-text-muted">{product.subtitle}</p>
        ) : null}

        <p
          className="mt-5 max-w-prose text-sm text-text-muted"
          style={{ lineHeight: "var(--lh-relaxed)" }}
        >
          {product.summary}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {product.specChips.map((chip) => (
            <Chip key={chip}>{chip}</Chip>
          ))}
        </div>

        <Divider className="my-7" />

        {/* Price block */}
        {(displayPrice || price?.onRequest) && (
          <div>
            <Eyebrow className="block">
              {models && minModelPrice.length > 0 ? "Цена от" : "Розничная цена"}
            </Eyebrow>
            {displayPrice ? (
              <div
                className="mt-1 font-display text-text"
                style={{ fontSize: "var(--text-4xl)", lineHeight: "var(--lh-tight)" }}
              >
                {displayPrice}
              </div>
            ) : null}
            {price?.note ? (
              <p className="mt-1.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                {price.note}
              </p>
            ) : null}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-6 flex flex-wrap gap-3">
          {price?.onRequest ? (
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Запрос цены: ${product.name}`)}`}
              className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
            >
              Запросить расчёт
            </a>
          ) : (
            <>
              <a
                href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Заказ: ${product.name}`)}`}
                className={buttonVariants({ variant: "primary", size: "lg", className: "min-w-40" })}
              >
                В корзину
              </a>
              <a
                href={`tel:${CONTACT_TEL}`}
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                Купить в 1 клик
              </a>
            </>
          )}
        </div>
        <p className="mt-3 font-mono text-2xs text-text-faint">
          Оформление — по телефону или почте. Онлайн-корзина скоро.
        </p>

        {/* Quick-links — shown only when the sections exist */}
        {(software || specGroups.length > 0) && (
          <div className="mt-6 flex flex-wrap gap-5 text-text-muted">
            {software && (
              <a
                href="#software"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
              >
                <MonitorSmartphone className="size-4" aria-hidden /> Программа
              </a>
            )}
            {specGroups.length > 0 && (
              <a
                href="#specs"
                className="inline-flex items-center gap-2 text-sm transition-colors hover:text-accent"
              >
                <FileText className="size-4" aria-hidden /> Характеристики
              </a>
            )}
          </div>
        )}

        {/* Partner logo strip — frontmatter-driven */}
        {partnerLogos && partnerLogos.length > 0 && (
          <div className="mt-6 flex items-center gap-4 opacity-80">
            {partnerLogos.map((logo) => (
              <Image
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-5 w-auto"
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

export function FeatureBand({ features }: { features: NonNullable<ProductFrontmatter["features"]> }) {
  return (
    <Surface mode="dark" className="relative overflow-hidden py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ background: "radial-gradient(60% 80% at 80% 0%, rgba(245,158,46,0.10), transparent 70%)" }}
        aria-hidden
      />
      <Container className="relative">
        <Eyebrow accent className="mb-3 block">
          {features.eyebrow}
        </Eyebrow>
        <h2
          className="mb-10 font-display uppercase text-text"
          style={{ fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
        >
          {features.title}
        </h2>
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {features.cards.map((card) => (
            <div key={card.title} className="bg-bg p-6">
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-accent text-on-accent">
                <FeatureIcon name={card.icon} className="size-5" />
              </div>
              <h3 className="mb-2 font-display text-md uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
                {card.title}
              </h3>
              <p className="text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Surface>
  );
}

export function TechBand({ tech }: { tech: NonNullable<ProductFrontmatter["tech"]> }) {
  return (
    <Surface mode="dark" className="py-16" style={{ background: "var(--nag-black-980)" }}>
      <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Eyebrow accent className="mb-3 block">
            {tech.eyebrow}
          </Eyebrow>
          <h2
            className="mb-3 font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            {tech.title}
          </h2>
          {tech.lede ? (
            <p className="mb-7 max-w-prose text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {tech.lede}
            </p>
          ) : null}
          <div className="space-y-3">
            {tech.cards.map((card) => (
              <div
                key={card.label}
                className="rounded-[var(--radius-md)] border border-border bg-surface px-5 py-4"
                style={{ borderLeft: "var(--border-w-rule) solid var(--accent)" }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">{card.label}</span>
                  <span className="font-mono text-sm text-text tabular">{card.chip}</span>
                </div>
                <p className="mt-1 text-sm text-text-muted">{card.text}</p>
              </div>
            ))}
          </div>
        </div>

        {tech.image ? (
          <Figure
            src={tech.image.src}
            alt={tech.image.alt}
            caption={tech.image.caption}
            className="lg:order-last"
          />
        ) : null}
      </Container>
    </Surface>
  );
}

export function SoftwareSection({
  software,
  docs,
}: {
  software: NonNullable<ProductFrontmatter["software"]>;
  docs?: ProductFrontmatter["docs"];
}) {
  return (
    <section id="software" className="scroll-mt-20 py-16">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <Eyebrow accent className="mb-3 block">
              {software.eyebrow}
            </Eyebrow>
            <h2
              className="font-display uppercase text-text"
              style={{ fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
            >
              {software.title}
            </h2>
          </div>
          {software.lede ? (
            <p className="max-w-md text-sm text-text-muted lg:text-right" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {software.lede}
            </p>
          ) : null}
        </div>

        <Figure
          src={software.hero.src}
          alt={software.hero.alt}
          caption={software.hero.caption}
          className="mt-8"
        />

        {docs && docs.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {docs.map((doc) => (
              <a
                key={doc.href}
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonVariants({ variant: "outline", size: "md" })}
              >
                {doc.label}
              </a>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {software.items.map((item) => (
            <div key={item.title}>
              <Figure src={item.src} alt={item.alt} className="[&_img]:aspect-video" height={400} />
              <h3 className="mt-3 font-display text-md uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>
                {item.title}
              </h3>
              {item.text ? <p className="mt-1 text-sm text-text-muted">{item.text}</p> : null}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function SpecsSection({ groups }: { groups: ProductFrontmatter["specGroups"] }) {
  return (
    <section id="specs" className="scroll-mt-20 border-t border-border bg-surface-2 py-16">
      <Container>
        <Eyebrow accent className="mb-3 block">
          Технические данные
        </Eyebrow>
        <h2
          className="mb-8 font-display uppercase text-text"
          style={{ fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
        >
          Характеристики
        </h2>
        <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
          {groups.map((group) => (
            <AccordionItem
              key={group.title}
              summary={group.title}
              defaultOpen={group.defaultOpen}
              className="border-t-0 px-5 [&+*]:border-t [&+*]:border-border"
            >
              <SpecTable rows={group.rows} />
            </AccordionItem>
          ))}
        </div>
      </Container>
    </section>
  );
}
