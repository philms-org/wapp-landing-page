import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";
import { STICK_FIGURES } from "./stickFigureData";
import { ZONES } from "./zoneData";

describe("Hero", () => {
  it("renders all 13 stick figures and all 4 zone titles", () => {
    render(<Hero />);
    expect(document.querySelectorAll("[data-figure-id]")).toHaveLength(STICK_FIGURES.length);
    ZONES.forEach((zone) => {
      expect(screen.getByText(zone.title)).toBeInTheDocument();
    });
  });
});
