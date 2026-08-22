import Link from "next/link";
import Image from "next/image";
import { Phone } from "lucide-react";
import { Container, buttonVariants } from "@/components/ds";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

export const NAV = [
  { label: "Каталог", href: "/catalog" },
  { label: "Процессоры", href: "/catalog/processors" },
  { label: "Усилители", href: "/catalog/amplifiers" },
  { label: "Модули", href: "/catalog/modules" },
  { label: "Лампы", href: "/catalog/tubes" },
  { label: "О компании", href: "/o-kompanii" },
  { label: "Контакты", href: "/kontakty" },
];

/** Global sticky navigation header. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/86 backdrop-blur-md supports-[backdrop-filter]:bg-bg/72">
      <Container className="flex h-[58px] items-center gap-6">
        <Link href="/" className="flex shrink-0 items-center" aria-label="NAG — на главную">
          <Image
            src="/brand/nag-logo-onlight.png"
            alt="NAG"
            width={96}
            height={20}
            priority
            className="h-5 w-auto"
          />
        </Link>

        <NavLinks items={NAV} />

        <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
          <a
            href="tel:+79219372508"
            aria-label="Позвонить: +7 921 937 25 08"
            className={buttonVariants({ variant: "outline", size: "sm", className: "font-mono" })}
          >
            <Phone className="size-4 lg:hidden" aria-hidden />
            <span className="hidden lg:inline">+7 921 937 25 08</span>
          </a>
          <MobileNav nav={NAV} />
        </div>
      </Container>
    </header>
  );
}
