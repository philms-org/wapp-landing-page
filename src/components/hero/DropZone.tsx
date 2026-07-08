import type { ZoneDef } from "./zoneData";

interface DropZoneProps {
  zone: ZoneDef;
  isActive: boolean;
  valuePropVisible: boolean;
}

export function DropZone({ zone, isActive, valuePropVisible }: DropZoneProps) {
  return (
    <div
      data-zone-id={zone.id}
      className={`flex min-h-[160px] flex-1 flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors ${
        isActive ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]" : "border-white/20"
      }`}
    >
      <h3 className="font-bold uppercase tracking-wide text-white">{zone.title}</h3>
      {valuePropVisible && <p className="text-center text-sm text-cyan-400">{zone.valueProp}</p>}
    </div>
  );
}
