import { useRef } from "react";
import { useLogoTrail } from "./useLogoTrail";

export function SponsorsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMouseMove = useLogoTrail(containerRef);

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative flex flex-col items-start overflow-hidden border-b-2 border-[#201e1d]/40 bg-[#f8f4f4] px-6 py-16 sm:px-14 sm:py-28"
    >
      <h2 className="pointer-events-none relative z-10 m-0 max-w-[24ch] font-[Archivo] text-[30px] leading-[1.02] font-extrabold tracking-[-0.03em] text-[#201e1d] sm:text-[46px] md:text-[56px]">
        Engage sponsors like never before.
      </h2>
      <p className="pointer-events-none relative z-10 m-0 mt-5 text-[13px] tracking-[0.14em] text-[#7d7979] uppercase">
        Move your cursor across this panel
      </p>
    </section>
  );
}
