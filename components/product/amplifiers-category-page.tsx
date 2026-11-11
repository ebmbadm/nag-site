import { Container, Section, ProductRow, SpecMatrixTable, Figure } from "@/components/ds";
import type { ProductFrontmatter } from "@/lib/content/schema";
import { productRow } from "@/lib/content/catalog";
import { formatPrice } from "@/lib/format";

type AmplifiersCategoryPageProps = {
  qm400: ProductFrontmatter;
  tdSeries: ProductFrontmatter;
};

function specValue(product: ProductFrontmatter, labelPart: string) {
  return product.specGroups
    .flatMap((group) => group.rows)
    .find((row) => row.label.includes(labelPart))?.value ?? null;
}

function price(value?: number) {
  return value ? formatPrice(value) : "По запросу";
}

/** TD columns in the comparison, most powerful first. */
const TD = ["TD-100", "TD-80", "TD-40", "TD-30"];

export function AmplifiersCategoryPage({ qm400, tdSeries }: AmplifiersCategoryPageProps) {
  const model = (name: string) => tdSeries.models?.find((m) => m.name === name);
  const matrix = tdSeries.specMatrix;
  const tdValues = (labelPart: string) => {
    const row = matrix?.rows.find((r) => r.label.includes(labelPart));
    return TD.map((name) => (matrix && row ? (row.values[matrix.columns.indexOf(name)] ?? null) : null));
  };
  const pair = (a: string, b: string) => {
    const [ma, mb] = [model(a), model(b)];
    return {
      spec: `${a}: ${ma?.config} · ${b}: ${mb?.config}`,
      price: mb?.price ? `от ${formatPrice(mb.price)}` : null,
    };
  };

  return (
    <Container className="flex flex-col gap-24 pt-24 pb-24">
      <Section id="qm-400" title="QM-400" description="Четыре канала в одном шасси.">
        <ProductRow {...productRow(qm400)} />
        <Figure
          src="/products/amplifiers/qm-400-top-open.jpg"
          alt="QM-400 со снятой верхней крышкой"
          width={1680}
          height={945}
          className="mt-8 max-w-2xl"
        />
        <p className="mt-6 mb-0 max-w-2xl text-ink-2">
          QM-400 объединяет четыре автономных канала Class‑TD. Каждый канал имеет собственный блок питания:
          это снижает взаимное влияние каналов и позволяет усилителю продолжать работу даже при отключении
          одного из них.
        </p>
      </Section>

      <Section id="td" title="Серия TD" description={tdSeries.subtitle}>
        <ProductRow
          name="TD-100 / TD-80"
          href="/catalog/td-series"
          image={{
            src: "/products/amplifiers/td-100-80-panels.png",
            alt: "Передняя и задняя панели усилителя NAG TD-100",
            width: 1600,
            height: 900,
          }}
          boxed
          summary="Двухканальные версии для задач, где нужна высокая мощность в компактном корпусе 1.5U. Общий блок питания и два канала сохраняют привычную для серии TD логику работы."
          {...pair("TD-100", "TD-80")}
        />
        <ProductRow
          name="TD-40 / TD-30"
          href="/catalog/td-series"
          image={{
            src: "/products/td-series/nag-td40-front.jpg",
            alt: "Передняя панель усилителя NAG TD-40",
            width: 1400,
            height: 189,
          }}
          summary="Самые лёгкие двухканальные усилители TD-класса в 1U-дизайне. Подходят для систем, где важны компактность, надёжность и понятная интеграция."
          {...pair("TD-40", "TD-30")}
        />
      </Section>

      <Section
        id="compare"
        title="Характеристики и цены"
        description="Сравнение флагмана QM‑400 и двухканальной серии TD для подбора системы."
      >
        <SpecMatrixTable
          columns={["QM-400", ...TD]}
          rows={[
            { label: "Каналы", values: ["4 автономных", "2", "2", "2", "2"] },
            { label: "Класс", values: Array(5).fill("Class-TD") },
            { label: "Мощность на 4 Ω", values: [specValue(qm400, "4 Ω"), ...TD.map((n) => model(n)?.config ?? null)] },
            { label: "Корпус", values: [specValue(qm400, "Габариты"), ...tdValues("Размеры")] },
            { label: "Вес", values: [specValue(qm400, "Вес"), ...tdValues("Вес")] },
            { label: "Цена", values: [price(qm400.price?.amount), ...TD.map((n) => price(model(n)?.price))] },
          ]}
        />
      </Section>
    </Container>
  );
}
