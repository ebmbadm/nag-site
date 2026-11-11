import type { Metadata } from "next";
import Link from "next/link";
import {
  AccordionItem,
  Breadcrumb,
  Container,
  PageHeader,
  Section,
  Tabs,
  buttonVariants,
} from "@/components/ds";
import { TextBlocks } from "@/components/company/text-blocks";
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

const BREADCRUMB = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "Class-TD" },
];

export default function ClassTdPage() {
  return (
    <>
      <JsonLd
        data={[
          ...articleSchema({
            path: "/class-td",
            headline: a.hero.title,
            description: DESCRIPTION,
            faq: a.faq,
          }),
          breadcrumbSchema(BREADCRUMB),
        ]}
      />

      <Container className="pt-6">
        <Breadcrumb items={BREADCRUMB} />
      </Container>
      <Container className="pt-12">
        <PageHeader title={a.hero.title} lead={a.hero.lede} />
        <Tabs
          className="mt-12"
          label="Разделы статьи"
          items={a.sections.map((s) => ({ label: s.title, href: `#${s.id}` }))}
        />
      </Container>

      <Container className="flex flex-col gap-24 pt-20">
        <Section title={a.answer.title}>
          <TextBlocks blocks={[{ type: "p", text: a.answer.text }]} />
        </Section>

        {a.sections.map((s) => (
          <Section key={s.id} id={s.id} title={s.title}>
            <TextBlocks blocks={s.blocks} />
          </Section>
        ))}

        <Section id="voprosy" title="Коротко о классах" description="Частые вопросы">
          <div className="max-w-2xl">
            {a.faq.map((f) => (
              <AccordionItem key={f.q} summary={f.q}>
                <p className="m-0">{f.a}</p>
              </AccordionItem>
            ))}
          </div>
        </Section>

        <Section title={a.cta.title} description={a.cta.text}>
          <div className="flex flex-wrap gap-3">
            {a.cta.links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                className={buttonVariants({ variant: i === 0 ? "primary" : "secondary" })}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </Section>
      </Container>
    </>
  );
}
