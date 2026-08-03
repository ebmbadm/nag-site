import type { Metadata } from "next";
import { Container, Eyebrow, Surface, Breadcrumb } from "@/components/ds";

export const metadata: Metadata = {
  title: "История компании NOVIK",
  description: "Раздел «История» временно недоступен. Скоро вернёмся с хроникой компании.",
};

export default function HistoryPage() {
  return (
    <Surface mode="dark" className="flex min-h-[60vh] items-start py-16">
      <Container>
        <Breadcrumb items={[{ label: "Главная", href: "/" }, { label: "История" }]} />
        <div className="mt-6 max-w-prose">
          <Eyebrow accent>Хроника · 1976 — 2000</Eyebrow>
          <h1
            className="mt-3 font-display uppercase text-text"
            style={{
              fontSize: "clamp(var(--text-3xl), 5vw, var(--text-5xl))",
              lineHeight: "var(--lh-tight)",
              letterSpacing: "var(--ls-tight)",
            }}
          >
            История NOVIK
          </h1>
          <p className="mt-4 text-text-muted" style={{ lineHeight: "var(--lh-relaxed)" }}>
            Раздел будет доступен позже.
          </p>
        </div>
      </Container>
    </Surface>
  );
}
