import { useEffect, useRef, useState } from "react";
import { gsap, Draggable } from "../../lib/gsap";
import { STICK_FIGURES } from "./stickFigureData";
import { ZONES, type ZoneId } from "./zoneData";
import { StickFigure } from "./StickFigure";
import { DropZone } from "./DropZone";
import { findDropZone, type Rect } from "./dropLogic";

const CORNER_CLASSES: Record<ZoneId, string> = {
  who: "absolute left-4 top-4",
  "qr-connect": "absolute right-4 top-4",
  "live-feed": "absolute bottom-4 left-4",
  rewards: "absolute bottom-4 right-4",
};

// Right-arm rotation per zone on drop. `hold` zones keep the pose;
// live-feed springs back through the gesture a few times before settling.
const GESTURE: Record<ZoneId, { deg: number; hold: boolean }> = {
  who: { deg: -68, hold: true },
  "qr-connect": { deg: -14, hold: true },
  "live-feed": { deg: -40, hold: false },
  rewards: { deg: -95, hold: true },
};

function toRect(el: Element): Rect {
  const r = el.getBoundingClientRect();
  return { left: r.left, top: r.top, right: r.right, bottom: r.bottom, width: r.width, height: r.height };
}

function playGesture(el: HTMLElement, zoneId: ZoneId) {
  const rightArm = el.querySelector<SVGPolygonElement>('[data-part="right-arm"]');
  const g = GESTURE[zoneId];
  if (!rightArm || !g) return;

  if (g.hold) {
    gsap.to(rightArm, { rotation: g.deg, duration: 0.3, ease: "back.out(2)" });
  } else {
    gsap.fromTo(
      rightArm,
      { rotation: 0 },
      { rotation: g.deg, duration: 0.26, yoyo: true, repeat: 3, ease: "power1.inOut" }
    );
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
  const figureRefSettersRef = useRef<Record<string, (el: HTMLDivElement | null) => void>>({});
  const zoneRefSettersRef = useRef<Record<string, (el: HTMLDivElement | null) => void>>({});

  function getFigureRefSetter(figureId: string) {
    let setter = figureRefSettersRef.current[figureId];
    if (!setter) {
      setter = (el) => {
        figureRefs.current[figureId] = el;
      };
      figureRefSettersRef.current[figureId] = setter;
    }
    return setter;
  }

  function getZoneRefSetter(zoneId: ZoneId) {
    let setter = zoneRefSettersRef.current[zoneId];
    if (!setter) {
      setter = (el) => {
        zoneRefs.current[zoneId] = el;
      };
      zoneRefSettersRef.current[zoneId] = setter;
    }
    return setter;
  }

  function startBob(figureId: string, el: HTMLElement, i: number) {
    bobTweensRef.current[figureId]?.kill();
    bobTweensRef.current[figureId] = gsap.to(el, {
      y: "+=6",
      duration: 1.4 + (i % 3) * 0.2,
      delay: (i % 5) * 0.18,
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
        onDragStart() {
          bobTweensRef.current[figure.id]?.kill();
          const leftArm = el.querySelector('[data-part="left-arm"]');
          const rightArm = el.querySelector('[data-part="right-arm"]');
          if (leftArm) gsap.to(leftArm, { rotation: 120, duration: 0.15 });
          if (rightArm) gsap.to(rightArm, { rotation: -120, duration: 0.15 });
        },
        onDragEnd() {
          const figureRect = toRect(el);

          const zoneRects = Object.fromEntries(
            ZONES.map((z) => [z.id, toRect(zoneRefs.current[z.id]!)])
          ) as Record<ZoneId, Rect>;

          const hitZone = findDropZone(figureRect, zoneRects);

          const leftArm = el.querySelector('[data-part="left-arm"]');
          const rightArm = el.querySelector('[data-part="right-arm"]');
          if (leftArm) gsap.to(leftArm, { rotation: 0, duration: 0.2 });
          if (!hitZone && rightArm) gsap.to(rightArm, { rotation: 0, duration: 0.2 });

          setOccupants((prevOccupants) => {
            const cleared: Record<ZoneId, string[]> = Object.fromEntries(
              ZONES.map((z) => [z.id, prevOccupants[z.id].filter((id) => id !== figure.id)])
            ) as Record<ZoneId, string[]>;

            if (hitZone) {
              // Leave the figure exactly where it was dropped — no snapping
              // to a computed slot, so it can't land on top of the caption.
              cleared[hitZone] = [...cleared[hitZone], figure.id];
              startBob(figure.id, el, i);
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
    <section id="top" className="border-b-2 border-[#201e1d]/40">
      <div className="max-w-[1320px] px-6 pt-16 pb-8 sm:px-10 sm:pt-24 md:px-14 md:pt-28">
        <p className="m-0 mb-6 text-[13px] tracking-[0.16em] text-[#ae1800] uppercase sm:mb-9">
          Conferences · Expos · High-traffic venues
        </p>
        <h1 className="m-0 max-w-[15ch] font-[Archivo] text-[42px] leading-[0.94] font-extrabold tracking-[-0.035em] text-[#201e1d] sm:text-[64px] md:text-[80px] lg:text-[108px]">
          Every room is a network.
        </h1>
        <h1 className="m-0 max-w-[15ch] font-[Archivo] text-[42px] leading-[0.94] font-extrabold tracking-[-0.035em] text-[#ec3013] sm:text-[64px] md:text-[80px] lg:text-[108px]">
          W makes it legible.
        </h1>
        <p className="m-0 mt-6 max-w-[62ch] text-[17px] leading-[1.5] text-[#444141] sm:mt-9 sm:text-[21px]">
          Attendees see who is already in the room and trade contacts in one tap. Event and venue
          owners see the traffic, the reconnections and the sponsor value behind the door count —
          from the same floor, in real time.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 sm:mt-10">
          <a
            href="#waitlist"
            className="border-2 border-[#ec3013] bg-[#ec3013] px-[22px] py-3.5 text-[15px] font-extrabold tracking-wide text-white uppercase hover:bg-[#ae1800] hover:border-[#ae1800]"
          >
            Join the waitlist
          </a>
          <a
            href="#owners"
            className="border-2 border-[#201e1d] px-[22px] py-3.5 text-[15px] font-extrabold tracking-wide text-[#201e1d] uppercase hover:bg-[#201e1d] hover:text-white"
          >
            Onboard your event
          </a>
        </div>
        <p className="m-0 mt-4 text-[13px] text-[#7d7979]">
          Free through beta · iOS, Android and web · No hardware to install
        </p>
      </div>
      <div
        ref={boundsRef}
        className="relative h-[520px] w-full border-t-2 border-[#201e1d]/40 bg-[#f3f2f2] select-none"
      >
        {ZONES.map((zone) => (
          <div key={zone.id} ref={getZoneRefSetter(zone.id)} className={CORNER_CLASSES[zone.id]}>
            <DropZone zone={zone} isActive={occupants[zone.id].length > 0} />
          </div>
        ))}
        <p className="pointer-events-none absolute top-7 left-1/2 z-10 m-0 -translate-x-1/2 text-center text-xs tracking-[0.16em] text-[#7d7979] uppercase">
          Drag someone into a corner area
        </p>
        <div ref={stageRef} className="absolute inset-0">
          {STICK_FIGURES.map((figure) => (
            <div
              key={figure.id}
              data-figure-id={figure.id}
              ref={getFigureRefSetter(figure.id)}
              className="absolute cursor-grab touch-none active:cursor-grabbing"
              style={{ left: `${figure.startXPercent}%`, top: `${figure.startYPercent}%` }}
            >
              <StickFigure attire={figure.attire} flip={figure.flip} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
