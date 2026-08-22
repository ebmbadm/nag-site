import Image from "next/image";
import { Container, Eyebrow, Surface } from "@/components/ds";
import type { ProductFrontmatter } from "@/lib/content/schema";

type Qm400ProductPageProps = {
  product: ProductFrontmatter;
};

function specValue(product: ProductFrontmatter, labelPart: string) {
  return product.specGroups
    .flatMap((group) => group.rows)
    .find((row) => row.label.includes(labelPart))?.value;
}

/** QM-400 keeps its own product URL but shares the visual language of the amp category. */
export function Qm400ProductPage({ product }: Qm400ProductPageProps) {
  const frontPanel = product.gallery[0];
  const power = specValue(product, "Мощность 4 Ω") ?? "4 × 2400 Вт";

  return (
    <Surface mode="dark">
      <section className="border-b border-border py-12 lg:py-20">
        <Container className="enter-stagger grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <Eyebrow accent>Флагман серии</Eyebrow>
            <h1 className="mt-5 font-display text-6xl uppercase leading-[0.82] tracking-[var(--ls-tighter)] sm:text-7xl lg:text-8xl">
              QM-400
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-muted">{product.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.specChips.slice(0, 4).map((chip) => (
                <span key={chip} className="border border-border px-3 py-2 font-mono text-xs text-text-muted">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-[340px] bg-photo-backdrop lg:min-h-[410px]">
            <Image
              src={frontPanel.src}
              alt={frontPanel.alt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-contain p-8 mix-blend-multiply"
            />
            <span className="absolute bottom-4 left-4 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-ink">
              QM-400 · Front panel
            </span>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="reveal-stagger grid lg:grid-cols-[1.1fr_0.9fr]">
          <Image
            src="/products/amplifiers/qm-400-top-open.jpg"
            alt="QM-400 со снятой верхней крышкой"
            width={1680}
            height={945}
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="h-auto w-full bg-photo-backdrop object-contain"
          />
          <div className="flex flex-col justify-center border-x border-border p-8 lg:p-12">
            <Eyebrow accent>Конструкция</Eyebrow>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[0.9] tracking-[var(--ls-tight)]">
              Четыре канала в одном шасси.
            </h2>
            <p className="mt-5 leading-relaxed text-text-muted">
              Каждый из четырёх каналов работает как самостоятельный усилительный тракт со
              своим блоком питания. Такая архитектура уменьшает взаимное влияние каналов и
              сохраняет работу остальных при неисправности одного.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-12 lg:py-16">
        <Container className="reveal-fade-stagger grid gap-px bg-border sm:grid-cols-3">
          <div className="bg-surface p-6">
            <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">Мощность на 4 Ω</span>
            <p className="mt-4 font-display text-4xl leading-none tracking-[var(--ls-tight)] text-accent">{power}</p>
          </div>
          <div className="bg-surface p-6">
            <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">Класс</span>
            <p className="mt-4 font-display text-4xl leading-none tracking-[var(--ls-tight)]">Class-TD</p>
          </div>
          <div className="bg-surface p-6">
            <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">Демпинг-фактор</span>
            <p className="mt-4 font-display text-4xl leading-none tracking-[var(--ls-tight)]">950</p>
          </div>
        </Container>
      </section>
    </Surface>
  );
}
