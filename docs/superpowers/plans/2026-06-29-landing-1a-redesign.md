# Landing 1a Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `app/page.tsx` with mockup variant 1a — a dark "chassis" landing anchored by an interactive CSS-3D QM-400 amplifier with animated VU meters.

**Architecture:** `page.tsx` stays a server component rendering seven sections from DS primitives. Interactivity is isolated to three new `components/landing/` files: a server-safe `LevelMeter` (pure segment logic + classes), a `"use client"` `QM400Amp` (CSS-3D + parallax via `requestAnimationFrame`), and a `"use client"` `HeroAmp` that composes the amp + two meters + a level-randomizing interval.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript (strict), Tailwind v4 (semantic tokens), lucide-react, vitest + @testing-library/react.

## Global Constraints

- **Tokens only for UI chrome** — no hardcoded hex in UI. Use Tailwind token utilities (`bg-bg`, `text-text-muted`, `border-border`, …) or `var(--…)` arbitrary values. Documented exception: the 3D amp's brushed-metal *material* hex and the meter `off` color (`rgba(255,255,255,.07)`) are illustration internals, kept verbatim.
- **Reuse DS primitives** from `components/ds` (`Container`, `Surface`, `Eyebrow`, `SectionHeader`, `Rule`, `Badge`, `buttonVariants`). Server components by default; only interactive components get `"use client"`.
- **Russian-only** copy. Prices are integers in roubles, carried from the current site verbatim.
- **Prices (current-site, authoritative):** QM-400 **от 285 000 ₽**; Процессоры **от 95 000 ₽**; Усилители **от 85 000 ₽**; Лампа **от 120 000 ₽**; Модули **от 18 000 ₽**.
- **`npm run build` must stay green** (typecheck + lint + prerender). Client islands must not touch `window`/`document` during render — only inside `useEffect`. The page must remain prerenderable (SSG).
- Path alias `@/*` → repo root.

---

### Task 1: LevelMeter primitive (pure logic + component + CSS)

Segmented LED VU/peak meter, ported faithfully from the DS bundle. The zone/lit math is extracted into a pure exported helper so it can be unit-tested without the DOM.

**Files:**
- Create: `components/landing/level-meter.tsx`
- Create: `components/landing/__tests__/level-meter.test.ts`
- Modify: `app/globals.css` (append `.nag-meter*` CSS block, tokenized)

**Interfaces:**
- Produces:
  - `meterSegments(value: number, peak: number | undefined, segments?: number): MeterSeg[]` where `MeterSeg = { zone: "green" | "amber" | "red"; on: boolean; peak: boolean }`
  - `LevelMeter(props: { value?: number; peak?: number; segments?: number; orientation?: "vertical" | "horizontal"; length?: number; label?: string; className?: string }): JSX.Element`

- [ ] **Step 1: Write the failing test**

Create `components/landing/__tests__/level-meter.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { meterSegments } from "../level-meter";

describe("meterSegments", () => {
  it("lights zero segments at value 0", () => {
    const segs = meterSegments(0, undefined, 14);
    expect(segs).toHaveLength(14);
    expect(segs.filter((s) => s.on)).toHaveLength(0);
  });

  it("lights all segments at value 100", () => {
    const segs = meterSegments(100, undefined, 14);
    expect(segs.filter((s) => s.on)).toHaveLength(14);
  });

  it("lights half (rounded) at value 50 of 14 segments", () => {
    const segs = meterSegments(50, undefined, 14);
    // round(50/100 * 14) = round(7.0) = 7
    expect(segs.filter((s) => s.on)).toHaveLength(7);
  });

  it("assigns zones: green ≤0.66, amber ≤0.86, red above", () => {
    const segs = meterSegments(100, undefined, 14);
    // idx 9 -> 9/14 = 0.643 green; idx 10 -> 0.714 amber; idx 14 -> 1.0 red
    expect(segs[8].zone).toBe("green");
    expect(segs[9].zone).toBe("amber");
    expect(segs[13].zone).toBe("red");
  });

  it("marks the peak segment when value is below peak", () => {
    const segs = meterSegments(50, 100, 14);
    // peakSeg = round(100/100 * 14) = 14 -> index 13
    expect(segs[13].peak).toBe(true);
    expect(segs[13].on).toBe(false);
  });

  it("does not mark a peak when peak is undefined", () => {
    const segs = meterSegments(50, undefined, 14);
    expect(segs.some((s) => s.peak)).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/landing/__tests__/level-meter.test.ts`
Expected: FAIL — "Failed to resolve import ../level-meter" / `meterSegments is not a function`.

- [ ] **Step 3: Write the component + helper**

Create `components/landing/level-meter.tsx`:

