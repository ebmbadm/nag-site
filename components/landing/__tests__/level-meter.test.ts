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
