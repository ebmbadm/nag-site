import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb, Container, Eyebrow } from "@/components/ds";

const MODELS = {
  "602": { title: "NOVIK 602", front: "/history/novik-pa-602-1997.jpg", second: "/history/novik-pa-602-1202-inside.jpg" },
  "1202": { title: "NOVIK 1202", front: "/history/novik-pa-1202-1999.jpg", second: "/history/novik-pa-602-1202-inside.jpg" },
  "202": { title: "NOVIK 202", front: "/history/novik-pa-202-2000.jpg", second: "/history/novik-pa-202-back.jpg", secondLabel: "Задняя панель" },
  "e12": { title: "NOVIK E12", front: "/history/novik-pa-e12-front.tif", second: "/history/novik-pa-e12-inside.jpg" },
  "e202": { title: "NOVIK E202", front: "/history/novik-pa-e202-front.tif", second: null },
  "e1202": { title: "NOVIK E1202", front: null, second: null },
  "black-fire": { title: "NOVIK BLACK FIRE", front: "/history/novik-black-fire-front.jpg", second: "/history/novik-black-fire-inside.jpg", secondLabel: "Внутренний вид" },
} as const;
type ModelSlug = keyof typeof MODELS;

export async function generateMetadata({ params }: { params: Promise<{ model: string }> }): Promise<Metadata> { const { model } = await params; const item = MODELS[model as ModelSlug]; return item ? { title: `${item.title} · NOVIK`, robots: { index: false, follow: false } } : {}; }

export default async function PaModelDetailPage({ params }: { params: Promise<{ model: string }> }) {
  const { model } = await params; const item = MODELS[model as ModelSlug]; if (!item) notFound();
  return <div className="py-6"><Container><Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Ламповый бутик", href: "/catalog/boutique-preview" }, { label: "PA-усилители", href: "/catalog/boutique-preview/pa" }, { label: item.title }]} />
    <header className="mt-8 max-w-prose"><Eyebrow accent>NOVIK · PA</Eyebrow><h1 className="mt-3 font-display uppercase text-text" style={{ fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))", lineHeight: "var(--lh-tight)", letterSpacing: "var(--ls-tight)" }}>{item.title}</h1><p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>Карточка модели. Описание готовится без неподтверждённых характеристик.</p></header>
    <section className="mt-10 grid gap-5 lg:grid-cols-2" aria-label={`Фотографии ${item.title}`}><Photo src={item.front} alt={`${item.title} — фронтальный вид`} label="Фронтальный вид" /><Photo src={item.second} alt={`${item.title} — второй вид`} label={item.secondLabel ?? "Второй вид"} /></section>
    <Link href="/catalog/boutique-preview/pa" className="mt-10 inline-block font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">← Ко всем PA-моделям</Link>
  </Container></div>;
}

function Photo({ src, alt, label }: { src: string | null; alt: string; label: string }) { return <figure className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">{src ? <div className="flex aspect-[3/2] items-center justify-center bg-surface p-4"><Image src={src} alt={alt} width={960} height={640} className="h-full w-full object-contain" priority={label === "Фронтальный вид"} /></div> : <div className="flex aspect-[3/2] items-center justify-center bg-surface p-5 text-center font-mono text-xs uppercase tracking-[var(--ls-label)] text-text-faint">Фото готовится</div>}<figcaption className="p-5 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">{label}</figcaption></figure>; }