```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export type MeterSeg = { zone: "green" | "amber" | "red"; on: boolean; peak: boolean };

/** Pure segment model for a segmented VU/peak meter. value & peak are 0–100. */
export function meterSegments(
  value: number,
  peak: number | undefined,
  segments = 14,
): MeterSeg[] {
  const lit = Math.round((value / 100) * segments);
  const peakSeg = peak != null ? Math.round((peak / 100) * segments) : -1;
  return Array.from({ length: segments }, (_, i) => {
    const idx = i + 1; // 1..segments from bottom/left
    const ratio = idx / segments;
    const zone: MeterSeg["zone"] = ratio > 0.86 ? "red" : ratio > 0.66 ? "amber" : "green";
    return { zone, on: idx <= lit, peak: idx === peakSeg };
  });
}

const ZONE_VAR: Record<MeterSeg["zone"], string> = {
  green: "var(--nag-green-500)",
  amber: "var(--nag-amber-500)",
  red: "var(--accent)",
};
const OFF = "rgba(255,255,255,.07)"; // illustration internal — kept from source bundle

export function LevelMeter({
  value = 0,
  peak,
  segments = 14,
  orientation = "vertical",
  length = 120,
  label,
  className,
}: {
  value?: number;
  peak?: number;
  segments?: number;
  orientation?: "vertical" | "horizontal";
  length?: number;
  label?: string;
  className?: string;
}) {
  const horizontal = orientation === "horizontal";
  const segLen = (length - (segments - 1) * 2 - 6) / segments;
  const segs = meterSegments(value, peak, segments);

  return (
    <div className={cn("nag-meter", `nag-meter--${orientation}`, className)}>
      <div className="nag-meter__col">
        <div
          className="nag-meter__track"
          style={horizontal ? { width: length } : { height: length }}
        >
          {segs.map((s, i) => (
            <span
              key={i}
              className="nag-meter__seg"
              style={{
                background: s.on || s.peak ? ZONE_VAR[s.zone] : OFF,
                ...(horizontal ? { width: `${segLen}px` } : { height: `${segLen}px` }),
              }}
            />
          ))}
        </div>
        {label ? <span className="nag-meter__label">{label}</span> : null}
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Append the meter CSS to `app/globals.css`**

Add this block at the end of `app/globals.css` (ported from the DS bundle, tokenized):

```css
/* ── LevelMeter (segmented VU/peak) ───────────────────────────── */
.nag-meter {
  display: inline-flex;
  gap: 10px;
  align-items: flex-end;
  font-family: var(--font-mono);
}
.nag-meter__col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
}
.nag-meter__track {
  display: flex;
  gap: 2px;
  padding: 3px;
  background: var(--nag-black-980);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-xs);
  box-shadow: var(--shadow-inset);
}
.nag-meter--horizontal .nag-meter__track {
  flex-direction: row-reverse;
}
.nag-meter--vertical .nag-meter__track {
  flex-direction: column;
}
.nag-meter__seg {
  border-radius: 1px;
  transition:
    opacity var(--dur-fast) linear,
    background var(--dur-fast) linear;
}
.nag-meter--vertical .nag-meter__seg {
  width: 14px;
}
.nag-meter--horizontal .nag-meter__seg {
  height: 14px;
}
.nag-meter__label {
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/landing/__tests__/level-meter.test.ts`
Expected: PASS (6 passed).

- [ ] **Step 6: Commit**

```bash
git add components/landing/level-meter.tsx components/landing/__tests__/level-meter.test.ts app/globals.css
git commit -m "feat(landing): LevelMeter VU primitive ported from DS bundle"
```

---

### Task 2: QM400Amp interactive 3D component + brand assets

Port `QM400Amp.jsx` (plain `React.createElement` + `window` global) to a typed TSX client component using JSX and hooks. Copy the white-mono brand logo it needs into `public/brand`.

**Files:**
- Create: `components/landing/qm400-amp.tsx`
- Copy: `public/brand/nag-logo-mono-white.png`, `public/brand/nag-mark-white.png`

**Interfaces:**
- Consumes: nothing.
- Produces: `QM400Amp(props: { logo?: string; accent?: string; scale?: number; live?: boolean }): JSX.Element` — default export `QM400Amp`.

- [ ] **Step 1: Copy the brand assets**

```bash
cp "/Users/viktor/Downloads/NAC лендинга первая страница/assets/brand/nag-logo-mono-white.png" public/brand/nag-logo-mono-white.png
cp "/Users/viktor/Downloads/NAC лендинга первая страница/assets/brand/nag-mark-white.png" public/brand/nag-mark-white.png
ls public/brand/nag-logo-mono-white.png public/brand/nag-mark-white.png
```

Expected: both paths listed (exist).

- [ ] **Step 2: Write the component**

Create `components/landing/qm400-amp.tsx`. The `<style>` is rendered directly in JSX (single instance on the page → no dedup needed, SSR-correct). Material hex is the documented illustration exception.

```tsx
"use client";

import * as React from "react";

const W = 660;
const H = 158;
const D = 220;
const hZ = D / 2;
const hW = W / 2;
const hH = H / 2;

const CSS = `
.qm-scene{ perspective:1600px; perspective-origin:52% 38%; width:100%;
  display:flex; align-items:center; justify-content:center; padding:34px 0 18px; }
.qm-pivot{ position:relative; transform-style:preserve-3d; }
.qm{ position:relative; width:${W}px; height:${H}px; transform-style:preserve-3d;
  transform:rotateX(8deg) rotateY(-22deg); will-change:transform; }
.qm__f{ position:absolute; top:50%; left:50%; }
.qm__front{ width:${W}px; height:${H}px; transform:translate(-50%,-50%) translateZ(${hZ}px);
  border-radius:6px; overflow:hidden; border:1px solid #000;
  background:linear-gradient(180deg,#26282c,#141518 16%,#101113 84%,#0a0b0d);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.10), inset 0 -2px 6px rgba(0,0,0,.5); }
.qm__back{ width:${W}px; height:${H}px; transform:translate(-50%,-50%) translateZ(-${hZ}px) rotateY(180deg);
  background:#0a0b0d; border-radius:6px; }
.qm__right{ width:${D}px; height:${H}px; transform:translate(-50%,-50%) rotateY(90deg) translateZ(${hW}px);
  background:linear-gradient(90deg,#070809,#1b1d21 55%,#0c0d0f);
  background-image:repeating-linear-gradient(90deg,#0a0b0d 0 7px,#202327 8px,#0a0b0d 10px);
  border-top:1px solid #2a2d31; }
.qm__left{ width:${D}px; height:${H}px; transform:translate(-50%,-50%) rotateY(-90deg) translateZ(${hW}px);
  background:linear-gradient(90deg,#0c0d0f,#1a1c20);
  background-image:repeating-linear-gradient(90deg,#0a0b0d 0 7px,#1c1e22 8px,#0a0b0d 10px); }
.qm__top{ width:${W}px; height:${D}px; transform:translate(-50%,-50%) rotateX(90deg) translateZ(${hH}px);
  background:linear-gradient(180deg,#34373c,#1a1c1f 60%,#141518);
  background-image:repeating-linear-gradient(90deg,#16181b 0 3px,#2c2f34 5px,#16181b 7px); }
.qm__bottom{ width:${W}px; height:${D}px; transform:translate(-50%,-50%) rotateX(-90deg) translateZ(${hH}px);
  background:#070809; }
.qm-shadow{ position:absolute; left:50%; bottom:-30px; width:${W - 30}px; height:54px;
  transform:translateX(-50%) rotateX(74deg); z-index:-1; filter:blur(11px);
  background:radial-gradient(ellipse,rgba(0,0,0,.6),transparent 70%); }
.qm-ear{ position:absolute; top:0; bottom:0; width:30px;
  background:linear-gradient(90deg,#0a0b0d,#26282c 45%,#15171a);
  border-right:1px solid #000; }
.qm-ear--l{ left:0; border-radius:6px 0 0 6px; }
.qm-ear--r{ right:0; border-left:1px solid #000; border-right:0; border-radius:0 6px 6px 0;
  background:linear-gradient(90deg,#15171a,#26282c 55%,#0a0b0d); }
.qm-eslot{ position:absolute; left:50%; transform:translateX(-50%); width:9px; height:15px; border-radius:5px;
  background:radial-gradient(circle at 40% 30%,#000,#070809); box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 1px 0 rgba(255,255,255,.05); }
.qm-grille{ position:absolute; top:13px; bottom:13px; border-radius:4px;
  background-color:#191b1f;
  background-image:radial-gradient(circle,#050506 0 2px,transparent 2.4px);
  background-size:7px 7px; background-position:0 0;
  box-shadow:inset 0 2px 9px rgba(0,0,0,.85), inset 0 0 0 1px #000, inset 0 -1px 0 rgba(255,255,255,.04); }
.qm-grille--l{ left:38px; right:calc(50% + 132px); }
.qm-grille--r{ right:38px; left:calc(50% + 132px); }
.qm-panel{ position:absolute; top:9px; bottom:9px; left:50%; transform:translateX(-50%); width:250px;
  border-radius:5px; padding:9px 12px 8px;
  background:linear-gradient(180deg,#202227,#121316 70%,#0d0e10); border:1px solid #000;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07), inset 0 0 0 1px rgba(0,0,0,.4); }
.qm-logo{ display:flex; align-items:center; justify-content:center; gap:6px; height:17px; }
.qm-logo img{ height:14px; width:auto; opacity:.96; }
.qm-leds{ display:flex; justify-content:space-between; padding:0 4px; margin-top:7px; }
.qm-ledcol{ display:flex; flex-direction:column; align-items:center; gap:3px; }
.qm-led{ width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,.07); }
.qm-led.on{ box-shadow:0 0 5px currentColor, inset 0 0 1px rgba(255,255,255,.6); background:currentColor; }
.qm-led.sig{ animation:qmSig 1.5s var(--d,0s) infinite; }
.qm-led.clip{ animation:qmClip 3.2s var(--d,0s) infinite; }
@keyframes qmSig{ 0%,100%{opacity:.3} 45%{opacity:1} }
@keyframes qmClip{ 0%,90%,100%{opacity:.16} 94%{opacity:1} }
.qm-knobs{ display:flex; align-items:center; justify-content:center; gap:11px; margin-top:6px; }
.qm-knob{ width:25px; height:25px; border-radius:50%; position:relative;
  background:radial-gradient(circle at 38% 30%,#34373c,#101216 78%); border:1px solid #000;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.16),0 2px 5px rgba(0,0,0,.6); }
.qm-knob::after{ content:""; position:absolute; left:50%; top:3px; width:2px; height:9px; border-radius:2px;
  background:var(--accent,#E11507); transform:translateX(-50%) rotate(var(--kr,0deg)); transform-origin:50% 9.5px;
  box-shadow:0 0 4px var(--accent,#E11507); }
.qm-pwr{ width:18px; height:25px; border-radius:3px; position:relative;
  background:linear-gradient(180deg,#2a2d31,#0d0e10); border:1px solid #000; box-shadow:inset 0 1px 0 rgba(255,255,255,.12); }
.qm-pwr::after{ content:""; position:absolute; left:50%; top:4px; transform:translateX(-50%); width:8px; height:8px; border-radius:50%;
  background:var(--accent,#E11507); box-shadow:0 0 6px var(--accent,#E11507); }
.qm-silk{ display:flex; align-items:baseline; justify-content:center; gap:6px; margin-top:5px; }
.qm-model{ font-family:var(--font-display,Oswald),sans-serif; font-weight:700; font-size:14px; color:#eceef1; letter-spacing:.02em; line-height:1; }
.qm-sub{ font-family:var(--font-mono,monospace); font-size:6px; letter-spacing:.16em; color:#7f858c; text-transform:uppercase; }
.qm-screw{ position:absolute; width:9px; height:9px; border-radius:50%;
  background:radial-gradient(circle at 35% 30%,#4a4d54,#141619); border:1px solid #000; }
.qm-screw::after{ content:""; position:absolute; inset:2.5px; border-top:1.4px solid rgba(255,255,255,.22); transform:rotate(42deg); }
`;

const KNOB_ROT = [-34, 18, -12, 30];

function LedStack({ ch, accent, live }: { ch: number; accent: string; live: boolean }) {
  const d = `${ch * 0.4}s`;
  return (
    <div className="qm-ledcol">
      <span className="qm-led on" style={{ color: "var(--nag-red-300)", opacity: 0.35 }} />
      <span
        className={`qm-led clip${live ? "" : " on"}`}
        style={{ color: accent, ["--d" as string]: d }}
      />
      <span
        className="qm-led sig on"
        style={{ color: "var(--nag-amber-500)", ["--d" as string]: d }}
      />
      <span className="qm-led on" style={{ color: "var(--nag-green-500)" }} />
    </div>
  );
}

export default function QM400Amp({
  logo = "/brand/nag-logo-mono-white.png",
  accent = "var(--accent)",
  scale = 1,
  live = true,
}: {
  logo?: string;
  accent?: string;
  scale?: number;
  live?: boolean;
}) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const sceneRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    let curRY = -22;
    let curRX = 8;
    let tgtRY = -22;
    let tgtRX = 8;
    let hot = false;

    function onMove(e: MouseEvent) {
      const r = el!.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tgtRY = -22 + x * 40;
      tgtRX = 8 - y * 20;
      hot = true;
    }
    function onLeave() {
      hot = false;
    }
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    function loop() {
      t += 0.011;
      if (!hot) {
        tgtRY = -20 + Math.sin(t) * 8;
        tgtRX = 8 + Math.sin(t * 0.7) * 2.4;
      }
      curRY += (tgtRY - curRY) * 0.07;
      curRX += (tgtRX - curRX) * 0.07;
      if (boxRef.current) {
        boxRef.current.style.transform = `rotateX(${curRX}deg) rotateY(${curRY}deg)`;
      }
      raf = requestAnimationFrame(loop);
    }
    loop();

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div className="qm-scene" ref={sceneRef}>
      <style>{CSS}</style>
      <div className="qm-pivot" style={{ transform: `scale(${scale})` }}>
        <div className="qm" ref={boxRef}>
          <div className="qm__f qm__back" />
          <div className="qm__f qm__left" />
          <div className="qm__f qm__right" />
          <div className="qm__f qm__top" />
          <div className="qm__f qm__bottom" />
          <div className="qm__f qm__front">
            <div className="qm-ear qm-ear--l">
              <div className="qm-eslot" style={{ top: 30 }} />
              <div className="qm-eslot" style={{ bottom: 30 }} />
            </div>
            <div className="qm-ear qm-ear--r">
              <div className="qm-eslot" style={{ top: 30 }} />
              <div className="qm-eslot" style={{ bottom: 30 }} />
            </div>
            <div className="qm-grille qm-grille--l" />
            <div className="qm-grille qm-grille--r" />
            <div className="qm-panel">
              <div className="qm-logo">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logo} alt="NAG" />
              </div>
              <div className="qm-leds">
                {[0, 1, 2, 3].map((ch) => (
                  <LedStack key={ch} ch={ch} accent={accent} live={live} />
                ))}
              </div>
              <div className="qm-knobs">
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[0]}deg` }} />
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[1]}deg` }} />
                <div className="qm-pwr" />
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[2]}deg` }} />
                <div className="qm-knob" style={{ ["--kr" as string]: `${KNOB_ROT[3]}deg` }} />
              </div>
              <div className="qm-silk">
                <span className="qm-model">QM-400</span>
                <span className="qm-sub">Professional Power Amplifier</span>
              </div>
            </div>
            <div className="qm-screw" style={{ top: 7, left: 10 }} />
            <div className="qm-screw" style={{ bottom: 7, left: 10 }} />
            <div className="qm-screw" style={{ top: 7, right: 10 }} />
            <div className="qm-screw" style={{ bottom: 7, right: 10 }} />
          </div>
        </div>
        <div className="qm-shadow" />
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck the component**

Run: `npx tsc --noEmit`
Expected: no errors. (If the `["--kr" as string]` CSS-var cast errors, it is the established pattern for typing custom properties on `style`; keep as written.)

- [ ] **Step 4: Commit**

```bash
git add components/landing/qm400-amp.tsx public/brand/nag-logo-mono-white.png public/brand/nag-mark-white.png
git commit -m "feat(landing): QM400Amp interactive CSS-3D amplifier"
```

---

### Task 3: HeroAmp client island

Composes `QM400Amp` + two `LevelMeter`s with a 250 ms interval randomizing the meter levels (the "live" feel), plus the spec caption. This is the hero's right column.

**Files:**
- Create: `components/landing/hero-amp.tsx`

**Interfaces:**
- Consumes: `QM400Amp` (default export) from `./qm400-amp`; `LevelMeter` from `./level-meter`.
- Produces: `HeroAmp(): JSX.Element` — named export `HeroAmp`.

- [ ] **Step 1: Write the component**

Create `components/landing/hero-amp.tsx`:

```tsx
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
      <QM400Amp scale={0.82} />
      <div className="mt-1.5 flex items-center gap-[18px]">
        <div className="flex items-end gap-[9px]">
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
```

- [ ] **Step 2: Typecheck**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add components/landing/hero-amp.tsx
git commit -m "feat(landing): HeroAmp island (3D amp + live VU meters)"
```

