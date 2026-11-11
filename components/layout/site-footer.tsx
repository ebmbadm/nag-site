import Link from "next/link";
import { Container } from "@/components/ds";

const COLUMNS = [
  {
    title: "Каталог",
    links: [
      { label: "Усилители мощности", href: "/catalog/amplifiers" },
      { label: "Процессоры", href: "/catalog/processors" },
      { label: "Модули", href: "/catalog/modules" },
      { label: "Ламповые усилители", href: "/catalog/tubes" },
      { label: "Ламповый бутик", href: "/catalog/boutique" },
      { label: "Сейверы и конверторы", href: "/catalog/boutique" },
      { label: "Архив моделей", href: "/catalog/arhiv" },
    ],
  },
  {
    title: "Компания",
    links: [
      { label: "О компании", href: "/o-kompanii" },
      { label: "История", href: "/istoriya#history-top" },
      { label: "Загрузки", href: "/zagruzki" },
      { label: "Гарантия и сервис", href: "/garantiya" },
      { label: "Контакты", href: "/kontakty" },
    ],
  },
];

/** Footer: company and contacts on the left, two link lists, one quiet bottom line. */
export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Container className="flex flex-wrap gap-x-12 gap-y-10 pt-10 pb-12 text-site-small text-ink-2">
        <div className="min-w-0 flex-[2_1_280px]">
          <p className="m-0 font-medium text-ink">NAG · NOVIK</p>
          <p className="mt-2 mb-0 max-w-sm">
            Санкт-Петербург, Московское шоссе, 25 литера А, офис 216А. Компания NOVIK — с 1992 года, NAG — её
            бренд.
          </p>
          <p className="mt-4 mb-0 flex flex-col gap-1">
            <a href="tel:+79219372508" className="font-medium text-ink no-underline hover:underline">
              +7 921 937 25 08
            </a>
            <a href="mailto:novikamps@mail.ru" className="text-ink no-underline hover:underline">
              novikamps@mail.ru
            </a>
          </p>
        </div>

        {COLUMNS.map((col) => (
          <div key={col.title} className="min-w-0 flex-[1_1_180px]">
            <h2 className="m-0 text-site-small font-medium text-ink">{col.title}</h2>
            <ul className="mt-3 mb-0 flex list-none flex-col gap-2 p-0">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-ink-2 underline decoration-transparent transition-quick hover:text-ink hover:decoration-current">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Container>
      <Container>
        <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-4 pb-8 text-site-caption text-ink-3">
          <span>© {new Date().getFullYear()} NAG · NOVIK</span>
          <span>Гарантия 2 года</span>
        </div>
      </Container>
    </footer>
  );
}
