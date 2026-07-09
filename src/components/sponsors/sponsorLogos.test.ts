import { describe, expect, it } from "vitest";
import { pickLogo, SPONSOR_LOGOS } from "./sponsorLogos";

describe("pickLogo", () => {
  it("cycles through the logo list", () => {
    expect(pickLogo(0)).toBe(SPONSOR_LOGOS[0]);
    expect(pickLogo(SPONSOR_LOGOS.length)).toBe(SPONSOR_LOGOS[0]);
    expect(pickLogo(SPONSOR_LOGOS.length + 2)).toBe(SPONSOR_LOGOS[2]);
  });
});
