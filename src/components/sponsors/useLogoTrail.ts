import { useCallback, useRef, type RefObject } from "react";
import { gsap } from "../../lib/gsap";
import { pickLogo } from "./sponsorLogos";

const TILTS = [4, -7, 10, -3, 6, -11, 8, -5];

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
      const tilt = TILTS[index % TILTS.length] * (index % 2 ? -1 : 1);
      indexRef.current += 1;

      const card = document.createElement("div");
      card.textContent = logo.label;
      card.className =
        "pointer-events-none absolute border-2 border-[#201e1d] bg-[#f3f2f2] px-3.5 py-2 text-xs font-extrabold tracking-wide text-[#201e1d] uppercase whitespace-nowrap";
      card.style.left = `${event.clientX - rect.left}px`;
      card.style.top = `${event.clientY - rect.top}px`;
      card.style.boxShadow = "0 2px 10px -4px rgba(32,30,29,0.2)";
      container.appendChild(card);

      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.6, xPercent: -50, yPercent: -50, rotation: tilt },
        {
          opacity: 1,
          scale: 1,
          duration: 0.14,
          ease: "power2.out",
          onComplete: () => {
            gsap.to(card, {
              opacity: 0,
              scale: 0.86,
              duration: 0.34,
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
