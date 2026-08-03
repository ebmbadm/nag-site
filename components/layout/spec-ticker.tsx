"use client";

const ITEMS = [
  "QM-400",
  "4 × 2250 Вт (2 Ω)",
  "Class-TD",
  "КНИ 0.1 %",
  "Демпинг-фактор 950",
  "20 Гц – 20 кГц ±0.1 дБ",
  "Шум −99 дБ",
  "Bridge 2 × 4200 Вт",
  "SpeakOn",
  "EAC",
  "Гарантия 2 года",
];

export function SpecTicker() {
  const ticker = ITEMS.join(" · ");

  return (
    <div
      className="overflow-hidden border-y border-border-strong bg-surface-inset py-2.5"
      aria-hidden="true"
    >
      <div className="spec-ticker flex w-max whitespace-nowrap">
        {[ticker, ticker, ticker, ticker].map((t, i) => (
          <span
            key={i}
            className="shrink-0 px-8 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
