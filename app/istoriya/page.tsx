import type { Metadata } from "next";
import { Container, Eyebrow, Toc, ScrollProgress, ExpandAllControl } from "@/components/ds";
import { HistoryHero } from "@/components/history/hero";
import { Chapter } from "@/components/history/chapter";
import { getHistory } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "История компании NOVIK",
  description:
    "Мемуары основателя Сергея Новикова: от первых ламповых усилителей 1976 года и дебюта во Франкфурте до бренда NOVIK и линейки PA.",
};

export default function HistoryPage() {
  const { hero, chapters } = getHistory();
  const tocItems = chapters.map((c) => ({ id: c.id, label: c.title, meta: c.year }));

  return (
    <div>
      <div className="sticky top-[58px] z-30">
        <ScrollProgress />
      </div>

      <HistoryHero hero={hero} />

      <Container className="flex flex-wrap items-start gap-[clamp(28px,5vw,60px)] pb-[clamp(60px,9vw,120px)]">
        <aside className="sticky top-24 hidden basis-[220px] self-start lg:block" style={{ flex: "0 1 220px" }}>
          <div className="mb-3.5 ml-3.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Содержание
          </div>
          <Toc items={tocItems} />
        </aside>

        <article id="history-article" className="min-w-0 flex-1 basis-[560px] max-w-[760px]">
          <div className="mb-2 flex items-center justify-between gap-4">
            <Eyebrow accent>Хроника · 1976 — 2000</Eyebrow>
            <ExpandAllControl targetSelector="#history-article" />
          </div>
          {chapters.map((chapter, i) => (
            <Chapter key={chapter.id} chapter={chapter} first={i === 0} />
          ))}
        </article>
      </Container>
    </div>
  );
}
