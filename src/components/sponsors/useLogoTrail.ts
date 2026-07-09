import { useCallback, useRef, type RefObject } from "react";
import { gsap } from "../../lib/gsap";
import { pickLogo } from "./sponsorLogos";

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
      const logo = pickLogo(indexRef.current);
      indexRef.current += 1;

      const badge = document.createElement("div");
      badge.textContent = logo.label;
      badge.className =
        "pointer-events-none absolute rounded-full border border-cyan-400/60 bg-black/80 px-3 py-1 text-xs font-semibold text-cyan-300";
      badge.style.left = `${event.clientX - rect.left}px`;
      badge.style.top = `${event.clientY - rect.top}px`;
      container.appendChild(badge);

      gsap.fromTo(
        badge,
        { opacity: 1, scale: 1 },
        {
          opacity: 0,
          scale: 0.6,
          duration: 1,
          ease: "power1.out",
          onComplete: () => badge.remove(),
        }
      );
    },
    [containerRef]
  );
}
