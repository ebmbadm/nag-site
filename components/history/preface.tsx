import { Container, Figure } from "@/components/ds";

/** Editorial note and approved ship image before the founder's chronology. */
export function HistoryPreface() {
  return (
    <Container className="pb-[clamp(40px,6vw,72px)]">
      <Figure
        src="/history/novik-history-ship-v5.png"
        alt="Корабль с надписью NOVIK на носу"
        caption="Заставка истории NOVIK"
        width={1600}
        height={900}
        priority
      />
      <p className="mt-6 max-w-[72ch] text-text-muted" style={{ fontSize: "var(--text-md)", lineHeight: 1.72 }}>
        Первая часть этого текста была написана мной более 20 лет назад и сохранена без изменений. Теперь история
        продолжена единым рассказом до 2019 года.
      </p>
    </Container>
  );
}
