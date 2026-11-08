import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader, Section, Breadcrumb, DownloadList } from "@/components/ds";
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
    <>
      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Загрузки" }]} />
      </Container>
      <Container className="pt-12">
        <PageHeader
          title="Загрузки"
          lead="Технические паспорта, руководства пользователя и программное обеспечение для оборудования NAG. Программы — под Windows."
        />
      </Container>

      <Container className="flex flex-col gap-24 pt-20">
        {groups.map((group) => (
          <Section
            key={group.slug}
            title={
              <Link href={`/catalog/${group.slug}`} className="text-ink no-underline hover:underline">
                {group.name}
              </Link>
            }
            description={group.category}
          >
            <DownloadList links={group.links} />
          </Section>
        ))}

        <p className="m-0 text-site-small text-ink-2">
          Не нашли нужный документ?{" "}
          <Link href="/kontakty" className="text-ink">
            Напишите нам
          </Link>{" "}
          — пришлём паспорт или ПО на вашу модель.
        </p>
      </Container>
    </>
  );
}
