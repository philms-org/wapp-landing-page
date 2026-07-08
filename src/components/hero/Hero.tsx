import { STICK_FIGURES } from "./stickFigureData";
import { ZONES } from "./zoneData";
import { StickFigure } from "./StickFigure";
import { DropZone } from "./DropZone";

export function Hero() {
  return (
    <section className="relative px-6 py-12">
      <div className="relative h-64 w-full">
        {STICK_FIGURES.map((figure) => (
          <div
            key={figure.id}
            data-figure-id={figure.id}
            className="absolute"
            style={{ left: `${figure.startXPercent}%`, top: `${figure.startYPercent}%` }}
          >
            <StickFigure attire={figure.attire} />
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-4">
        {ZONES.map((zone) => (
          <DropZone key={zone.id} zone={zone} isActive={false} valuePropVisible={false} />
        ))}
      </div>
    </section>
  );
}
