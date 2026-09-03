import { memo } from "react";
import type { ZoneDef } from "./zoneData";

interface DropZoneProps {
  zone: ZoneDef;
  isActive: boolean;
}

export const DropZone = memo(function DropZone({ zone, isActive }: DropZoneProps) {
  return (
    <div
      data-zone-id={zone.id}
      className="w-[150px] pb-20 transition-shadow duration-300 sm:w-[208px]"
      style={{
        boxShadow: isActive
          ? "0 12px 30px -6px rgba(32,30,29,0.28)"
          : "0 2px 10px -4px rgba(32,30,29,0.14)",
      }}
    >
      <h3 className="m-0 text-xs font-extrabold tracking-wide text-[#201e1d] uppercase sm:text-sm">
        {zone.title}
      </h3>
      {zone.reveal && (
        <p
          className={`m-0 mt-1 text-xs font-extrabold tracking-wide text-[#ec3013] uppercase transition-opacity duration-300 ${
            isActive ? "opacity-100" : "opacity-0"
          }`}
        >
          {zone.reveal}
        </p>
      )}
      <p
        className={`m-0 mt-1.5 text-xs leading-snug text-[#ae1800] transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        {zone.caption}
      </p>
    </div>
  );
});
