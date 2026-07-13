import { useCallback, useRef, type RefObject } from "react";
import { gsap } from "../../lib/gsap";
import { pickLogo } from "./sponsorLogos";

const ROTATIONS = [-14, 9, -7, 15, -10, 6, -16, 11];

export function useLogoTrail(containerRef: RefObject<HTMLDivElement | null>) {
  const lastSpawnRef = useRef(0);
  const indexRef = useRef(0);

  return useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const now = performance.now();
      if (now - lastSpawnRef.current < 90) return;
      lastSpawnRef.current = now;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const index = indexRef.current;
      const logo = pickLogo(index);
      const rotation = ROTATIONS[index % ROTATIONS.length];
      indexRef.current += 1;

      const card = document.createElement("div");
      card.textContent = logo.label;
      card.className =
        "pointer-events-none absolute flex h-16 w-24 items-center justify-center rounded-md border border-gray-200 bg-white p-2 text-center text-[11px] font-semibold text-gray-800 shadow-lg";
      card.style.left = `${event.clientX - rect.left}px`;
      card.style.top = `${event.clientY - rect.top}px`;
      container.appendChild(card);

      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.7, rotation, xPercent: -50, yPercent: -50 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.12,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(card, {
              opacity: 0,
              scale: 0.85,
              duration: 0.5,
              delay: 0.2,
              ease: "power1.in",
              onComplete: () => card.remove(),
            });
          },
        }
      );
    },
    [containerRef]
  );
}
