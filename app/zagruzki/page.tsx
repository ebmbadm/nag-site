import type { Metadata } from "next";
import Link from "next/link";
import { Container, Eyebrow, Surface, Breadcrumb, DownloadList } from "@/components/ds";
import { getDownloadGroups } from "@/lib/content/downloads";

export const metadata: Metadata = {
  title: "Загрузки · NAG · NOVIK",
  description:
    "Технические паспорта, руководства пользователя и программное обеспечение для DSP-процессоров и усилителей NAG.",
  alternates: { canonical: "/zagruzki" },
};

export default function DownloadsPage() {
  const groups = getDownloadGroups();

  return (
    <div>
      <Surface mode="dark" className="py-16">
        <Container>
          <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Загрузки" }]} />
          <div className="enter mt-6 max-w-prose">
            <Eyebrow accent>Документация и ПО</Eyebrow>
            <h1
              className="mt-3 font-display uppercase text-text"
              style={{
                fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
                lineHeight: "var(--lh-tight)",
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Загрузки
            </h1>
            <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              Технические паспорта, руководства пользователя и программное обеспечение для
              оборудования NAG. Программы — под Windows.
            </p>
          </div>
        </Container>
      </Surface>

      <Container className="py-14">
        <div className="reveal-stagger space-y-12">
          {groups.map((group) => (
            <section key={group.slug}>
              <div className="reveal flex flex-wrap items-baseline justify-between gap-3 border-b border-border pb-3">
                <h2
                  className="font-display text-xl uppercase text-text"
                  style={{ letterSpacing: "var(--ls-tight)" }}
                >
                  <Link href={`/catalog/${group.slug}`} className="transition-colors hover:text-accent">
                    {group.name}
                  </Link>
                </h2>
                <Eyebrow>{group.category}</Eyebrow>
              </div>
              <DownloadList className="mt-4" links={group.links} />
            </section>
          ))}
        </div>

        <p className="mt-14 text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
          Не нашли нужный документ?{" "}
          <Link href="/kontakty" className="text-accent underline-offset-4 hover:underline">
            Напишите нам
          </Link>{" "}
          — пришлём паспорт или ПО на вашу модель.
        </p>
      </Container>
    </div>
  );
}
