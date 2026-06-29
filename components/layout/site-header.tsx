import Link from "next/link";
import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Container } from "@/components/ds";
import { MobileNav } from "./mobile-nav";

const NAV = [
  { label: "Каталог", href: "/catalog" },
  { label: "Процессоры", href: "/catalog/processors" },
  { label: "Усилители", href: "/catalog/amplifiers" },
  { label: "Лампы", href: "/catalog/tubes" },
  { label: "О компании", href: "/istoriya" },
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

        <nav className="hidden flex-1 items-center gap-6 lg:flex" aria-label="Основная навигация">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:rounded-[var(--radius-xs)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 lg:flex-none">
          <button
            type="button"
            aria-label="Корзина"
            className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-border text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
          >
            <ShoppingCart className="size-4" aria-hidden />
          </button>
          <MobileNav nav={NAV} />
        </div>
      </Container>
    </header>
  );
}
