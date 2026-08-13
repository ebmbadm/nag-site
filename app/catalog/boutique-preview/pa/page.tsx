import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumb, Container, Eyebrow } from "@/components/ds";

const MODELS = [
  { slug: "602", title: "NOVIK 602", src: "/history/novik-pa-602-1997.jpg" },
  { slug: "1202", title: "NOVIK 1202", src: "/history/novik-pa-1202-1999.jpg" },
  { slug: "202", title: "NOVIK 202", src: "/history/novik-pa-202-2000.jpg" },
  { slug: "e12", title: "NOVIK E12", src: "/history/novik-pa-e12-front.tif" },
  { slug: "e202", title: "NOVIK E202", src: "/history/novik-pa-e202-front.tif" },
  { slug: "e1202", title: "NOVIK E1202", src: null },
  { slug: "black-fire", title: "NOVIK BLACK FIRE", src: "/history/novik-black-fire-front.jpg" },
] as const;

export const metadata: Metadata = { title: "Ламповые PA-усилители · NOVIK", robots: { index: false, follow: false } };

export default function PaPreviewPage() {
  return <div className="py-6"><Container>
    <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Ламповый бутик", href: "/catalog/boutique-preview" }, { label: "Ламповые PA-усилители" }]} />
    <header className="mt-8 max-w-prose"><Eyebrow accent>NOVIK · PA</Eyebrow><h1 className="mt-3 font-display uppercase text-text" style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}>Ламповые PA-усилители</h1><p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>Модели для концертных, студийных и бытовых систем. В галерее — один фронтальный кадр на модель; остальные виды открываются в карточке.</p></header>
    <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="Модели PA-усилителей">{MODELS.map((model) => <Link key={model.slug} href={`/catalog/boutique-preview/pa/${model.slug}`} className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--focus-ring)]">{model.src ? <div className="flex aspect-[3/2] items-center justify-center bg-surface p-3"><Image src={model.src} alt={model.title} width={720} height={480} className="h-full w-full object-contain" /></div> : <div className="flex aspect-[3/2] items-center justify-center bg-surface p-5 text-center font-mono text-xs uppercase tracking-[var(--ls-label)] text-text-faint">Фронтальное фото готовится</div>}<div className="p-5"><span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-accent">NOVIK · PA</span><h2 className="mt-2 font-display text-xl uppercase text-text" style={{ letterSpacing: "var(--ls-tight)" }}>{model.title.replace("NOVIK ", "")}</h2></div></Link>)}</section>
    <Link href="/catalog/boutique-preview" className="mt-10 inline-block font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">← Вернуться в ламповый бутик</Link>
  </Container></div>;
}
