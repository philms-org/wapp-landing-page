import type { Attire } from "./stickFigureData";

interface StickFigureProps {
  attire: Attire;
}

export function StickFigure({ attire }: StickFigureProps) {
  return (
    <svg viewBox="0 0 40 80" width={40} height={80} className="overflow-visible">
      <circle cx="20" cy="10" r="8" fill="none" stroke="white" strokeWidth="2" />
      <line x1="20" y1="18" x2="20" y2="50" stroke="white" strokeWidth="2" />
      <line data-part="left-arm" x1="20" y1="25" x2="8" y2="40" stroke="white" strokeWidth="2" />
      <line data-part="right-arm" x1="20" y1="25" x2="32" y2="40" stroke="white" strokeWidth="2" />
      {attire === "tie" ? (
        <>
          <line x1="10" y1="50" x2="20" y2="75" stroke="white" strokeWidth="2" />
          <line x1="30" y1="50" x2="20" y2="75" stroke="white" strokeWidth="2" />
          <polygon points="17,20 23,20 20,32" fill="#22d3ee" />
        </>
      ) : (
        <polygon points="10,50 30,50 24,75 16,75" fill="none" stroke="white" strokeWidth="2" />
      )}
    </svg>
  );
}
