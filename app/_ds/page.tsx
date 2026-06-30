import { notFound } from "next/navigation";
import {
  Container,
  Eyebrow,
  Badge,
  Chip,
  Divider,
  Rule,
  Surface,
  Button,
  Breadcrumb,
  Prose,
  SpecTable,
  SpecMatrixTable,
  ProductCard,
  AccordionItem,
} from "@/components/ds";
import { TabsDemo } from "./_tabs-demo";
import { PillDemo } from "./_pill-demo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DsPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <div className="py-10">
      <Container>
        <h1
          className="mb-2 font-display uppercase text-text"
          style={{ fontSize: "var(--text-4xl)", letterSpacing: "var(--ls-tight)" }}
        >
          DS Reference
        </h1>
        <p className="mb-12 font-mono text-xs text-text-faint">dev only · не индексируется</p>

        {/* ── PALETTE ── */}
        <Section title="Palette">
          <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
            {(
              [
                ["bg", "bg-bg"],
                ["surface", "bg-surface"],
                ["surface-2", "bg-surface-2"],
                ["border", "bg-border"],
                ["text", "bg-text"],
                ["text-muted", "bg-text-muted"],
                ["accent", "bg-accent"],
                ["accent-wash", "bg-accent-wash"],
              ] as const
            ).map(([name, cls]) => (
              <div key={name}>
                <div className={`h-10 rounded-[var(--radius-sm)] border border-border ${cls}`} />
                <p className="mt-1 font-mono text-2xs text-text-faint">{name}</p>
              </div>
            ))}
          </div>
          <Surface mode="dark" className="mt-4 rounded-[var(--radius-lg)] p-4">
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
              {(
                [
                  ["bg", "bg-bg"],
                  ["surface", "bg-surface"],
                  ["surface-2", "bg-surface-2"],
                  ["border", "bg-border"],
                  ["text", "bg-text"],
                  ["text-muted", "bg-text-muted"],
                  ["accent", "bg-accent"],
                  ["accent-wash", "bg-accent-wash"],
                ] as const
              ).map(([name, cls]) => (
                <div key={name}>
                  <div className={`h-10 rounded-[var(--radius-sm)] border border-border ${cls}`} />
                  <p className="mt-1 font-mono text-2xs text-text-faint">{name}</p>
                </div>
              ))}
            </div>
          </Surface>
        </Section>

        {/* ── TYPOGRAPHY ── */}
        <Section title="Typography">
          {(["2xs", "xs", "sm", "base", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const).map(
            (size) => (
              <div key={size} className="flex items-baseline gap-4 border-b border-border py-2">
                <span className="w-10 font-mono text-2xs text-text-faint">{size}</span>
                <span className={`font-text text-${size} text-text`}>
                  Качество звука NAG · NOVIK
                </span>
              </div>
            ),
          )}
          <div className="mt-6 space-y-2">
            <p
              className="font-display uppercase text-text"
              style={{ fontSize: "var(--text-2xl)", letterSpacing: "var(--ls-tight)" }}
            >
              Display — Oswald
            </p>
            <p className="font-text text-base text-text">Body — Golos Text</p>
            <p
              className="font-mono text-sm text-text"
              style={{ letterSpacing: "var(--ls-mono)" }}
            >
              Mono — JetBrains Mono
            </p>
            <Eyebrow>Eyebrow label</Eyebrow>
          </div>
        </Section>

        {/* ── BUTTONS ── */}
        <Section title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
            <Button variant="primary" disabled>
              Disabled
            </Button>
          </div>
          <Surface mode="dark" className="mt-4 rounded-[var(--radius-lg)] p-6">
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </Surface>
        </Section>

        {/* ── ATOMS ── */}
        <Section title="Atoms">
          <div className="flex flex-wrap items-center gap-4">
            <Badge>BEST SELLER</Badge>
            <Badge>NEW</Badge>
            <Chip>32 bit DSP</Chip>
            <Chip>192 kHz</Chip>
            <Eyebrow>Eyebrow</Eyebrow>
            <Eyebrow accent>Accent eyebrow</Eyebrow>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <Rule />
            <Divider className="flex-1" />
          </div>
        </Section>

        {/* ── BREADCRUMB ── */}
        <Section title="Breadcrumb">
          <Breadcrumb
            items={[
              { label: "Главная", href: "/" },
              { label: "Каталог", href: "/catalog" },
              { label: "D-8000 WI-FI" },
            ]}
          />
        </Section>

        {/* ── PROSE ── */}
        <Section title="Prose">
          <Prose>
            <h2>Заголовок второго уровня</h2>
            <p>
              Обычный абзац с <strong>жирным текстом</strong> и <a href="#">ссылкой</a>.
            </p>
            <h3>Заголовок третьего уровня</h3>
            <ul>
              <li>Первый элемент списка</li>
              <li>Второй элемент</li>
            </ul>
            <blockquote>Цитата из документации.</blockquote>
          </Prose>
        </Section>

        {/* ── SPEC TABLE ── */}
        <Section title="SpecTable">
          <SpecTable
            rows={[
              { label: "Входы", value: "4 × XLR" },
              { label: "Выходы", value: "8 × XLR" },
              { label: "АЦП/ЦАП", value: "192 кГц / 32 бит" },
            ]}
          />
        </Section>

        {/* ── SPEC MATRIX ── */}
        <Section title="SpecMatrixTable">
          <SpecMatrixTable
            caption="Сравнение моделей TD"
            columns={["TD-2000", "TD-1500", "TD-1000"]}
            rows={[
              { label: "Мощность", values: ["2×1000 Вт", "2×750 Вт", "2×500 Вт"] },
              { label: "Импеданс", values: ["4 / 8 Ом", "4 / 8 Ом", null] },
              { label: "КНИ", values: ["<0.05%", "<0.05%", "<0.1%"] },
            ]}
          />
        </Section>

        {/* ── PRODUCT CARD ── */}
        <Section title="ProductCard">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <ProductCard
              slug="d-8000"
              name="NAG D-8000 WI-FI"
              eyebrow="DSP Processor"
              image={{
                src: "/products/d-8000/nag-d8000-front-panel.jpg",
                alt: "D-8000",
                width: 600,
                height: 450,
              }}
              price={{ amount: 122900 }}
              badge="BEST SELLER"
            />
            <ProductCard
              slug="e12"
              name="NOVIK E12"
              eyebrow="Ламповый усилитель"
              image={{
                src: "/products/d-8000/nag-d8000-front-panel.jpg",
                alt: "E12",
                width: 600,
                height: 450,
              }}
              price={{ onRequest: true }}
            />
          </div>
        </Section>

        {/* ── ACCORDION ── */}
        <Section title="AccordionItem">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg">
            <AccordionItem summary="Открытый аккордеон" defaultOpen className="border-t-0">
              <p className="text-sm text-text-muted">Содержимое первого раздела.</p>
            </AccordionItem>
            <AccordionItem summary="Закрытый аккордеон">
              <p className="text-sm text-text-muted">Содержимое второго раздела.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* ── TABS / PILL ── */}
        <Section title="Tabs + PillGroup">
          <TabsDemo />
          <div className="mt-6">
            <p className="mb-3 font-mono text-xs text-text-faint">
              PillGroup (standalone filter)
            </p>
            <PillDemo />
          </div>
        </Section>

        {/* ── MOTION ── */}
        <Section title="Motion tokens">
          <div className="flex flex-wrap gap-4">
            {(["transition-base", "transition-slow"] as const).map((cls) => (
              <div
                key={cls}
                className={`flex h-16 w-32 cursor-pointer items-center justify-center rounded-[var(--radius-md)] bg-accent p-2 text-center font-mono text-xs text-on-accent ${cls} hover:scale-110 hover:bg-accent-hover`}
              >
                {cls}
              </div>
            ))}
            <div className="glow-red flex h-16 w-32 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface p-2 text-center font-mono text-xs text-text">
              glow-red
            </div>
            <div className="glow-amber flex h-16 w-32 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface p-2 text-center font-mono text-xs text-text">
              glow-amber
            </div>
          </div>
        </Section>
      </Container>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2
        className="mb-6 border-b border-border pb-3 font-display uppercase text-text"
        style={{ fontSize: "var(--text-xl)", letterSpacing: "var(--ls-tight)" }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
