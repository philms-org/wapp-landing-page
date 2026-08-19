import { memo } from "react";
import type { Attire } from "./stickFigureData";

interface StickFigureProps {
  attire: Attire;
  flip?: boolean;
}

const INK = "#2d2b2b";
const DRESS_ACCENT = "#4B9CD3";

const ARM_STYLE_LEFT = { transformBox: "fill-box" as const, transformOrigin: "100% 0%" };
const ARM_STYLE_RIGHT = { transformBox: "fill-box" as const, transformOrigin: "0% 0%" };

export const StickFigure = memo(function StickFigure({ attire, flip }: StickFigureProps) {
  return (
    <svg
      width={40}
      height={80}
      viewBox="0 0 40 80"
      fill="none"
      className="block overflow-visible"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <circle cx="20" cy="9" r="7.5" fill={INK} />
      {attire === "tie" ? (
        <>
          <polygon points="13,19 27,19 26,45 14,45" fill={INK} />
          <polygon
            data-part="left-arm"
            points="13,20 10,20 7,40 10,41"
            fill={INK}
            style={ARM_STYLE_LEFT}
          />
          <polygon
            data-part="right-arm"
            points="27,19 29,23 36,15 33.5,11.5"
            fill={INK}
            style={ARM_STYLE_RIGHT}
          />
          <polygon points="14,45 19,45 19,74 14,74" fill={INK} />
          <polygon points="21,45 26,45 26,74 21,74" fill={INK} />
          <polygon points="13.5,19 26.5,19 20,29" fill="#ffffff" />
        </>
      ) : (
        <>
          <polygon points="14,19 26,19 32,52 8,52" fill={INK} />
          <polygon
            data-part="left-arm"
            points="14,20 11,20 6,40 9,41"
            fill={INK}
            style={ARM_STYLE_LEFT}
          />
          <polygon
            data-part="right-arm"
            points="26,19 28.5,23 35,16 32.5,12.5"
            fill={INK}
            style={ARM_STYLE_RIGHT}
          />
          <polygon points="16,52 19,52 19,74 16,74" fill={INK} />
          <polygon points="21,52 24,52 24,74 21,74" fill={INK} />
          <polygon points="13.5,33 26.5,33 28,38 12,38" fill={DRESS_ACCENT} />
        </>
      )}
    </svg>
  );
});
