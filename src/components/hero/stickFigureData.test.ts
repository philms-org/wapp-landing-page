import { describe, expect, it } from "vitest";
import { STICK_FIGURES } from "./stickFigureData";

describe("STICK_FIGURES", () => {
  it("has 13 figures: 7 tie, 6 dress", () => {
    expect(STICK_FIGURES).toHaveLength(13);
    expect(STICK_FIGURES.filter((f) => f.attire === "tie")).toHaveLength(7);
    expect(STICK_FIGURES.filter((f) => f.attire === "dress")).toHaveLength(6);
  });

  it("gives every figure a unique id", () => {
    const ids = new Set(STICK_FIGURES.map((f) => f.id));
    expect(ids.size).toBe(13);
  });
});
