import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Phone, Download } from "lucide-react";
import {
  AccordionItem,
  Breadcrumb,
  Button,
  Checkbox,
  Container,
  DownloadList,
  Field,
  Figure,
  FormStatus,
  Icon,
  Input,
  Notice,
  PageHeader,
  ProductRow,
  Prose,
  Section,
  Segmented,
  Select,
  SpecGroups,
  SpecMatrixTable,
  SpecTable,
  Status,
  Switch,
  Tabs,
  Tag,
  Textarea,
  Theme,
} from "@/components/ds";
import { getProduct } from "@/lib/content/products";
import { productRow } from "@/lib/content/catalog";

export const metadata: Metadata = {
  title: "Дизайн-система",
  robots: { index: false, follow: false },
};

/** Colour roles. Class strings are literal so Tailwind sees them. */
const COLOURS = [
  { name: "bg", cls: "bg-bg", use: "Фон страницы" },
  { name: "surface", cls: "bg-surface", use: "Подложка группы, выбранная строка" },
  { name: "surface-raised", cls: "bg-surface-raised", use: "Выбранный элемент поверх surface" },
  { name: "photo", cls: "bg-photo", use: "Под фото техники" },
  { name: "line", cls: "bg-line", use: "Разделитель строк" },
  { name: "line-strong", cls: "bg-line-strong", use: "Линия над разделом" },
  { name: "line-control", cls: "bg-line-control", use: "Граница поля и контурной кнопки" },
  { name: "ink", cls: "bg-ink", use: "Текст" },
  { name: "ink-2", cls: "bg-ink-2", use: "Вторичный текст" },
  { name: "ink-3", cls: "bg-ink-3", use: "Подписи, выключенное" },
  { name: "accent", cls: "bg-accent", use: "Одна главная кнопка на экран" },
  { name: "accent-hover", cls: "bg-accent-hover", use: "Наведение на главную кнопку" },
  { name: "on-accent", cls: "bg-on-accent", use: "Текст на accent" },
  { name: "danger", cls: "bg-danger", use: "Ошибка, тревога" },
  { name: "danger-soft", cls: "bg-danger-soft", use: "Подложка ошибки" },
  { name: "warn", cls: "bg-warn", use: "Внимание" },
  { name: "warn-soft", cls: "bg-warn-soft", use: "Подложка предупреждения" },
  { name: "ok", cls: "bg-ok", use: "Норма" },
  { name: "novik", cls: "bg-novik", use: "Только слово NOVIK" },
  { name: "focus", cls: "bg-focus", use: "Кольцо фокуса" },
];

const TYPE = [
  { name: "site-display", cls: "text-site-display", px: "44 / 49" },
  { name: "site-section", cls: "text-site-section", px: "28 / 34" },
  { name: "site-title", cls: "text-site-title", px: "20 / 26" },
  { name: "site-lead", cls: "text-site-lead", px: "19 / 29" },
  { name: "site-body", cls: "text-site-body", px: "17 / 27" },
  { name: "site-small", cls: "text-site-small", px: "15 / 22" },
  { name: "site-caption", cls: "text-site-caption", px: "13 / 18" },
];

const SPACING = [
  { step: "1", px: 4, cls: "w-1" },
  { step: "2", px: 8, cls: "w-2" },
  { step: "3", px: 12, cls: "w-3" },
  { step: "4", px: 16, cls: "w-4" },
  { step: "6", px: 24, cls: "w-6" },
  { step: "8", px: 32, cls: "w-8" },
  { step: "12", px: 48, cls: "w-12" },
  { step: "16", px: 64, cls: "w-16" },
  { step: "24", px: 96, cls: "w-24" },
  { step: "32", px: 128, cls: "w-32" },
];

const RADII = [
  { name: "rounded-sm", px: 4, cls: "rounded-sm", use: "Поля, метки" },
  { name: "rounded-md", px: 6, cls: "rounded-md", use: "Кнопки" },
  { name: "rounded-lg", px: 8, cls: "rounded-lg", use: "Редкие контейнеры" },
];

