import Image from "next/image";
import { Container, Eyebrow, Surface } from "@/components/ds";
import type { ProductFrontmatter } from "@/lib/content/schema";
import { cn } from "@/lib/utils";

type ModulesProductPageProps = {
  product: ProductFrontmatter;
};

function findImage(product: ProductFrontmatter, pathPart: string) {
  return product.gallery.find((image) => image.src.includes(pathPart));
}

export function ModulesProductPage({ product }: ModulesProductPageProps) {
  const rearPanel = findImage(product, "nag-module-tds-rear-panel");
  const subwoofer = findImage(product, "nag-tds-20-installed-in-subwoofer");
  const interior = findImage(product, "nag-tds-20-interior-with-removed-pcb");
  const dimensions = findImage(product, "dimensions");

  return (
    <Surface mode="dark">
      <section className="border-b border-border py-12 lg:py-[68px]">
        <Container className="grid items-center gap-9 lg:grid-cols-2">
          <div>
            <Eyebrow accent>Встраиваемые модули NAG</Eyebrow>
            <h1 className="mt-5 font-display text-5xl uppercase leading-[0.86] tracking-[var(--ls-tighter)] sm:text-7xl lg:text-8xl">
              TDS <span className="text-accent">/</span> TDH
            </h1>
            <p className="mt-7 max-w-[470px] text-lg leading-relaxed text-text-muted">
              {product.summary}
            </p>
          </div>

          {rearPanel ? (
            <div className="relative min-h-[340px] overflow-hidden bg-surface-inset lg:min-h-[420px]">
              <Image
                src={rearPanel.src}
                alt={rearPanel.alt}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-contain p-[4%] mix-blend-multiply"
              />
              <span className="absolute bottom-4 left-4 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-inverse">
                TDS-20 · Rear panel
              </span>
            </div>
          ) : null}
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="grid gap-0 lg:grid-cols-2">
          <article className="border-x border-border p-6 lg:min-h-[390px]">
            {subwoofer ? (
              <Image
                src={subwoofer.src}
                alt={subwoofer.alt}
                width={1200}
                height={750}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-[200px] w-full object-cover"
              />
            ) : null}
            <Eyebrow accent className="mt-6">
              Практика применения
            </Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-none tracking-[var(--ls-tight)]">
              Запас, который слышно.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              За семь лет модули TDS применялись с большинством типов динамиков — как с одним,
              так и с двумя в системе. Опытные пользователи нередко выбирают TDS-20 даже для
              систем, которым формально достаточно меньшей мощности: это даёт больший запас по
              динамике на высокой громкости.
            </p>
          </article>

          <article className="border-x border-b border-border p-6 lg:min-h-[390px] lg:border-b-0">
            {interior ? (
              <Image
                src={interior.src}
                alt={interior.alt}
                width={1200}
                height={750}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="h-[200px] w-full object-cover"
              />
            ) : null}
            <Eyebrow accent className="mt-6">
              Конструкция и сервис
            </Eyebrow>
            <h2 className="mt-3 font-display text-3xl leading-none tracking-[var(--ls-tight)]">
              Рассчитан на реальную работу.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-muted">
              Качественный блок питания рассчитан на длительную работу под нагрузкой и устойчивую
              работу при нестабильных параметрах сети. Повредить динамик можно и усилителем
              меньшей мощности — поэтому важны грамотный подбор компонентов и корректная
              настройка системы.
            </p>
          </article>
        </Container>
      </section>

      {product.models && product.models.length > 0 ? (
        <section className="pb-[66px]">
          <Container className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {product.models.map((model) => {
              const isSelected = model.name === "TDS-20";

              return (
                <article
                  key={model.name}
                  className={cn(
                    "flex min-h-[158px] flex-col bg-surface p-5",
                    isSelected && "bg-accent text-on-accent",
                  )}
                >
                  <span
                    className={cn(
                      "font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted",
                      isSelected && "text-on-accent/70",
                    )}
                  >
                    {model.name.startsWith("TDS") ? "TDS series" : "TDH series"}
                    {isSelected ? " · выбор" : ""}
                  </span>
                  <h2 className="mt-5 font-display text-3xl leading-none tracking-[var(--ls-tight)]">
                    {model.name}
                  </h2>
                  <p className="mt-2 text-sm">{model.config}</p>
                  <span className="mt-auto pt-5 text-xs font-bold">
                    {model.price ? `${model.price.toLocaleString("ru-RU")} ₽` : "По запросу"}
                  </span>
                </article>
              );
            })}
          </Container>
        </section>
      ) : null}

      {product.specMatrix ? (
        <section className="pb-20">
          <Container className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-[54px]">
            <aside>
              <Eyebrow accent>Техническая карта</Eyebrow>
              <h2 className="mt-4 font-display text-3xl leading-none tracking-[var(--ls-tight)]">
                Вся серия — одним взглядом.
              </h2>
              <p className="mt-4 text-text-muted">
                Параметры для подбора модуля без длинного рекламного текста: мощность, габариты,
                подключение и общая сервисная логика.
              </p>
              <Image
                src="/products/modules/nag-module-tds-tdh-specifications-2400.png"
                alt="Сводные характеристики NAG TDS и TDH"
                width={1400}
                height={1135}
                sizes="(min-width: 1024px) 32vw, 100vw"
                className="mt-6 w-full bg-surface-2"
              />
            </aside>

            <div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-sm">
                  <caption className="mb-3 text-left font-mono text-xs font-bold uppercase tracking-[var(--ls-label)] text-accent">
                    Сравнение моделей
                  </caption>
                  <thead>
                    <tr>
                      <th className="pb-3 pr-3 text-left font-mono text-xs text-text-muted">Нагрузка</th>
                      {product.specMatrix.columns.map((column) => (
                        <th key={column} className="px-2 pb-3 text-right font-mono text-xs text-text">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {product.specMatrix.rows.map((row) => (
                      <tr key={row.label} className="border-t border-border">
                        <td className="py-4 pr-3 text-text-muted">{row.label}</td>
                        {row.values.map((value, index) => (
                          <td
                            key={`${row.label}-${index}`}
                            className={cn(
                              "px-2 py-4 text-right",
                              index >= 2 && "font-bold text-accent",
                            )}
                          >
                            {value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-7 border border-border p-5 text-sm leading-relaxed text-text-muted">
                <strong className="text-text">Подключение:</strong> XLR M/F с LINK, питание
                POWERCON и последовательное подключение AC LINK. Изображение габаритов служит
                дополнительным техническим материалом.
              </p>
              {dimensions ? (
                <Image
                  src={dimensions.src}
                  alt={dimensions.alt}
                  width={1200}
                  height={750}
                  sizes="(min-width: 1024px) 52vw, 100vw"
                  className="mt-6 w-full bg-surface-2"
                />
              ) : null}
            </div>
          </Container>
        </section>
      ) : null}
    </Surface>
  );
}
