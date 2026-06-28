"use client";

import * as React from "react";

/** Red reading-progress bar — sits under the sticky header. */
export function ScrollProgress() {
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        setPct(max > 0 ? (h.scrollTop / max) * 100 : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="h-[var(--border-w-rule)] w-full bg-[rgba(11,11,13,0.07)]">
      <div
        className="h-full bg-accent transition-[width] duration-75 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
