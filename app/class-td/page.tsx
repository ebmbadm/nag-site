import type { Metadata } from "next";
import Link from "next/link";
import {
  AccordionItem,
  Breadcrumb,
  Container,
  Eyebrow,
  SectionHeader,
  Surface,
  Toc,
  buttonVariants,
  type TocItem,
} from "@/components/ds";
import { Block } from "@/components/history/blocks";
import { JsonLd } from "@/components/seo/json-ld";
import { getClassTdArticle } from "@/lib/content/articles";
import { articleSchema, breadcrumbSchema } from "@/lib/seo";

const a = getClassTdArticle();

const DESCRIPTION =
  "Чем Class-TD отличается от Class-D, что означают классы A, AB, G и H и на какие цифры в паспорте смотреть при выборе усилителя мощности.";

export const metadata: Metadata = {
  alternates: { canonical: "/class-td" },
  title: { absolute: "Class-TD: что это и чем отличается от Class-D — классы усилителей" },
  description: DESCRIPTION,
  openGraph: {
    title: "Class-TD: что это и чем отличается от Class-D",
    description: DESCRIPTION,
    url: "/class-td",
    type: "article",
  },
};

const tocItems: TocItem[] = a.sections.map((s) => ({
  id: s.id,
  label: s.title,
  meta: s.label.split(" · ")[0],
}));

export default function ClassTdPage() {
  return (
    <div>
      <JsonLd
        data={[
          ...articleSchema({
            path: "/class-td",
            headline: a.hero.title,
            description: DESCRIPTION,
            faq: a.faq,
          }),
          breadcrumbSchema([
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog" },
            { label: "Class-TD" },
          ]),
        ]}
      />

      <Surface mode="dark" className="py-16">
        <Container>
          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: "Каталог", href: "/catalog" },
              { label: "Class-TD" },
            ]}
          />
          <div className="enter mt-6 max-w-prose">
            <Eyebrow accent>{a.hero.eyebrow}</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{
                fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              {a.hero.title}
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {a.hero.lede}
            </p>
          </div>
        </Container>
      </Surface>

      <Container className="py-12">
        <div className="reveal max-w-[66ch] border-l-[var(--border-w-rule)] border-accent bg-surface p-6">
          <div className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            {a.answer.title}
          </div>
          <div className="mt-3">
            <Block block={{ type: "p", text: a.answer.text }} />
          </div>
        </div>
      </Container>

      <Container className="pb-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="max-w-[66ch]">
            {a.sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 border-t border-border pt-10">
                <div className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-accent">
                  {s.label}
                </div>
                <h2
                  className="mb-6 mt-2 font-display uppercase text-text"
                  style={{
                    fontSize: "clamp(var(--text-xl), 3.5vw, var(--text-3xl))",
                    lineHeight: "var(--lh-tight)",
                    letterSpacing: "var(--ls-tight)",
                  }}
                >
                  {s.title}
                </h2>
                {s.blocks.map((b, i) => (
                  <Block key={i} block={b} />
                ))}
              </section>
            ))}
          </div>

          <aside className="hidden lg:block">
            <Toc items={tocItems} className="sticky top-28" />
          </aside>
        </div>
      </Container>

      <section className="border-t border-border bg-surface-2 py-16">
        <Container>
          <SectionHeader eyebrow="Частые вопросы" title="Коротко о классах" className="mb-6" />
          <div className="max-w-[72ch]">
            {a.faq.map((f) => (
              <AccordionItem key={f.q} summary={f.q}>
                <p className="pb-5 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
                  {f.a}
                </p>
              </AccordionItem>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <div className="max-w-[66ch]">
          <h2
            className="font-display uppercase text-text"
            style={{ fontSize: "var(--text-2xl)", letterSpacing: "var(--ls-tight)" }}
          >
            {a.cta.title}
          </h2>
          <p className="mt-3 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            {a.cta.text}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {a.cta.links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={buttonVariants({ variant: i === 0 ? "primary" : "outline", size: "lg" })}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
