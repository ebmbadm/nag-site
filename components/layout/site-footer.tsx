import Link from "next/link";
import Image from "next/image";
import { Container, Eyebrow } from "@/components/ds";

const COLUMNS = [
  {
    title: "Каталог",
    links: [
      { label: "Процессоры", href: "/catalog/processors" },
      { label: "Усилители мощности", href: "/catalog/amplifiers" },
      { label: "Ламповые усилители", href: "/catalog/tubes" },
      { label: "Ламповый бутик", href: "/catalog/boutique" },
      { label: "Конвертеры", href: "/catalog/converters" },
      { label: "Сейверы", href: "/catalog/savers" },
      { label: "Архив моделей", href: "/catalog/arhiv" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О компании", href: "/o-kompanii" },
      { label: "История", href: "/istoriya" },
      { label: "Загрузки", href: "/zagruzki" },
      { label: "Гарантия и сервис", href: "/garantiya" },
      { label: "Контакты", href: "/kontakty" },
    ],
  },
];

/** Global site footer — company, contacts, nav columns. */
export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface-2">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Image
            src="/brand/nag-logo-onlight.png"
            alt="NAG"
            width={110}
            height={23}
            className="h-6 w-auto"
          />
          <p className="mt-4 max-w-xs text-sm text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            Производство, продажа и сервис профессионального звукового оборудования. На рынке с 1992 года.
          </p>
          <div className="mt-5 space-y-1 font-mono text-sm text-text">
            <a href="tel:+79219372508" className="block transition-colors hover:text-accent">
              +7 921 937 25 08
            </a>
            <a href="mailto:novikamps@mail.ru" className="block transition-colors hover:text-accent">
              novikamps@mail.ru
            </a>
          </div>
          <p className="mt-4 text-xs text-text-muted" style={{ lineHeight: "var(--lh-normal)" }}>
            Санкт-Петербург, Московское шоссе, 25 литера А, офис 216А
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title}>
            {/* text-faint on bg-surface-2 is ~2.9:1 — below the 4.5:1 floor */}
            <Eyebrow className="mb-4 block text-text-muted">{col.title}</Eyebrow>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-accent"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-wrap items-center justify-between gap-2 py-5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">
          <span>© {new Date().getFullYear()} NAG · NOVIK</span>
          <span>EAC · Гарантия 1 год</span>
        </Container>
      </div>
    </footer>
  );
}
