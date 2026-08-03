"use client";

import * as React from "react";
import QM400Amp from "./qm400-amp";
import { LevelMeter } from "./level-meter";

export function HeroAmp() {
  const [levels, setLevels] = React.useState({ l: 58, r: 44 });
  // Peak-hold: jumps to the live level, then decays — so the top segment
  // tracks recent peaks instead of staying lit at a fixed position.
  const [peaks, setPeaks] = React.useState({ l: 58, r: 44 });

  React.useEffect(() => {
    // Reduced motion: meters hold their initial static level.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const DECAY = 7; // segments-worth of peak fall per tick
    const id = setInterval(() => {
      const l = 28 + Math.random() * 66;
      const r = 24 + Math.random() * 68;
      setLevels({ l, r });
      setPeaks((pk) => ({ l: Math.max(l, pk.l - DECAY), r: Math.max(r, pk.r - DECAY) }));
    }, 250);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex min-h-[330px] min-w-0 flex-col items-center justify-center overflow-hidden">
      {/* The amp chassis is a fixed 660px; scale() is paint-only, so the grid
          track only collapses because of min-w-0 above. --qm-scale shrinks the
          unit on phones so the whole thing is visible, not a centred slice. */}
      {/* Scale steps are measured against the PAINTED chassis (the 3D projection
          of the faces plus the idle sway), not the 660px layout box. The lg step
          exists because the hero goes two-column at 1024 and the amp track
          collapses from ~941px to ~437px — .62 clipped a rack ear there. */}
      <div
        aria-hidden
        className="[--qm-scale:0.38] md:[--qm-scale:0.62] lg:[--qm-scale:0.56] xl:[--qm-scale:0.72]"
      >
        <QM400Amp />
      </div>
      <div className="mt-1.5 flex items-center gap-[18px]">
        <div className="flex items-end gap-[9px]" aria-hidden>
          <LevelMeter value={levels.l} peak={peaks.l} label="L" length={92} />
          <LevelMeter value={levels.r} peak={peaks.r} label="R" length={92} />
        </div>
        <div className="border-l border-border pl-4">
          <div className="mb-1 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
            Флагман
          </div>
          <div className="font-mono text-sm text-text">QM-400 · 4 × 2250 Вт</div>
          <div className="mt-0.5 font-mono text-xs text-text-muted">Class-TD · КНИ 0.1 %</div>
        </div>
      </div>
    </div>
  );
}
