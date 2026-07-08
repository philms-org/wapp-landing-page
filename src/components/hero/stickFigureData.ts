export type Attire = "tie" | "dress";

export interface StickFigureDef {
  id: string;
  attire: Attire;
  startXPercent: number;
  startYPercent: number;
}

const TIE_COUNT = 7;
const DRESS_COUNT = 6;
const TOTAL = TIE_COUNT + DRESS_COUNT;
const COLUMNS = 7;

function scatterPosition(index: number): { startXPercent: number; startYPercent: number } {
  const row = Math.floor(index / COLUMNS);
  const col = index % COLUMNS;
  const jitterX = ((index * 37) % 10) - 5;
  const jitterY = ((index * 53) % 10) - 5;
  return {
    startXPercent: 6 + col * 13 + jitterX,
    startYPercent: 8 + row * 24 + jitterY,
  };
}

export const STICK_FIGURES: StickFigureDef[] = Array.from({ length: TOTAL }, (_, i) => ({
  id: `figure-${i}`,
  attire: i < TIE_COUNT ? "tie" : "dress",
  ...scatterPosition(i),
}));