---

### Task 4: Rewrite `app/page.tsx` (seven sections)

Replace the entire landing with variant 1a. Server component; the only client piece is `<HeroAmp>`. All prices are the current-site values from Global Constraints.

**Files:**
- Modify (full replace): `app/page.tsx`

**Interfaces:**
- Consumes: `Container`, `Surface`, `Eyebrow`, `SectionHeader`, `Rule`, `Badge`, `buttonVariants` from `@/components/ds`; `SpecTicker` from `@/components/layout/spec-ticker`; `HeroAmp` from `@/components/landing/hero-amp`; `next/link`, `next/image`; lucide icons.

- [ ] **Step 1: Replace the file contents**

Overwrite `app/page.tsx` with:

```tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, Activity, ShieldHalf, Wrench } from "lucide-react";
import {
  Container,
  Eyebrow,
  Surface,
  SectionHeader,
  Rule,
  Badge,
  buttonVariants,
} from "@/components/ds";
import { SpecTicker } from "@/components/layout/spec-ticker";
import { HeroAmp } from "@/components/landing/hero-amp";

const HERO_STATS = [
  { value: "40+", label: "лет на рынке" },
  { value: "100 %", label: "тестирование" },
  { value: "2 года", label: "гарантия · EAC" },
];

const CATEGORIES = [
  {
    eyebrow: "Процессоры · DSP",
    title: "Процессоры",
    text: "DSP-процессоры NAG: D-8000 Wi-Fi, F-8, F-8 PRO.",
    href: "/catalog/processors",
    price: "от 95 000 ₽",
  },
  {
    eyebrow: "Усилители мощности",
    title: "Усилители",
    text: "Транзисторные QM-400, серии TD и CX — 4 × 700 Вт с DSP.",
    href: "/catalog/amplifiers",
    price: "от 85 000 ₽",
  },
  {
    eyebrow: "Ламповые · NOVIK",
    title: "Лампа",
    text: "Ламповые усилители — наследие NOVIK с 1976 года.",
    href: "/catalog/tubes",
    price: "от 120 000 ₽",
  },
  {
    eyebrow: "Модули встраиваемые",
    title: "Модули",
    text: "Встраиваемые модули для активной акустики: TDS / TDH, TDX.",
    href: "/catalog/modules",
    price: "от 18 000 ₽",
  },
];

const ADVANTAGES = [
  {
    Icon: ShieldCheck,
    title: "EAC сертификация",
    text: "Техника сертифицирована по требованиям ЕАЭС.",
  },
  {
    Icon: Activity,
    title: "100 % тестирование",
    text: "Каждый аппарат проходит полный тест под нагрузкой перед отгрузкой.",
  },
  {
    Icon: ShieldHalf,
    title: "Гарантия 2 года",
    text: "Два года гарантии на всю технику NAG · NOVIK.",
  },
  {
    Icon: Wrench,
    title: "Сервис в Петербурге",
    text: "Собственный отдел ремонта: гарантийное и постгарантийное обслуживание.",
  },
];

const QM400_FEATURE_STATS = [
  { value: "4×2250", label: "Вт · 2 Ω", accent: true },
  { value: "0.1 %", label: "КНИ · 8 Ω", accent: false },
  { value: "950", label: "Демпинг", accent: false },
];

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <Surface mode="dark" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 78% 18%, rgba(225,21,7,.16), transparent 52%), radial-gradient(90% 70% at 8% 90%, rgba(255,90,12,.07), transparent 60%)",
          }}
        />
        <Container className="relative grid items-center gap-[clamp(24px,3vw,48px)] py-[clamp(48px,6vw,84px)] lg:grid-cols-[1.04fr_.96fr]">
          <div>
            <div className="mb-[22px] flex items-center gap-3">
              <Rule className="w-[38px]" />
              <Eyebrow>NOVIK Amplifiers Group · Pro Audio · с 1992</Eyebrow>
            </div>
            <h1
              className="font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(46px,6.6vw,92px)",
                lineHeight: 0.93,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              МОЩНОСТЬ,
              <br />
              ПРОВЕРЕННАЯ
              <br />
              <span className="text-accent">ГОДАМИ.</span>
            </h1>
            <p
              className="mt-6 max-w-[46ch] text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)" }}
            >
              Производим, продаём и обслуживаем усилители мощности, DSP-процессоры и ламповые
              усилители. Каждый аппарат проходит 100% тестирование, сертифицирован EAC и обеспечен
              гарантией два года.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link href="/catalog" className={buttonVariants({ variant: "primary", size: "lg" })}>
                Смотреть каталог
                <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link
                href="/o-kompanii"
                className={buttonVariants({ variant: "outline", size: "lg" })}
              >
                О компании
              </Link>
            </div>
            <div className="mt-[38px] flex gap-[clamp(20px,3vw,46px)] border-t border-border pt-6">
              {HERO_STATS.map((s) => (
                <div key={s.label}>
                  <div
                    className="font-display font-bold uppercase tabular-nums text-text"
                    style={{ fontSize: "var(--text-4xl)", lineHeight: 1 }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <HeroAmp />
        </Container>
      </Surface>

      {/* ── SPEC TICKER ── */}
      <SpecTicker />

      {/* ── CATEGORIES ── */}
      <Container className="py-[clamp(52px,6vw,92px)]">
        <div className="mb-[34px] flex flex-wrap items-end justify-between gap-5">
          <SectionHeader eyebrow="Каталог" title="Четыре направления техники" />
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[var(--ls-label)] text-accent"
          >
            Весь каталог
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
        <div className="grid gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex min-h-[226px] flex-col bg-bg p-[26px] transition-colors hover:bg-surface-2"
            >
              <Eyebrow accent className="mb-3.5 block">
                {cat.eyebrow}
              </Eyebrow>
              <h3
                className="mb-2.5 font-display uppercase text-text"
                style={{ fontSize: "var(--text-xl)", lineHeight: 1.04 }}
              >
                {cat.title}
              </h3>
              <p
                className="flex-1 text-sm text-text-muted"
                style={{ lineHeight: "var(--lh-normal)" }}
              >
                {cat.text}
              </p>
              <div className="mt-[18px] flex items-center justify-between">
                <span className="font-mono text-xs text-text-faint">{cat.price}</span>
                <ArrowRight className="size-[18px] text-accent" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* ── TRUST BAND ── */}
      <Surface mode="dark" className="relative overflow-hidden border-y border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(70% 120% at 84% 0%, rgba(225,21,7,.10), transparent 60%)",
          }}
        />
        <Container className="relative py-[clamp(48px,5vw,80px)]">
          <SectionHeader
            eyebrow="Почему NOVIK"
            title="Гарантия не на словах, а на стенде"
            className="mb-10 max-w-[18ch]"
          />
          <div className="grid gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {ADVANTAGES.map(({ Icon, title, text }) => (
              <div key={title}>
                <div className="mb-4 inline-flex size-[46px] items-center justify-center rounded-[var(--radius-md)] bg-accent text-on-accent">
                  <Icon className="size-[22px]" aria-hidden />
                </div>
                <h3
                  className="mb-2 font-display uppercase text-text"
                  style={{ fontSize: "var(--text-md)", lineHeight: "var(--lh-tight)" }}
                >
                  {title}
                </h3>
                <p className="text-sm text-text-muted" style={{ lineHeight: "var(--lh-normal)" }}>
                  {text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Surface>

      {/* ── FEATURED QM-400 ── */}
      <Container className="py-[clamp(52px,6vw,96px)]">
        <div className="grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-2">
          <div
            className="rounded-[var(--radius-lg)] bg-ivory p-[30px] shadow-[var(--shadow-3)]"
            style={{ background: "var(--nag-ivory-50)" }}
          >
            <Image
              src="/products/qm-400/nag-qm400-front-panel.jpg"
              alt="NAG QM-400 — передняя панель"
              width={600}
              height={360}
              className="h-auto w-full rounded-[var(--radius-sm)] object-cover"
            />
            <div className="mt-3.5 flex justify-between font-mono text-xs text-[#54545E]">
              <span>QM-400 · передняя панель</span>
              <span>483 × 463 × 88 мм · 17.3 кг</span>
            </div>
          </div>
          <div>
            <div className="mb-[18px] flex gap-2">
              <Badge>Флагман</Badge>
              <Badge className="bg-transparent border border-[var(--nag-green-500)] text-[var(--nag-green-500)]">
                EAC
              </Badge>
            </div>
            <Eyebrow className="mb-2.5 block">Усилитель мощности · Class-TD</Eyebrow>
            <h2
              className="mb-4 font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(36px,4.6vw,64px)",
                lineHeight: 0.96,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              NAG QM-400
            </h2>
            <p
              className="mb-[26px] max-w-[48ch] text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)" }}
            >
              Флагманский четырёхканальный усилитель. Четыре автономных канала — высокая надёжность;
              схемотехнически это четыре модуля TDS/TDH-20 в одном корпусе.
            </p>
            <div className="mb-7 grid grid-cols-3 gap-px overflow-hidden rounded-[var(--radius-md)] border border-border bg-border">
              {QM400_FEATURE_STATS.map((s) => (
                <div key={s.label} className="bg-bg p-4">
                  <div
                    className="font-display font-bold uppercase tabular-nums"
                    style={{
                      fontSize: "var(--text-2xl)",
                      lineHeight: 1,
                      color: s.accent ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {s.value}
                  </div>
                  <div className="mt-1.5 font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-[22px]">
              <div>
                <div
                  className="font-display font-bold uppercase tabular-nums text-text"
                  style={{ fontSize: "var(--text-3xl)", lineHeight: 1 }}
                >
                  от 285 000 ₽
                </div>
                <div className="mt-1.5 font-mono text-xs text-text-faint">
                  Без НДС · Гарантия 2 года · EAC
                </div>
              </div>
              <Link
                href="/catalog/qm-400"
                className={buttonVariants({ variant: "primary", size: "lg" })}
              >
                Открыть QM-400
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* ── HISTORY ── */}
      <section className="border-t border-border bg-surface py-[clamp(48px,5vw,84px)]">
        <Container>
          <div className="grid items-center gap-[clamp(28px,4vw,60px)] lg:grid-cols-[.85fr_1.15fr]">
            <div className="overflow-hidden rounded-[var(--radius-lg)] shadow-[var(--shadow-3)]">
              <Image
                src="/history/redbear-mk60.jpg"
                alt="RedBear — ламповое наследие NOVIK"
                width={560}
                height={420}
                className="aspect-[4/3] h-full w-full object-cover"
              />
            </div>
            <div>
              <Eyebrow className="mb-3.5 block">Компания · с 1976</Eyebrow>
              <h2
                className="mb-[18px] font-display font-bold uppercase text-text"
                style={{
                  fontSize: "clamp(30px,3.6vw,50px)",
                  lineHeight: 1,
                  letterSpacing: "var(--ls-tight)",
                }}
              >
                История NOVIK
              </h2>
              <p
                className="mb-7 max-w-[52ch] text-md text-text-muted"
                style={{ lineHeight: "var(--lh-relaxed)" }}
              >
                От первых ламповых усилителей Сергея Новикова и серии RedBear для Gibson — до бренда
                NOVIK и профессиональной линейки NAG. Сорок лет схемотехники, собранной в
                Санкт-Петербурге.
              </p>
              <Link href="/istoriya" className={buttonVariants({ variant: "outline" })}>
                Читать историю
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* ── CONTACT CTA ── */}
      <Surface mode="dark" className="relative overflow-hidden border-t border-border">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "radial-gradient(90% 130% at 18% 0%, rgba(225,21,7,.14), transparent 58%)",
          }}
        />
        <Container className="relative grid items-center gap-[clamp(28px,4vw,56px)] py-[clamp(52px,6vw,92px)] lg:grid-cols-[1.1fr_.9fr]">
          <div>
            <h2
              className="mb-[18px] font-display font-bold uppercase text-text"
              style={{
                fontSize: "clamp(30px,4vw,56px)",
                lineHeight: 0.98,
                letterSpacing: "var(--ls-tight)",
              }}
            >
              Подберём усилитель
              <br />
              под вашу задачу
            </h2>
            <p
              className="mb-7 max-w-[42ch] text-md text-text-muted"
              style={{ lineHeight: "var(--lh-relaxed)" }}
            >
              Звоните или пишите — поможем с подбором, расчётом и комплектацией под инсталляцию, тур
              или прокат.
            </p>
            <Link href="/catalog" className={buttonVariants({ variant: "primary", size: "lg" })}>
              Смотреть каталог
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="flex flex-col gap-px overflow-hidden rounded-[var(--radius-lg)] border border-border bg-border">
            <a
              href="tel:+79219372508"
              className="flex items-center gap-3.5 bg-surface px-[22px] py-[18px] transition-colors hover:bg-surface-2"
            >
              <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                Телефон
              </span>
              <span className="ml-auto font-mono text-md text-text">+7 921 937 25 08</span>
            </a>
            <a
              href="mailto:novikamps@mail.ru"
              className="flex items-center gap-3.5 bg-surface px-[22px] py-[18px] transition-colors hover:bg-surface-2"
            >
              <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                Почта
              </span>
              <span className="ml-auto font-mono text-md text-text">novikamps@mail.ru</span>
            </a>
            <div className="flex items-center gap-3.5 bg-surface px-[22px] py-[18px]">
              <span className="font-mono text-2xs uppercase tracking-[var(--ls-label)] text-text-faint">
                Адрес
              </span>
              <span className="ml-auto text-right text-sm text-text">
                Санкт-Петербург, Московское шоссе, 25 литера А, офис 216А
              </span>
            </div>
          </div>
        </Container>
      </Surface>
    </div>
  );
}
```

