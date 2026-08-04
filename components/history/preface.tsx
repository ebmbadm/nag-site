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
        Внимание. Этот текст был написан мной более 20 лет назад. Я сознательно оставил его без изменений. Историю
        следующих 25 лет NOVIK надеюсь рассказать немного позже.
      </p>
    </Container>
  );
}
