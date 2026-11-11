import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader, buttonVariants } from "@/components/ds";

export const metadata: Metadata = {
  title: "Страница не найдена",
  robots: { index: false, follow: true },
};

/**
 * 404. Not a dead end — a routing desk.
 *
 * Demand on this site is brand plus part number, and /catalog/[slug] runs with
 * dynamicParams = false, so every guessed or discontinued model URL lands here.
 * The archive link is the important one: someone typing /catalog/rf-250 is an
 * owner of gear we stopped making, i.e. a buyer for its replacement. Downloads
 * come second because they are the site's most frequent conversion by a wide
 * margin — documentation is what most visitors actually came for.
 */
const ROUTES = [
  {
    title: "Каталог",
    text: "Усилители мощности, DSP-процессоры, встраиваемые модули и ламповые NOVIK.",
    href: "/catalog",
  },
  {
    title: "Загрузки: руководства и программы",
    text: "Руководства, технические паспорта и программы для оборудования NAG.",
    href: "/zagruzki",
  },
  {
    title: "Архив моделей",
    text: "Если вы искали модель по номеру — возможно, она уже не выпускается. Здесь её актуальная замена.",
    href: "/catalog/arhiv",
  },
  {
    title: "Контакты",
    text: "Телефон и почта. Подскажем модель под задачу или пришлём документ.",
    href: "/kontakty",
  },
];

export default function NotFound() {
  return (
    <Container className="pt-20">
      <PageHeader
        title="Такой страницы нет"
        lead="Адрес изменился, модель снята с производства или в ссылке опечатка. Ниже — четыре места, где почти наверняка есть то, за чем вы шли."
      >
        <div className="mt-8">
          <Link href="/" className={buttonVariants({ variant: "secondary" })}>
            На главную
          </Link>
        </div>
      </PageHeader>

      <ul className="mt-20 mb-0 list-none border-t border-line-strong p-0">
        {ROUTES.map((route) => (
          <li key={route.href} className="border-b border-line">
            <Link href={route.href} className="group block py-6 text-ink no-underline">
              <span className="text-site-title group-hover:underline">{route.title}</span>
              <span className="mt-1 block text-site-small text-ink-2">{route.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Container>
  );
}
