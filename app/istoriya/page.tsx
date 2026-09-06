import type { Metadata } from "next";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Container, Eyebrow, Toc, ScrollProgress, ExpandAllControl } from "@/components/ds";
import { HistoryHero } from "@/components/history/hero";
import { Chapter } from "@/components/history/chapter";
import { HistoryPreface } from "@/components/history/preface";
import { getHistory } from "@/lib/content/company";
import { history2ToChapters, parseHistory2 } from "@/lib/content/history-2";

export const metadata: Metadata = {
  alternates: { canonical: "/istoriya" },
  title: "История компании NOVIK",
  description:
    "Мемуары основателя Сергея Новикова: единая история NOVIK от первых ламповых усилителей 1976 года до 2019 года.",
};

export default function HistoryPage() {
  const { hero, chapters } = getHistory();
  const history2Source = readFileSync(join(process.cwd(), "content", "company", "istoriya-2.md"), "utf8");
  const continuation = history2ToChapters(parseHistory2(history2Source));
  const allChapters = [...chapters, ...continuation];
  const tocItems = allChapters.map((chapter) => ({ id: chapter.id, label: chapter.title, meta: chapter.year }));

  return (
    <div>
      <div className="sticky top-[58px] z-30">
        <ScrollProgress />
      </div>

      <HistoryHero hero={hero} />
      <HistoryPreface />

      <Container className="flex flex-wrap items-start gap-[clamp(28px,5vw,60px)] pb-[clamp(60px,9vw,120px)]">
        <aside className="sticky top-24 hidden basis-[220px] self-start lg:block" style={{ flex: "0 1 220px" }}>
          <div className="mb-3.5 ml-3.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Содержание
          </div>
          <Toc items={tocItems} />
        </aside>

        <article id="history-article" className="min-w-0 flex-1 basis-[560px] max-w-[760px]">
          <div className="mb-2 flex items-center justify-between gap-4">
            <Eyebrow accent>Хроника · 1976 — 2019</Eyebrow>
            <ExpandAllControl targetSelector="#history-article" />
          </div>
          {chapters.map((chapter, index) => (
            <Chapter key={chapter.id} chapter={chapter} first={index === 0} />
          ))}
          <div className="mt-10 border-t-2 border-text pt-10">
            <Eyebrow accent>Продолжение · 2000–2019</Eyebrow>
            <p className="mt-3 mb-8 max-w-[62ch] text-text-muted" style={{ fontSize: "var(--text-md)", lineHeight: 1.72 }}>
              Как менялось дело: от собственной акустики и ламповых PA-систем до марки NAG и новых поколений усилителей.
            </p>
          </div>
          {continuation.map((chapter) => (
            <Chapter key={chapter.id} chapter={chapter} />
          ))}
        </article>
      </Container>
    </div>
  );
}