const SEGMENTS = [
  { value: "4", label: "4 Ом" },
  { value: "8", label: "8 Ом" },
  { value: "bridge", label: "Мост" },
];

const DOWNLOADS = [
  { label: "Руководство пользователя QM-400", href: "/_ds#downloads", ext: "PDF", size: "2,1 МБ" },
  { label: "Программа управления D-8000", href: "/_ds#downloads-zip", ext: "ZIP", size: "14 МБ" },
  { label: "Страница производителя драйвера", href: "https://example.com" },
];

function Controls({ idPrefix }: { idPrefix: string }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary">Запросить счёт</Button>
        <Button variant="secondary">Скачать PDF</Button>
        <Button variant="quiet">Сравнить</Button>
        <Button variant="link">Все усилители</Button>
        <Button variant="secondary" disabled>
          Недоступно
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Tag>4 канала</Tag>
        <Tag>XLR</Tag>
        <Status tone="ok">Норма</Status>
        <Status tone="warn">Внимание</Status>
        <Status tone="danger">Перегрузка</Status>
        <Status tone="off">Выключен</Status>
      </div>
      <Tabs
        items={[
          { label: "Характеристики", href: "#specs", current: true },
          { label: "Фото", href: "#photo" },
          { label: "Документы", href: "#docs" },
        ]}
      />
      <div className="grid max-w-2xl gap-6 sm:grid-cols-2">
        <Field label="Имя" htmlFor={`${idPrefix}-name`} help="Как к вам обращаться">
          <Input id={`${idPrefix}-name`} name="name" placeholder="Ваше имя" />
        </Field>
        <Field
          label="E-mail"
          htmlFor={`${idPrefix}-mail`}
          error="В адресе нет символа @. Проверьте и введите ещё раз"
        >
          <Input id={`${idPrefix}-mail`} name="mail" error placeholder="mail@example.com" />
        </Field>
        <Select
          id={`${idPrefix}-model`}
          label="Модель"
          options={["QM-400", "TD-1000", "D-8000"]}
          help="Можно выбрать позже"
        />
        <Segmented label="Нагрузка" options={SEGMENTS} defaultValue="4" />
      </div>
      <div className="flex flex-wrap items-center gap-8">
        <Checkbox label="Нужен счёт на юрлицо" defaultChecked />
        <Checkbox label="Без НДС" />
        <Switch label="Без звука" />
        <Switch label="Мост" defaultChecked />
      </div>
      <Notice title="Срок поставки">Подтверждаем в спецификации к договору.</Notice>
    </div>
  );
}

