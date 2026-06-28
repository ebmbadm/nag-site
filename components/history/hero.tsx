import { Container, Eyebrow } from "@/components/ds";
import type { HistoryHero } from "@/lib/content/types";

/** History longread hero — title, dropcap lead, founder portrait. */
export function HistoryHero({ hero }: { hero: HistoryHero }) {
  return (
    <Container className="pt-[clamp(36px,7vw,72px)] pb-[clamp(24px,4vw,40px)]">
      <Eyebrow accent className="mb-5 block">
        {hero.kicker}
      </Eyebrow>

      <h1
        className="font-display font-bold uppercase text-text"
        style={{ fontSize: "clamp(46px,9vw,98px)", lineHeight: 0.92, letterSpacing: "var(--ls-tight)" }}
      >
        {hero.titleLead} <span className="text-accent">{hero.titleAccent}</span>
      </h1>

      <div className="mt-8 flex flex-wrap items-start gap-[clamp(28px,5vw,56px)]">
        <div className="min-w-0 flex-1 basis-[460px]">
          <p className="mb-5 max-w-[58ch] text-text" style={{ fontSize: "clamp(18px,2.1vw,22px)", lineHeight: 1.6 }}>
            <span
              className="float-left mr-3.5 mt-1 font-display font-bold text-text"
              style={{ fontSize: "clamp(58px,9vw,86px)", lineHeight: 1 }}
            >
              {hero.dropcap}
            </span>
            {hero.lead}
          </p>
          <p className="max-w-[62ch] text-text-muted" style={{ fontSize: "clamp(15px,1.6vw,17px)", lineHeight: 1.7 }}>
            {hero.subLead}
          </p>
          {hero.badge ? (
            <span className="mt-5 inline-flex items-center rounded-[var(--radius-pill)] border border-border-strong px-3 py-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-muted">
              {hero.badge}
            </span>
          ) : null}
        </div>

        <figure className="m-0 shrink-0 text-center" style={{ width: "clamp(160px,40vw,210px)" }}>
          <div
            className="grid aspect-square place-items-center overflow-hidden rounded-full border border-border bg-surface-2"
            style={{ boxShadow: "var(--shadow-2)" }}
          >
            {hero.portrait.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={hero.portrait.src} alt={hero.portrait.sign} className="size-full object-cover" />
            ) : (
              <span className="font-display text-4xl text-text-faint">СН</span>
            )}
          </div>
          <figcaption className="mt-3.5">
            <span
              className="block text-text"
              style={{ fontFamily: "'Segoe Script','Brush Script MT',cursive", fontSize: "26px", transform: "rotate(-4deg)" }}
            >
              {hero.portrait.sign}
            </span>
            <span className="mt-2 block font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
              {hero.portrait.caption}
            </span>
          </figcaption>
        </figure>
      </div>
    </Container>
  );
}
