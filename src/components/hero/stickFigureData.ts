export type Attire = "tie" | "dress";

export interface StickFigureDef {
  id: string;
  attire: Attire;
  flip: boolean;
  startXPercent: number;
  startYPercent: number;
}

// Conversation clusters — pairs and triads facing each other, attire mixed,
// so the crowd reads as people socializing rather than a random scatter.
const CLUSTERS: Array<Array<[number, number, Attire, boolean]>> = [
  [
    [30, 24, "tie", false],
    [37.5, 26, "dress", true],
  ],
  [
    [45, 19, "tie", false],
    [52.5, 21, "dress", true],
    [48, 33, "tie", false],
  ],
  [
    [63, 27, "dress", true],
    [56, 29, "tie", false],
  ],
  [
    [32, 47, "dress", false],
    [39.5, 49, "tie", true],
    [35, 60, "dress", true],
  ],
  [
    [55, 51, "tie", false],
    [62, 49, "dress", true],
    [58, 62, "tie", false],
  ],
];

export const STICK_FIGURES: StickFigureDef[] = CLUSTERS.flat().map(([x, y, attire, flip], i) => ({
  id: `figure-${i}`,
  attire,
  flip,
  startXPercent: x,
  startYPercent: y,
}));
