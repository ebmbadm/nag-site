"use client";

import * as React from "react";

/**
 * Live `prefers-reduced-motion`. Reading matchMedia once at mount leaves an
 * animation running until reload when the OS setting is flipped mid-visit.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

/**
 * True only while the element is on screen AND the tab is visible — the gate
 * for idle loops (rAF drivers, marquees) so they cost nothing once scrolled
 * past. Starts false, so the server markup is the resting state.
 */
export function useActiveInView(ref: React.RefObject<Element | null>) {
  const [active, setActive] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let onScreen = false;
    const sync = () => setActive(onScreen && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });

    observer.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [ref]);

  return active;
}
