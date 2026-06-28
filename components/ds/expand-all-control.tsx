"use client";

import * as React from "react";

/**
 * Expand / collapse all <details> within the element matched by `targetSelector`.
 * Renders two text buttons in the header.
 */
export function ExpandAllControl({ targetSelector }: { targetSelector: string }) {
  const setAll = (open: boolean) => {
    document
      .querySelectorAll<HTMLDetailsElement>(`${targetSelector} details`)
      .forEach((d) => {
        d.open = open;
      });
  };

  return (
    <div className="flex items-center gap-3 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
      <button type="button" onClick={() => setAll(true)} className="transition-colors hover:text-accent">
        Раскрыть всё
      </button>
      <span aria-hidden>·</span>
      <button type="button" onClick={() => setAll(false)} className="transition-colors hover:text-accent">
        Свернуть
      </button>
    </div>
  );
}
