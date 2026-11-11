import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/ds";
import { NavLinks, type NavItem } from "./nav-links";

/** Catalog sections first (ink), company pages after them (ink-2). */
export const NAV: NavItem[] = [
  { label: "Усилители", href: "/catalog/amplifiers" },
  { label: "Процессоры", href: "/catalog/processors" },
  { label: "Модули", href: "/catalog/modules" },
  { label: "Ламповые NOVIK", href: "/catalog/tubes" },
  { label: "О компании", href: "/o-kompanii", secondary: true },
  { label: "Контакты", href: "/kontakty", secondary: true },
];

/** Logo, sections as text, phone on the right. No buttons in the header. */
export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <Container className="flex min-h-18 flex-wrap items-center gap-x-10 gap-y-3 py-4">
        <Link href="/" className="block shrink-0" aria-label="NAG · NOVIK, на главную">
          <Image
            src="/brand/nag-logo-onlight.png"
            alt=""
            width={106}
            height={22}
            priority
            className="block h-5.5 w-auto"
          />
        </Link>
        <a
          href="tel:+79219372508"
          className="order-2 ml-auto text-base font-medium text-ink no-underline hover:underline lg:order-3"
        >
          +7 921 937 25 08
        </a>
        <NavLinks items={NAV} className="order-3 w-full lg:order-2 lg:w-auto lg:flex-1" />
      </Container>
    </header>
  );
}
