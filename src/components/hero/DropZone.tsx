import { memo } from "react";
import type { ZoneDef } from "./zoneData";

interface DropZoneProps {
  zone: ZoneDef;
  isActive: boolean;
  valuePropVisible: boolean;
}

export const DropZone = memo(function DropZone({ zone, isActive, valuePropVisible }: DropZoneProps) {
  return (
    <div
      data-zone-id={zone.id}
      className={`flex h-32 w-32 flex-col items-center justify-center gap-1 rounded-full p-4 text-center transition-all duration-300 sm:h-40 sm:w-40 ${
        isActive
          ? "bg-cyan-50 shadow-[0_0_50px_18px_rgba(34,211,238,0.35)]"
          : "bg-stone-50 shadow-[0_0_35px_12px_rgba(0,0,0,0.06)]"
      }`}
    >
      <h3 className="text-xs font-bold uppercase tracking-wide text-gray-900 sm:text-sm">
        {zone.title}
      </h3>
      {valuePropVisible && (
        <p className="text-[10px] text-cyan-700 sm:text-xs">{zone.valueProp}</p>
      )}
    </div>
  );
});
