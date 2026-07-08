import type { ZoneId } from "./zoneData";

export interface Rect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

export function rectsOverlap(a: Rect, b: Rect): boolean {
  return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
}

export function findDropZone(
  figureRect: Rect,
  zoneRects: Record<ZoneId, Rect>
): ZoneId | null {
  const entries = Object.entries(zoneRects) as [ZoneId, Rect][];
  for (const [zoneId, rect] of entries) {
    if (rectsOverlap(figureRect, rect)) {
      return zoneId;
    }
  }
  return null;
}

export function slotPosition(zoneRect: Rect, slotIndex: number): { x: number; y: number } {
  const spacing = 28;
  return {
    x: zoneRect.left + zoneRect.width / 2 + (slotIndex - 1) * spacing,
    y: zoneRect.top + 40,
  };
}
