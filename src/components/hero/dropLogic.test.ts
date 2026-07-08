import { describe, expect, it } from "vitest";
import { findDropZone, rectsOverlap, slotPosition, type Rect } from "./dropLogic";

const rect = (left: number, top: number, width: number, height: number): Rect => ({
  left,
  top,
  right: left + width,
  bottom: top + height,
  width,
  height,
});

describe("rectsOverlap", () => {
  it("returns true when rects intersect", () => {
    expect(rectsOverlap(rect(0, 0, 10, 10), rect(5, 5, 10, 10))).toBe(true);
  });

  it("returns false when rects don't intersect", () => {
    expect(rectsOverlap(rect(0, 0, 10, 10), rect(20, 20, 10, 10))).toBe(false);
  });
});

describe("findDropZone", () => {
  it("returns the id of the overlapping zone", () => {
    const zoneRects = {
      who: rect(0, 0, 100, 100),
      "qr-connect": rect(200, 0, 100, 100),
      "live-feed": rect(400, 0, 100, 100),
      rewards: rect(600, 0, 100, 100),
    };
    expect(findDropZone(rect(210, 10, 20, 20), zoneRects)).toBe("qr-connect");
  });

  it("returns null when no zone overlaps", () => {
    const zoneRects = {
      who: rect(0, 0, 100, 100),
      "qr-connect": rect(200, 0, 100, 100),
      "live-feed": rect(400, 0, 100, 100),
      rewards: rect(600, 0, 100, 100),
    };
    expect(findDropZone(rect(1000, 1000, 20, 20), zoneRects)).toBeNull();
  });
});

describe("slotPosition", () => {
  it("centers slot 1 on the zone and offsets others", () => {
    const zoneRect = rect(0, 0, 100, 200);
    expect(slotPosition(zoneRect, 1)).toEqual({ x: 50, y: 40 });
    expect(slotPosition(zoneRect, 0).x).toBeLessThan(50);
    expect(slotPosition(zoneRect, 2).x).toBeGreaterThan(50);
  });
});
