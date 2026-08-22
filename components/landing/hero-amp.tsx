"use client";

import * as React from "react";
import QM400Amp from "./qm400-amp";
import { LevelMeter } from "./level-meter";
import { useActiveInView, usePrefersReducedMotion } from "@/lib/motion";

const SEGMENTS = 14;

/* Meter ballistics, as a fraction of the remaining distance per frame: a real
   VU snaps up and falls back slowly. The old driver stepped to a new random
   value every 250 ms, which reads as a looping GIF rather than an instrument. */
const ATTACK = 0.4;
const RELEASE = 0.06;
const PEAK_FALL = 26; // percent of full scale per second

/* Power-on self-test: both channels sweep to full scale and drop back, the way
   the hardware checks its own meters at switch-on. Runs once per visit. */
const BOOT_MS = 1150;
const BOOT_START = 140;
const BOOT_RISE = 420;
const BOOT_HOLD = 200;
const BOOT_CHANNEL_OFFSET = 90;

function selfTestLevel(elapsed: number, channel: number) {
  const t = elapsed - BOOT_START - channel * BOOT_CHANNEL_OFFSET;
  if (t < 0) return 0;
  if (t < BOOT_RISE) return (t / BOOT_RISE) * 100;
  if (t < BOOT_RISE + BOOT_HOLD) return 100;
  return 0;
}

const RESTING = { l: 58, r: 44 };

export function HeroAmp() {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const active = useActiveInView(rootRef);
  const hasBooted = React.useRef(false);
  const [meters, setMeters] = React.useState({
    l: RESTING.l,
    r: RESTING.r,
    peakL: RESTING.l,
    peakR: RESTING.r,
  });

  React.useEffect(() => {
    // Reduced motion holds the meters at their resting level; off screen or in a
    // background tab the driver is not running at all.
    if (reduced || !active) return;

    const boot = !hasBooted.current;
    hasBooted.current = true;

    const t0 = performance.now();
    const channels = [
      { level: boot ? 0 : RESTING.l, peak: boot ? 0 : RESTING.l, target: RESTING.l, reroll: 0 },
      { level: boot ? 0 : RESTING.r, peak: boot ? 0 : RESTING.r, target: RESTING.r, reroll: 0 },
    ];

    // Pointer speed feeds the meters, so the amp answers the visitor instead of
    // running a random loop. Without pointermove (touch) the idle wander stands
    // on its own.
    let energy = 0;
    let lastX = 0;
    let lastY = 0;
    let tracking = false;

    function onPointerMove(e: PointerEvent) {
      if (tracking) {
        const travelled = Math.hypot(e.clientX - lastX, e.clientY - lastY);
        energy = Math.min(100, energy + travelled * 0.55);
      }
      lastX = e.clientX;
      lastY = e.clientY;
      tracking = true;
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // React only re-renders when a segment actually lights or goes dark, so the
    // 60 fps driver costs a handful of renders per second instead of sixty.
    const shown = { l: -1, r: -1, peakL: -1, peakR: -1 };
    const toSegment = (value: number) => Math.round((value / 100) * SEGMENTS);

    function commit() {
      const next = {
        l: toSegment(channels[0].level),
        r: toSegment(channels[1].level),
        peakL: toSegment(channels[0].peak),
        peakR: toSegment(channels[1].peak),
      };
      if (
        next.l === shown.l &&
        next.r === shown.r &&
        next.peakL === shown.peakL &&
        next.peakR === shown.peakR
      ) {
        return;
      }
      Object.assign(shown, next);
      setMeters({
        l: (next.l / SEGMENTS) * 100,
        r: (next.r / SEGMENTS) * 100,
        peakL: (next.peakL / SEGMENTS) * 100,
        peakR: (next.peakR / SEGMENTS) * 100,
      });
    }

    let frame = 0;
    let previous = t0;

    function tick(now: number) {
      const dt = Math.min((now - previous) / 1000, 0.05);
      previous = now;
      energy = Math.max(0, energy - energy * 4 * dt);

      const elapsed = now - t0;
      const booting = boot && elapsed < BOOT_MS;

      channels.forEach((channel, i) => {
        let target: number;
        if (booting) {
          target = selfTestLevel(elapsed, i);
        } else {
          // Idle programme material sits in the green band: with a slow release
          // the meter lingers near recent peaks, so a higher range would park
          // the amp in amber and read as permanently clipping. Pointer energy is
          // what pushes it into amber and red.
          if (now >= channel.reroll) {
            channel.target = 16 + Math.random() * 44;
            channel.reroll = now + 380 + Math.random() * 420;
          }
          target = Math.min(97, channel.target + energy * 0.5);
        }
        channel.level += (target - channel.level) * (target > channel.level ? ATTACK : RELEASE);
        channel.peak = Math.max(channel.level, channel.peak - PEAK_FALL * dt);
      });

      commit();
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reduced, active]);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-[330px] min-w-0 flex-col items-center justify-center overflow-hidden"
    >
      {/* The amp chassis is a fixed 660px; scale() is paint-only, so the grid
          track only collapses because of min-w-0 above. --qm-scale shrinks the
          unit on phones so the whole thing is visible, not a centred slice. */}
      {/* Scale steps are measured against the PAINTED chassis (the 3D projection
          of the faces plus the idle sway), not the 660px layout box. The lg step
          exists because the hero goes two-column at 1024 and the amp track
          collapses from ~941px to ~437px — .62 clipped a rack ear there. */}
      <div
        aria-hidden
        className="power-fade [--qm-scale:0.38] md:[--qm-scale:0.62] lg:[--qm-scale:0.56] xl:[--qm-scale:0.72]"
        style={{ ["--pd" as string]: "160ms" }}
      >
        <QM400Amp />
      </div>
      <div
        className="power-fade mt-1.5 flex items-center gap-[18px]"
        style={{ ["--pd" as string]: "420ms" }}
      >
        <div className="flex items-end gap-[9px]" aria-hidden>
          <LevelMeter value={meters.l} peak={meters.peakL} label="L" length={92} />
          <LevelMeter value={meters.r} peak={meters.peakR} label="R" length={92} />
        </div>
        <div className="border-l border-border pl-4">
          <div className="mb-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Флагман
          </div>
          <div className="font-mono text-sm text-text">QM-400 · 4 × 2400 Вт</div>
          <div className="mt-0.5 font-mono text-xs text-text-muted">Class-TD · КНИ 0.1 %</div>
        </div>
      </div>
    </div>
  );
}
