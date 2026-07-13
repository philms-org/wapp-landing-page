import { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "../../lib/gsap";
import { STICK_FIGURES } from "./stickFigureData";
import { ZONES, type ZoneId } from "./zoneData";
import { StickFigure } from "./StickFigure";
import { DropZone } from "./DropZone";
import { findDropZone, slotPosition, type Rect } from "./dropLogic";

const CORNER_CLASSES: Record<ZoneId, string> = {
  who: "absolute left-4 top-4",
  "qr-connect": "absolute right-4 top-4",
  "live-feed": "absolute bottom-4 left-4",
  rewards: "absolute bottom-4 right-4",
};

function toRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
}

function playGesture(el: HTMLElement, zoneId: ZoneId) {
  const rightArm = el.querySelector<SVGLineElement>('[data-part="right-arm"]');
  if (!rightArm) return;

  switch (zoneId) {
    case "who":
      gsap.to(rightArm, { attr: { y2: 15 }, duration: 0.3, ease: "back.out(2)" });
      break;
    case "qr-connect":
      gsap.to(rightArm, { attr: { x2: 20, y2: 20 }, duration: 0.3, ease: "power2.out" });
      break;
    case "live-feed":
      gsap.fromTo(
        rightArm,
        { attr: { x2: 32, y2: 40 } },
        { attr: { x2: 30, y2: 30 }, duration: 0.25, yoyo: true, repeat: 1, ease: "power1.inOut" }
      );
      break;
    case "rewards":
      gsap.to(rightArm, { attr: { x2: 15, y2: 12 }, duration: 0.3, ease: "back.out(2)" });
      break;
  }
}

export function Hero() {
  const boundsRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const zoneRefs = useRef<Record<ZoneId, HTMLDivElement | null>>(
    {} as Record<ZoneId, HTMLDivElement | null>
  );
  const bobTweensRef = useRef<Record<string, gsap.core.Tween>>({});

  function startBob(figureId: string, el: HTMLElement, i: number) {
    bobTweensRef.current[figureId] = gsap.to(el, {
      y: "+=6",
      duration: 1.4 + (i % 3) * 0.2,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  }
  const [assignments, setAssignments] = useState<Record<string, ZoneId | null>>(() =>
    Object.fromEntries(STICK_FIGURES.map((f) => [f.id, null]))
  );
  const [occupants, setOccupants] = useState<Record<ZoneId, string[]>>(
    () => Object.fromEntries(ZONES.map((z) => [z.id, []])) as unknown as Record<ZoneId, string[]>
  );

  useEffect(() => {
    const draggables = STICK_FIGURES.map((figure, i) => {
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
                onComplete: () => startBob(figure.id, el, i),
              });
            } else {
              gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.4,
                ease: "power2.out",
                onComplete: () => startBob(figure.id, el, i),
              });
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

  useEffect(() => {
    STICK_FIGURES.forEach((figure, i) => {
      const el = figureRefs.current[figure.id];
      if (!el) return;
      startBob(figure.id, el, i);
    });

    return () => {
      Object.values(bobTweensRef.current).forEach((tween) => tween.kill());
    };
  }, []);

  const previousAssignments = useRef<Record<string, ZoneId | null>>({});

  useEffect(() => {
    STICK_FIGURES.forEach((figure) => {
      const zoneId = assignments[figure.id];
      const prevZoneId = previousAssignments.current[figure.id];
      if (zoneId && zoneId !== prevZoneId) {
        const el = figureRefs.current[figure.id];
        if (el) playGesture(el, zoneId);
      }
    });
    previousAssignments.current = assignments;
  }, [assignments]);

  return (
    <section className="relative px-6 py-12">
      <h2 className="mb-6 text-center text-xl font-semibold text-gray-900">
        Drag a stick figure to an area
      </h2>
      <div ref={boundsRef} className="relative h-[520px] w-full">
        {ZONES.map((zone) => (
          <div
            key={zone.id}
            ref={(el) => {
              zoneRefs.current[zone.id] = el;
            }}
            className={CORNER_CLASSES[zone.id]}
          >
            <DropZone
              zone={zone}
              isActive={occupants[zone.id].length > 0}
              valuePropVisible={occupants[zone.id].length > 0}
            />
          </div>
        ))}
        <div ref={stageRef} className="absolute inset-0">
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
      </div>
    </section>
  );
}
