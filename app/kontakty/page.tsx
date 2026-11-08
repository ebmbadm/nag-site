import type { Metadata } from "next";
import { Container, PageHeader, Section, Breadcrumb, buttonVariants } from "@/components/ds";
import { ContactForm } from "@/components/company/contact-form";
import { getContacts } from "@/lib/content/company";

const c = getContacts();
const mapHref = `https://yandex.ru/maps/?text=${encodeURIComponent(c.address.lines.join(", "))}`;

export const metadata: Metadata = {
  alternates: { canonical: "/kontakty" },
  title: "Контакты",
  description: "Телефон +7 921 937 25 08, почта novikamps@mail.ru, офис в Санкт-Петербурге. Свяжитесь с нами.",
};

export default function ContactsPage() {
  return (
    <>
      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
      </Container>
      <Container className="pt-12">
        <PageHeader title={c.title} lead={c.lede} />
      </Container>

      <Container className="flex flex-col gap-24 pt-20">
        <Section title="Телефон, почта и офис" description={c.eyebrow}>
          <dl className="m-0 max-w-2xl">
            <div className="flex flex-wrap gap-x-8 gap-y-1 border-t border-line py-4">
              <dt className="w-28 shrink-0 text-ink-2">Телефон</dt>
              <dd className="m-0">
                <a href={c.phone.href} className="text-site-title text-ink">
                  {c.phone.display}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-1 border-t border-line py-4">
              <dt className="w-28 shrink-0 text-ink-2">E-mail</dt>
              <dd className="m-0">
                <a href={c.email.href} className="text-site-title text-ink">
                  {c.email.display}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-1 border-y border-line py-4">
              <dt className="w-28 shrink-0 text-ink-2">Офис</dt>
              <dd className="m-0">
                <address className="not-italic">
                  {c.address.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a
                  href={mapHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonVariants({ variant: "secondary", size: "md", className: "mt-4" })}
                >
                  Открыть на Яндекс.Картах
                </a>
              </dd>
            </div>
          </dl>
        </Section>

        <Section title={c.form.title}>
          <ContactForm form={c.form} />
        </Section>
      </Container>
    </>
  );
}
