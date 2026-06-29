import Link from "next/link";
import { Container, buttonVariants } from "@/components/ds";
import type { BoutiqueCustom } from "@/lib/content/types";

export function CustomOrderCta({ custom }: { custom: BoutiqueCustom }) {
  return (
    <section id="custom" className="scroll-mt-20 border-t border-border bg-surface-2 py-16">
      <Container>
        <div className="max-w-prose">
          <h2
            className="font-display uppercase text-text"
            style={{ fontSize: "clamp(var(--text-2xl), 4vw, var(--text-3xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}
          >
            {custom.title}
          </h2>
          {custom.body.map((p, i) => (
            <p key={i} className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
              {p}
            </p>
          ))}
          <div className="mt-6">
            <Link href={custom.cta.href} className={buttonVariants({ variant: "primary", size: "lg" })}>
              {custom.cta.label}
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
