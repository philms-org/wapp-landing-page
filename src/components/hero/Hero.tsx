import { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "../../lib/gsap";
import { STICK_FIGURES } from "./stickFigureData";
import { ZONES, type ZoneId } from "./zoneData";
import { StickFigure } from "./StickFigure";
import { DropZone } from "./DropZone";
import { findDropZone, slotPosition, type Rect } from "./dropLogic";

function toRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
}

export function Hero() {
  const boundsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const zoneRefs = useRef<Record<ZoneId, HTMLDivElement | null>>(
    {} as Record<ZoneId, HTMLDivElement | null>
  );
  const [_assignments, setAssignments] = useState<Record<string, ZoneId | null>>(() =>
    Object.fromEntries(STICK_FIGURES.map((f) => [f.id, null]))
  );
  const [occupants, setOccupants] = useState<Record<ZoneId, string[]>>(
    () => Object.fromEntries(ZONES.map((z) => [z.id, []])) as unknown as Record<ZoneId, string[]>
  );

  useEffect(() => {
    const draggables = STICK_FIGURES.map((figure) => {
      const el = figureRefs.current[figure.id];
      if (!el || !boundsRef.current) return null;

      const [instance] = Draggable.create(el, {
        bounds: boundsRef.current,
        onDragEnd() {
          const currentX = Number(gsap.getProperty(el, "x"));
          const currentY = Number(gsap.getProperty(el, "y"));
          const figureRect = toRect(el);
          const originLeft = figureRect.left - currentX;
          const originTop = figureRect.top - currentY;

          const zoneRects = Object.fromEntries(
            ZONES.map((z) => [z.id, toRect(zoneRefs.current[z.id]!)])
          ) as Record<ZoneId, Rect>;

          const hitZone = findDropZone(figureRect, zoneRects);

          setOccupants((prevOccupants) => {
            const cleared: Record<ZoneId, string[]> = Object.fromEntries(
              ZONES.map((z) => [z.id, prevOccupants[z.id].filter((id) => id !== figure.id)])
            ) as Record<ZoneId, string[]>;

            if (hitZone) {
              cleared[hitZone] = [...cleared[hitZone], figure.id];
              const slotIndex = cleared[hitZone].length - 1;
              const target = slotPosition(zoneRects[hitZone], slotIndex);
              gsap.to(el, {
                x: target.x - originLeft,
                y: target.y - originTop,
                duration: 0.4,
                ease: "power2.out",
              });
            } else {
              gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: "power2.out" });
            }

            return cleared;
          });

          setAssignments((prev) => ({ ...prev, [figure.id]: hitZone }));
        },
      });
      return instance;
    });

    return () => {
      draggables.forEach((d) => d?.kill());
    };
  }, []);

  return (
    <section className="relative px-6 py-12">
      <div ref={boundsRef} className="relative">
        <div ref={stageRef} className="relative h-64 w-full">
          {STICK_FIGURES.map((figure) => (
            <div
              key={figure.id}
              data-figure-id={figure.id}
              ref={(el) => {
                figureRefs.current[figure.id] = el;
              }}
              className="absolute cursor-grab active:cursor-grabbing"
              style={{ left: `${figure.startXPercent}%`, top: `${figure.startYPercent}%` }}
            >
              <StickFigure attire={figure.attire} />
            </div>
          ))}
        </div>
        <div className="mt-8 flex gap-4">
          {ZONES.map((zone) => (
            <div
              key={zone.id}
              ref={(el) => {
                zoneRefs.current[zone.id] = el;
              }}
            >
              <DropZone
                zone={zone}
                isActive={occupants[zone.id].length > 0}
                valuePropVisible={occupants[zone.id].length > 0}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