- [ ] **Step 2: Verify lucide icons exist**

Run: `node -e "const i=require('lucide-react'); ['ArrowRight','ShieldCheck','Activity','ShieldHalf','Wrench'].forEach(n=>{ if(!i[n]) throw new Error('missing '+n); }); console.log('icons ok')"`
Expected: `icons ok`. (If `ShieldHalf` is absent in the installed lucide version, substitute `Shield`; if `Activity` is absent, substitute `Zap` — and update the import + `ADVANTAGES`.)

- [ ] **Step 3: Run the production build**

Run: `npm run build`
Expected: build succeeds — typecheck + lint pass, `/` prerenders as static. No "window is not defined" / hydration errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx
git commit -m "feat(landing): rewrite homepage as variant 1a (dark chassis + 3D amp)"
```

---

### Task 5: Manual verification & cleanup

**Files:** none (verification only).

- [ ] **Step 1: Start dev server and inspect**

Run: `npm run dev`
Open `http://localhost:3000`. Confirm:
- Hero amp renders correctly and **rotates with the mouse**; idle drift when the mouse leaves.
- VU meters tick (segments change ~4×/sec), peak segments visible.
- Spec ticker scrolls; categories grid shows 4 hairline cells with correct prices (95 000 / 85 000 / 120 000 / 18 000).
- Dark bands (hero, trust, contact) render on the chassis palette; light bands (categories, featured, history) on paper.
- Featured QM-400 shows **от 285 000 ₽**; photo loads.
- All links resolve: `/catalog`, `/catalog/processors`, `/catalog/amplifiers`, `/catalog/tubes`, `/catalog/modules`, `/catalog/qm-400`, `/o-kompanii`, `/istoriya`.
- No console errors.

- [ ] **Step 2: Run the test suite + lint**

Run: `npx vitest run && npm run lint`
Expected: all tests pass; lint clean.

- [ ] **Step 3: Final commit (only if cleanup was needed)**

```bash
git add -A
git commit -m "chore(landing): verification fixes for 1a redesign"
```

---

## Notes for the implementer

- **`var(--ls-normal)` / `--lh-normal`:** used by the design; both are defined in `app/globals.css`. If `--lh-normal` is absent, substitute `var(--lh-relaxed)`.
- **`bg-surface-inset` / `--surface-inset`:** referenced by the existing `SpecTicker`; do not touch — reused as-is.
- **CSS custom-property typing:** the `["--kr" as string]: ...` cast on `style` objects is how this repo types CSS vars inline; TS strict accepts it. Keep the pattern.
- **Single amp instance:** only the hero renders `QM400Amp`, so its `<style>` in JSX needs no dedup guard. Do not add a second instance without converting the style to an id-guarded injection.
- The featured-card caption color `#54545E` and the ivory background `var(--nag-ivory-50)` come straight from the mockup (light photo plate on a fixed paper colour, independent of dark/light surface) — acceptable literal, matching the design.
```
