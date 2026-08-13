import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Container, Eyebrow } from "@/components/ds";

const MODELS = {
  "mk120-mk60": {
    title: "RedBear MK120 / MK60", brand: "REDBEAR", front: "/history/redbear-mk120-1993-head-crop.jpg", rear: null,
    rearLabel: "Фото задней панели готовится",
  },
  "mke120-mke60": {
    title: "RedBear MKE120 / MKE60", brand: "REDBEAR", front: "/history/redbear-mke60-1994.jpg", rear: "/history/redbear-mke60-back.jpg",
  },
  "mkx50-cubcombo": {
    title: "RedBear MKX50 / CUBCOMBO", brand: "REDBEAR", front: "/history/redbear-mkx-cub-combo-1995-front.jpg", rear: "/history/redbear-mkx50-back.jpg",
  },
  "n1202-n602": {
    title: "NOVIK N1202 / N602", brand: "NOVIK", front: "/history/novik-n1202-n602-1995-front.jpg", rear: "/history/novik-n1202-back.jpg",
  },
  "n1202c-n602c": {
    title: "NOVIK N1202C / N602C", brand: "NOVIK", front: "/history/novik-n1202c-1996.jpg", rear: "/history/novik-n602c-speakers-back.jpg", rearLabel: "Задний вид и динамики",
  },
  "mk50-mk25": {
    title: "NOVIK MK50 / MK25", brand: "NOVIK", front: "/history/novik-mk50-combo-1997-1998-front.jpg", rear: "/history/novik-mk50-25-back.jpg",
  },
  "ng-1": {
    title: "NOVIK NG-1", brand: "NOVIK", front: "/history/novik-ng1-front.jpg", rear: "/history/novik-ng1-back.jpg",
  },
} as const;

type ModelSlug = keyof typeof MODELS;

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> {
  const { model } = await params;
  const item = MODELS[model as ModelSlug];
  return item ? { title: `${item.title} · NOVIK`, robots: { index: false, follow: false } } : {};
}

export default async function ModelDetailPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params;
  const item = MODELS[model as ModelSlug];
  if (!item) notFound();

  const rearAlt = item.rearLabel === "Задний вид и динамики" ? `${item.title} — задний вид и динамики` : `${item.title} — задняя панель`;

  return (
    <div className="py-6">
      <Container>
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Ламповый бутик", href: "/catalog/boutique-preview" }, { label: "Ламповые гитарные усилители", href: "/catalog/boutique-preview/guitar" }, { label: item.title }]} />
        <header className="mt-8 max-w-prose">
          <Eyebrow accent>{item.brand}</Eyebrow>
          <h1 className="mt-3 font-display uppercase text-text" style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}>{item.title}</h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>Карточка модели: фронтальный и задний вид. Подробное описание готовится без неподтверждённых характеристик.</p>
        </header>
        <section className="mt-10 grid gap-5 lg:grid-cols-2" aria-label={`Фотографии ${item.title}`}>
          <figure className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
            <div className="flex aspect-[3/2] items-center justify-center bg-surface p-4"><Image src={item.front} alt={`${item.title} — фронтальный вид`} width={960} height={640} className="h-full w-full object-contain" priority /></div>
            <figcaption className="p-5 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Фронтальный вид</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
            {item.rear ? <div className="flex aspect-[3/2] items-center justify-center bg-surface p-4"><Image src={item.rear} alt={rearAlt} width={960} height={640} className="h-full w-full object-contain" /></div> : <div className="flex aspect-[3/2] items-center justify-center bg-surface p-5 text-center font-mono text-xs uppercase tracking-[var(--ls-label)] text-text-faint">{item.rearLabel}</div>}
            <figcaption className="p-5 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">{item.rearLabel ?? "Задняя панель"}</figcaption>
          </figure>
        </section>
        <Link href="/catalog/boutique-preview/guitar" className="mt-10 inline-block font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">← Ко всем моделям</Link>
      </Container>
    </div>
  );
}
