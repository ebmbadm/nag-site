import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader, Section, SpecTable, Breadcrumb, buttonVariants } from "@/components/ds";
import { TextBlocks } from "@/components/company/text-blocks";
import { getGuarantee } from "@/lib/content/company";

const g = getGuarantee();

export const metadata: Metadata = {
  alternates: { canonical: "/garantiya" },
  title: "Гарантия и сервис",
  description:
    "Гарантия 2 года на каждый продукт. Сервис и обслуживание ламповых и транзисторных усилителей NOVIK · NAG.",
};

export default function GuaranteePage() {
  return (
    <>
      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Гарантия и сервис" }]} />
      </Container>
      <Container className="pt-12">
        <PageHeader title={g.hero.title} lead={g.hero.lede} />
      </Container>

      <Container className="flex flex-col gap-24 pt-20">
        <Section title="Срок гарантии">
          <SpecTable rows={g.terms.map((t) => ({ label: t.label, value: t.value }))} className="max-w-2xl" />
        </Section>

        <Section title={g.service.title}>
          <TextBlocks blocks={g.service.blocks} />
        </Section>

        <Section title={g.cta.text}>
          <Link href={g.cta.href} className={buttonVariants({ variant: "primary" })}>
            {g.cta.label}
          </Link>
        </Section>
      </Container>
    </>
  );
}
