import Image from "next/image";
import { Container, Eyebrow, Surface } from "@/components/ds";
import type { ProductFrontmatter } from "@/lib/content/schema";

type AmplifiersCategoryPageProps = {
  qm400: ProductFrontmatter;
  tdSeries: ProductFrontmatter;
};

function specValue(product: ProductFrontmatter, labelPart: string) {
  return product.specGroups
    .flatMap((group) => group.rows)
    .find((row) => row.label.includes(labelPart))?.value;
}

function tdModel(product: ProductFrontmatter, name: string) {
  return product.models?.find((model) => model.name === name);
}

function price(value?: number) {
  return value ? `${value.toLocaleString("ru-RU")} ₽` : "По запросу";
}

export function AmplifiersCategoryPage({ qm400, tdSeries }: AmplifiersCategoryPageProps) {
  const qmFront = qm400.gallery[0];
  const td100 = tdModel(tdSeries, "TD-100");
  const td80 = tdModel(tdSeries, "TD-80");
  const td40 = tdModel(tdSeries, "TD-40");
  const td30 = tdModel(tdSeries, "TD-30");
  const tdMatrix = tdSeries.specMatrix;
  const tdRow = (labelPart: string) => tdMatrix?.rows.find((row) => row.label.includes(labelPart))?.values;
  const tdSizes = tdRow("Размеры");
  const tdWeights = tdRow("Вес");

  return (
    <Surface mode="dark">
      <section className="border-b border-border py-12 lg:py-20">
        <Container className="enter-stagger grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <Eyebrow accent>Флагман серии</Eyebrow>
            <h1 className="mt-5 font-display text-6xl uppercase leading-[0.82] tracking-[var(--ls-tighter)] sm:text-7xl lg:text-8xl">
              QM-400
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-text-muted">{qm400.summary}</p>
            <div className="mt-7 flex flex-wrap gap-2">
              {qm400.specChips.slice(0, 4).map((chip) => (
                <span key={chip} className="border border-border px-3 py-2 font-mono text-xs text-text-muted">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="relative min-h-[340px] bg-photo-backdrop lg:min-h-[410px]">
            <Image src={qmFront.src} alt={qmFront.alt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain p-8 mix-blend-multiply" />
            <span className="absolute bottom-4 left-4 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-ink">QM-400 · front panel</span>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="reveal-stagger grid lg:grid-cols-[1.1fr_0.9fr]">
          <Image src="/products/amplifiers/qm-400-top-open.jpg" alt="QM-400 со снятой верхней крышкой" width={1680} height={945} sizes="(min-width: 1024px) 55vw, 100vw" className="h-auto w-full bg-photo-backdrop object-contain" />
          <div className="flex flex-col justify-center border-x border-border p-8 lg:p-12">
            <Eyebrow accent>Конструкция</Eyebrow>
            <h2 className="mt-4 font-display text-4xl uppercase leading-[0.9] tracking-[var(--ls-tight)]">Четыре канала в одном шасси.</h2>
            <p className="mt-5 leading-relaxed text-text-muted">QM-400 объединяет четыре автономных канала Class‑TD. Каждый канал имеет собственный блок питания: это снижает взаимное влияние каналов и позволяет усилителю продолжать работу даже при отключении одного из них.</p>
          </div>
        </Container>
      </section>

      <section className="py-16">
        <Container className="reveal-fade-stagger grid gap-px bg-border lg:grid-cols-2">
          <article className="bg-surface p-6 lg:p-8">
            <div className="bg-photo-backdrop"><Image src="/products/amplifiers/td-100-80-panels.png" alt="Передняя и задняя панели усилителя NAG TD-100" width={1600} height={900} sizes="(min-width: 1024px) 50vw, 100vw" className="h-[240px] w-full object-contain mix-blend-multiply" /></div>
            <h2 className="mt-7 font-display text-4xl tracking-[var(--ls-tight)]">TD-100 / TD-80</h2>
            <p className="mt-4 leading-relaxed text-text-muted">Двухканальные версии для задач, где нужна высокая мощность в компактном корпусе 1.5U. Общий блок питания и два канала сохраняют привычную для серии TD логику работы.</p>
            <span className="mt-6 block font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Серия TD · старшая</span>
          </article>
          <article className="bg-surface p-6 lg:p-8">
            <div className="grid gap-3 bg-photo-backdrop p-3">
              <Image src="/products/td-series/nag-td40-front-panel.jpg" alt="Передняя панель усилителя NAG TD-40" width={1400} height={187} sizes="(min-width: 1024px) 50vw, 100vw" className="h-[90px] w-full object-contain mix-blend-multiply" />
              <Image src="/products/td-series/nag-td40-front-rear-panels.png" alt="Передняя и задняя панели усилителя NAG TD-40" width={1680} height={841} sizes="(min-width: 1024px) 50vw, 100vw" className="h-[145px] w-full object-contain mix-blend-multiply" />
            </div>
            <h2 className="mt-7 font-display text-4xl tracking-[var(--ls-tight)]">TD-40 / TD-30</h2>
            <p className="mt-4 leading-relaxed text-text-muted">Самые лёгкие двухканальные усилители TD-класса в 1U-дизайне. Подходят для систем, где важны компактность, надёжность и понятная интеграция.</p>
            <span className="mt-6 block font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent">Серия TD · 1U</span>
          </article>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="reveal mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Eyebrow accent>Техническая карта</Eyebrow>
              <h2 className="mt-4 font-display text-4xl uppercase leading-[0.9] tracking-[var(--ls-tight)]">Характеристики и цены</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-text-muted">Сравнение флагмана QM‑400 и двухканальной серии TD для подбора системы.</p>
          </div>
          <div className="reveal overflow-x-auto border border-border">
            <table aria-label="Характеристики и цены" className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead><tr className="border-b border-border"><th className="p-4 text-text-muted">Модель</th><th className="bg-accent-wash p-4">QM-400</th><th className="p-4">TD-100 / TD-80</th><th className="p-4">TD-40 / TD-30</th></tr></thead>
              <tbody>
                <tr className="border-b border-border"><td className="p-4 text-text-muted">Каналы</td><td className="bg-accent-wash p-4">4 автономных</td><td className="p-4">2</td><td className="p-4">2</td></tr>
                <tr className="border-b border-border"><td className="p-4 text-text-muted">Класс</td><td className="bg-accent-wash p-4">Class-TD</td><td className="p-4">Class-TD</td><td className="p-4">Class-TD</td></tr>
                <tr className="border-b border-border"><td className="p-4 text-text-muted">Мощность на 4 Ω</td><td className="bg-accent-wash p-4">{specValue(qm400, "4 Ω")}</td><td className="p-4">TD-100: {td100?.config}<br />TD-80: {td80?.config}</td><td className="p-4">TD-40: {td40?.config}<br />TD-30: {td30?.config}</td></tr>
                <tr className="border-b border-border"><td className="p-4 text-text-muted">Корпус</td><td className="bg-accent-wash p-4">{specValue(qm400, "Габариты")}</td><td className="p-4">{tdSizes?.[3]}</td><td className="p-4">{tdSizes?.[1]}</td></tr>
                <tr className="border-b border-border"><td className="p-4 text-text-muted">Вес</td><td className="bg-accent-wash p-4">{specValue(qm400, "Вес")}</td><td className="p-4">TD-100: {tdWeights?.[3]}<br />TD-80: {tdWeights?.[2]}</td><td className="p-4">{tdWeights?.[1]}</td></tr>
                <tr><td className="p-4 text-text-muted">Цена</td><td className="bg-accent-wash p-4 font-bold">{price(qm400.price?.amount)}</td><td className="p-4 font-bold">TD-100: {price(td100?.price)}<br />TD-80: {price(td80?.price)}</td><td className="p-4 font-bold">TD-40: {price(td40?.price)}<br />TD-30: {price(td30?.price)}</td></tr>
              </tbody>
            </table>
          </div>
        </Container>
      </section>
    </Surface>
  );
}
