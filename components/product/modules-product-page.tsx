import {
  Chip,
  Container,
  Divider,
  Eyebrow,
  Figure,
  Rule,
  SpecMatrixTable,
} from "@/components/ds";
import type { ProductFrontmatter } from "@/lib/content/schema";
import { formatPrice } from "@/lib/format";

type ModulesProductPageProps = {
  product: ProductFrontmatter;
};

function findImage(product: ProductFrontmatter, pathPart: string) {
  return product.gallery?.find((image) => image.src.includes(pathPart));
}

export function ModulesProductPage({ product }: ModulesProductPageProps) {
  const rearPanel = findImage(product, "nag-module-tds-rear-panel");
  const subwoofer = findImage(product, "nag-tds-20-installed-in-subwoofer");
  const interior = findImage(product, "nag-tds-20-interior-with-removed-pcb");

  return (
    <>
      <section className="border-b border-border bg-bg py-12 lg:py-20">
        <Container className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16">
          <div>
            <Eyebrow>{product.badges.join(" · ")}</Eyebrow>
            <h1 className="mt-4 font-display text-5xl tracking-tight text-ink sm:text-6xl lg:text-7xl">
              NAG TDS / TDH
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              {product.summary}
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              {product.specChips.map((chip) => (
                <Chip key={chip}>{chip}</Chip>
              ))}
            </div>
          </div>

          {rearPanel ? (
            <Figure
              src={rearPanel.src}
              alt={rearPanel.alt}
              caption={rearPanel.caption}
              className="bg-surface-muted"
              imgClassName="aspect-[4/3] object-cover"
            />
          ) : null}
        </Container>
      </section>

      <section className="py-12 lg:py-20">
        <Container className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <article>
            {subwoofer ? (
              <Figure
                src={subwoofer.src}
                alt={subwoofer.alt}
                caption={subwoofer.caption}
                className="bg-surface-muted"
                imgClassName="aspect-[4/3] object-cover"
              />
            ) : null}
            <Eyebrow className="mt-6">Практика</Eyebrow>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Запас, который слышно.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
              Модуль уверенно работает с одним или двумя динамиками. Дополнительный Speakon
              позволяет использовать один канал независимо, когда этого требует система.
            </p>
          </article>

          <article>
            {interior ? (
              <Figure
                src={interior.src}
                alt={interior.alt}
                caption={interior.caption}
                className="bg-surface-muted"
                imgClassName="aspect-[4/3] object-cover"
              />
            ) : null}
            <Eyebrow className="mt-6">Надёжность</Eyebrow>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              Рассчитан на реальную работу.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-ink-muted">
              Качественный блок питания сохраняет устойчивость в непредсказуемой сети. Такой
              запас ценят и в прокатных системах, и в мощных домашних инсталляциях.
            </p>
          </article>
        </Container>
      </section>

      {product.models && product.models.length > 0 ? (
        <section className="border-y border-border bg-surface-muted py-12 lg:py-20">
          <Container>
            <Eyebrow>Конфигурации</Eyebrow>
            <h2 className="mt-3 max-w-3xl font-display text-4xl tracking-tight text-ink sm:text-5xl">
              Выберите модуль под свою систему
            </h2>
            <div className="mt-10 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-2">
              {product.models.map((model) => (
                <article key={model.name} className="bg-bg p-6 sm:p-8">
                  <p className="font-display text-3xl tracking-tight text-ink">{model.name}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-muted">{model.config}</p>
                  <Divider className="my-6" />
                  <p className="text-sm text-ink-muted">Цена</p>
                  <p className="mt-1 font-display text-2xl tracking-tight text-ink">
                    {model.price ? formatPrice(model.price) : "По запросу"}
                  </p>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {product.specMatrix ? (
        <section className="bg-ink py-12 text-white lg:py-20">
          <Container>
            <Eyebrow className="text-white/60">Технические характеристики</Eyebrow>
            <h2 className="mt-3 font-display text-4xl tracking-tight sm:text-5xl">
              Всё важное — в одной таблице
            </h2>
            <Rule className="my-8 border-white/20" />
            <SpecMatrixTable
              columns={product.specMatrix.columns}
              rows={product.specMatrix.rows}
              caption={product.specMatrix.caption}
            />
          </Container>
        </section>
      ) : null}
    </>
  );
}