export default function DsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const qm = productRow(getProduct("qm-400").frontmatter);

  return (
    <>
      <Container className="pt-6">
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "Дизайн-система" }]} />
      </Container>
      <Container className="pt-12">
        <PageHeader
          title="Дизайн-система сайта"
          lead="Токены и все компоненты из components/ds в их состояниях. Только для разработки, страница не индексируется."
        />
      </Container>

      <Container className="flex flex-col gap-24 pt-20">
        <Section title="Цвет" description="Роли, а не значения. В тёмной теме роли те же — меняются значения.">
          <ul className="m-0 grid list-none gap-x-8 p-0 sm:grid-cols-2">
            {COLOURS.map((c) => (
              <li key={c.name} className="flex items-center gap-4 border-t border-line py-3">
                <span className={`size-10 shrink-0 rounded-sm border border-line ${c.cls}`} />
                <span className="min-w-0">
                  <span className="block font-medium">{c.name}</span>
                  <span className="block text-site-small text-ink-2">{c.use}</span>
                </span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Шрифт" description="Golos Text, 400 · 500 · 600. Цифры табличные.">
          {TYPE.map((t) => (
            <div key={t.name} className="flex flex-wrap items-baseline gap-x-8 gap-y-1 border-t border-line py-4 last:border-b">
              <span className="w-32 shrink-0 text-site-caption text-ink-3">
                {t.name} · {t.px}
              </span>
              <span className={`min-w-0 flex-1 ${t.cls}`}>Усилитель мощности 4 × 2400 Вт</span>
            </div>
          ))}
        </Section>

        <Section title="Отступы" description="Шаг 4 px, числовая шкала Tailwind. Между разделами — 24 (96 px).">
          {SPACING.map((s) => (
            <div key={s.step} className="flex items-center gap-6 border-t border-line py-2 last:border-b">
              <span className="w-24 shrink-0 text-site-small text-ink-2">
                {s.step} · {s.px} px
              </span>
              <span className={`h-4 bg-ink ${s.cls}`} />
            </div>
          ))}
        </Section>

        <Section title="Скругления" description="Фото не скругляются. Тень одна — у активного сегмента.">
          <div className="flex flex-wrap gap-8">
            {RADII.map((r) => (
              <div key={r.name} className="flex flex-col gap-2">
                <span className={`size-20 border border-line-control bg-surface ${r.cls}`} />
                <span className="text-site-small">
                  {r.name} · {r.px} px
                </span>
                <span className="text-site-caption text-ink-3">{r.use}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Кнопки" description="primary — одна на экран. Размеры lg · md · sm.">
          <div className="flex flex-col gap-6">
            {(["lg", "md", "sm"] as const).map((size) => (
              <div key={size} className="flex flex-wrap items-center gap-3">
                <Button variant="primary" size={size}>
                  Запросить счёт
                </Button>
                <Button variant="secondary" size={size}>
                  <Icon as={Download} size={size === "sm" ? 16 : 20} />
                  Скачать PDF
                </Button>
                <Button variant="quiet" size={size}>
                  Сравнить
                </Button>
                <Button variant="link" size={size}>
                  Все модели
                </Button>
                <Button variant="primary" size={size} disabled>
                  Недоступно
                </Button>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Метки, статусы, сообщения">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-center gap-3">
              <Tag>TDS-20</Tag>
              <Tag>2 канала</Tag>
              <Tag>Speakon</Tag>
              <span className="inline-flex items-center gap-2">
                <Icon as={Phone} /> Иконка рядом со словом
              </span>
              <Icon as={Phone} label="Позвонить" />
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Status tone="ok">Норма</Status>
              <Status tone="warn">Внимание</Status>
              <Status tone="danger">Ошибка</Status>
              <Status tone="off">Выключен</Status>
            </div>
            <Notice title="Сведения">Цена указана без НДС.</Notice>
            <Notice tone="warn" title="Проверьте нагрузку">
              Минимальный импеданс — 2 Ом на канал.
            </Notice>
            <Notice tone="error" title="Нет связи с процессором">
              Проверьте, что компьютер в той же сети Wi-Fi.
            </Notice>
            <FormStatus state={{ ok: true }} />
            <FormStatus state={{ ok: false, error: "Проверьте заполненные поля." }} />
          </div>
        </Section>

        <Section title="Навигация" description="Breadcrumb и Tabs — ссылки по странице.">
          <div className="flex flex-col gap-8">
            <Breadcrumb
              items={[
                { label: "Главная", href: "/" },
                { label: "Каталог", href: "/catalog" },
                { label: "QM-400" },
              ]}
            />
            <Tabs
              items={[
                { label: "Характеристики", href: "#specs", current: true },
                { label: "Фото", href: "#photo" },
                { label: "Документы", href: "#docs" },
                { label: "Другие модели", href: "#more" },
              ]}
            />
          </div>
        </Section>

        <Section title="Характеристики" description="SpecTable, SpecGroups, SpecMatrixTable.">
          <div className="flex flex-col gap-12">
            <SpecTable
              compact
              caption="Компактная, для блока заказа"
              rows={[
                { label: "Каналы", value: "4" },
                { label: "Высота", value: "2U" },
                { label: "Масса", value: "17,3 кг" },
              ]}
            />
            <SpecGroups
              groups={[
                {
                  title: "Вход",
                  rows: [
                    { label: "Разъёмы", value: "4 × XLR" },
                    { label: "Чувствительность", value: "1,4 В" },
                  ],
                },
                {
                  title: "Выход",
                  rows: [
                    { label: "Диапазон частот", value: "20 Гц – 20 кГц" },
                    { label: "Отношение сигнал/шум", value: "−105 дБ" },
                  ],
                },
              ]}
            />
            <SpecMatrixTable
              caption="Сравнение моделей"
              columns={["Модель A", "Модель B", "Модель C"]}
              rows={[
                { label: "Каналы", values: ["2", "2", "4"] },
                { label: "Высота", values: ["1U", "2U", null] },
              ]}
            />
          </div>
        </Section>

        <Section title="Строка каталога" description="ProductRow: фото, название, суть, цена.">
          <ProductRow {...qm} />
          <ProductRow name="Модель без фото" href="/catalog" summary="Ламповый усилитель" price={null} />
        </Section>

        <Section title="Фото" description="Figure: на белом, без рамки. Клик открывает Lightbox.">
          <Figure
            src="/products/d-8000/nag-d8000-front-panel.jpg"
            alt="Лицевая панель D-8000"
            caption="Подпись к фото — site-caption, ink-3"
            width={1200}
            height={300}
          />
        </Section>

        <Section title="Текст" description="Prose для тела MDX и AccordionItem.">
          <div className="flex flex-col gap-12">
            <Prose>
              <h2>Заголовок второго уровня</h2>
              <p>
                Абзац с <strong>полужирным</strong> и <a href="#">ссылкой</a>. Строка — 45–75 знаков.
              </p>
              <ul>
                <li>Первый пункт списка</li>
                <li>Второй пункт</li>
              </ul>
              <blockquote>Цитата из документации.</blockquote>
            </Prose>
            <div className="max-w-2xl">
              <AccordionItem summary="Открытый раздел" defaultOpen>
                Содержимое открытого раздела.
              </AccordionItem>
              <AccordionItem summary="Закрытый раздел">Содержимое закрытого раздела.</AccordionItem>
            </div>
          </div>
        </Section>

        <Section id="downloads" title="Документы" description="DownloadList: имя слева, формат и размер справа.">
          <DownloadList links={DOWNLOADS} />
        </Section>

        <Section title="Формы" description="Подпись над полем, подсказка под ним, ошибка вместо подсказки.">
          <div className="flex max-w-xl flex-col gap-6">
            <Field label="Имя" htmlFor="ds-name" help="Как к вам обращаться">
              <Input id="ds-name" name="name" placeholder="Ваше имя" />
            </Field>
            <Field label="Телефон или e-mail" htmlFor="ds-contact" error="Укажите телефон или e-mail">
              <Input id="ds-contact" name="contact" error />
            </Field>
            <Field label="Сообщение" htmlFor="ds-message">
              <Textarea id="ds-message" name="message" placeholder="Чем можем помочь?" />
            </Field>
            <Select id="ds-model" label="Модель" options={["QM-400", "TD-1000", "D-8000"]} />
            <Select id="ds-off" label="Недоступное поле" options={["—"]} disabled />
            <Checkbox label="Нужен счёт на юрлицо" defaultChecked />
            <Checkbox label="Недоступно" disabled />
            <Switch label="Без звука" />
            <Switch label="Включено" defaultChecked />
            <Segmented label="Нагрузка" options={SEGMENTS} defaultValue="8" />
          </div>
        </Section>
      </Container>

      <Theme dark className="mt-32">
        <Container className="py-20">
          <Section title="Тёмная вставка" description="Theme dark: роли те же, значения другие.">
            <Controls idPrefix="dark" />
          </Section>
        </Container>
      </Theme>
    </>
  );
}
