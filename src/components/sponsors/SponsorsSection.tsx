import { useRef } from "react";
import { useLogoTrail } from "./useLogoTrail";

export function SponsorsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useLogoTrail(containerRef);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex h-64 items-center justify-center overflow-hidden bg-stone-50"
    >
      <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
        Engage sponsors like never before.
      </h2>
    </section>
  );
}
