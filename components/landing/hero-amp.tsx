"use client";

import * as React from "react";
import QM400Amp from "./qm400-amp";
import { LevelMeter } from "./level-meter";

export function HeroAmp() {
  const [levels, setLevels] = React.useState({ l: 58, r: 44 });

  React.useEffect(() => {
    const id = setInterval(() => {
      setLevels({ l: 28 + Math.random() * 66, r: 24 + Math.random() * 68 });
    }, 250);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative flex min-h-[330px] flex-col items-center justify-center">
      <div aria-hidden>
        <QM400Amp scale={0.82} />
      </div>
      <div className="mt-1.5 flex items-center gap-[18px]">
        <div className="flex items-end gap-[9px]" aria-hidden>
          <LevelMeter value={levels.l} peak={90} label="L" length={92} />
          <LevelMeter value={levels.r} peak={86} label="R" length={92} />
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
