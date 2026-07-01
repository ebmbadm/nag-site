"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Container, Rule } from "@/components/ds";

export type NavItem = { label: string; href: string };

function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  active: boolean,
) {
  React.useEffect(() => {
    if (!active || !ref.current) return;
    const el = ref.current;
    const focusable = Array.from(
      el.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    first?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
    el.addEventListener("keydown", handleKeyDown);
    return () => el.removeEventListener("keydown", handleKeyDown);
  }, [active, ref]);
}

/** Full-screen mobile nav overlay — visible at < lg. */
export function MobileNav({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = React.useState(false);
  const overlayRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const overlayId = "mobile-nav-overlay";

  useFocusTrap(overlayRef, open);

  React.useEffect(() => {
    if (!open) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  React.useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-label="Открыть меню"
        aria-expanded={open}
        aria-controls={overlayId}
        onClick={() => setOpen(true)}
        className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-border text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] lg:hidden"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open &&
        typeof document !== "undefined" &&
        createPortal(
          /* Surface doesn't forwardRef — use raw div with data-surface="dark" */
          <div
            ref={overlayRef}
            data-surface="dark"
            id={overlayId}
            role="dialog"
            aria-modal="true"
            aria-label="Навигация"
            className="fixed inset-0 z-50 flex flex-col bg-bg text-text"
            style={{
              animation: "mobileNavIn var(--dur-slow) var(--ease-out) both",
            }}
          >
            {/* Header row */}
            <Container className="flex h-[58px] shrink-0 items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)} aria-label="NAG — на главную">
                <Image
                  src="/brand/nag-logo-onlight.png"
                  alt="NAG"
                  width={96}
                  height={20}
                  className="h-5 w-auto"
                />
              </Link>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={() => {
                  setOpen(false);
                  triggerRef.current?.focus();
                }}
                className="inline-flex size-9 items-center justify-center rounded-[var(--radius-md)] border border-border text-text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]"
              >
                <X className="size-5" aria-hidden />
              </button>
            </Container>

            {/* Nav links */}
            <nav aria-label="Основная навигация" className="flex-1 overflow-y-auto">
              <Container className="py-8">
                {nav.map((item, i) => (
                  <React.Fragment key={item.href}>
                    {i > 0 && <Rule className="my-4 w-full" />}
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block py-2 font-display uppercase text-text transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)] focus-visible:rounded-[var(--radius-xs)]"
                      style={{
                        fontSize: "clamp(var(--text-2xl), 7vw, var(--text-4xl))",
                        lineHeight: "var(--lh-tight)",
                        letterSpacing: "var(--ls-tight)",
                      }}
                    >
                      {item.label}
                    </Link>
                  </React.Fragment>
                ))}
              </Container>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
