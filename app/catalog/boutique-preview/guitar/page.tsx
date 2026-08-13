import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb, Container, Eyebrow } from "@/components/ds";

const MODELS = [
  { slug: "mk120-mk60", title: "RedBear MK120 / MK60", group: "REDBEAR", src: "/history/redbear-mk120-1993-head-crop.jpg", alt: "RedBear MK120 / MK60" },
  { slug: "mke120-mke60", title: "RedBear MKE120 / MKE60", group: "REDBEAR", src: "/history/redbear-mke60-1994.jpg", alt: "RedBear MKE120 / MKE60" },
  { slug: "mkx50-cubcombo", title: "RedBear MKX50 / CUBCOMBO", group: "REDBEAR", src: "/history/redbear-mkx-cub-combo-1995-front.jpg", alt: "RedBear MKX50 / CUBCOMBO" },
  { slug: "n1202-n602", title: "NOVIK N1202 / N602", group: "NOVIK", src: "/history/novik-n1202-n602-1995-front.jpg", alt: "NOVIK N1202 / N602" },
  { slug: "n1202c-n602c", title: "NOVIK N1202C / N602C", group: "NOVIK", src: "/history/novik-n1202c-1996.jpg", alt: "NOVIK N1202C / N602C" },
  { slug: "mk50-mk25", title: "NOVIK MK50 / MK25", group: "NOVIK", src: "/history/novik-mk50-combo-1997-1998-front.jpg", alt: "NOVIK MK50 / MK25" },
  { slug: "ng-1", title: "NOVIK NG-1", group: "NOVIK", src: "/history/novik-ng1-front.jpg", alt: "NOVIK NG-1" },
] as const;

export const metadata: Metadata = { title: "Ламповые гитарные усилители · NOVIK", robots: { index: false, follow: false } };

export default function GuitarPreviewPage() {
  return (
    <div className="py-6">
      <Container>
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Ламповый бутик", href: "/catalog/boutique-preview" }, { label: "Ламповые гитарные усилители" }]} />
        <header className="mt-8 max-w-prose">
          <Eyebrow accent>NOVIK · REDBEAR</Eyebrow>
          <h1 className="mt-3 font-display uppercase text-text" style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}>Ламповые гитарные усилители</h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>Локальная фотогалерея моделей RedBear и NOVIK. Нажатие на карточку «Ламповые гитарные усилители» в бутике ведёт сюда.</p>
        </header>

        <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Модели гитарных усилителей">
          {MODELS.map((model) => (
            <Link key={model.title} href={`/catalog/boutique-preview/guitar/${model.slug}`} className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]">
              <div className="flex aspect-[3/2] items-center justify-center bg-surface p-3">
                <Image src={model.src} alt={model.alt} width={720} height={480} className="h-full w-full object-contain" />
              </div>
              <div className="p-5"><span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-accent">{model.group}</span><h2 className="mt-2 font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>{model.title}</h2></div>
            </Link>
          ))}
        </section>
        <Link href="/catalog/boutique-preview" className="mt-10 inline-block font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">← Вернуться в ламповый бутик</Link>
      </Container>
    </div>
  );
}
