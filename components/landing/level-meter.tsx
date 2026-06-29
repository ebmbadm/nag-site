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
