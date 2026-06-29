import type { Metadata } from "next";
import { Container, Eyebrow, Breadcrumb } from "@/components/ds";
import { ContactForm } from "@/components/company/contact-form";
import { getContacts } from "@/lib/content/company";

const c = getContacts();

export const metadata: Metadata = {
  title: "Контакты · NAG · NOVIK",
  description: "Телефон +7 921 937 25 08, почта novikamps@mail.ru, офис в Санкт-Петербурге. Свяжитесь с нами.",
};

export default function ContactsPage() {
  return (
    <Container className="py-10">
      <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Контакты" }]} />
      <header className="mt-6 max-w-prose">
        <Eyebrow accent>{c.eyebrow}</Eyebrow>
        <h1
          className="mt-3 font-display uppercase text-text"
          style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
        >
          {c.title}
        </h1>
        <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>{c.lede}</p>
      </header>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Eyebrow>Телефон</Eyebrow>
            <a href={c.phone.href} className="mt-1 block font-display text-2xl text-text hover:text-accent">{c.phone.display}</a>
          </div>
          <div>
            <Eyebrow>E-mail</Eyebrow>
            <a href={c.email.href} className="mt-1 block font-display text-2xl text-text hover:text-accent">{c.email.display}</a>
          </div>
          <div>
            <Eyebrow>Офис</Eyebrow>
            <address className="mt-1 not-italic text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {c.address.lines.map((l) => (
                <span key={l} className="block">{l}</span>
              ))}
            </address>
          </div>
          <div className="rounded-[var(--radius-md)] border border-border bg-surface-2 p-4 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Карта появится позже. Адрес указан выше.
          </div>
        </div>

        <ContactForm form={c.form} />
      </div>
    </Container>
  );
}
