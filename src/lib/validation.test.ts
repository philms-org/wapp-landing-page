import { describe, expect, it } from "vitest";
import { isValidEmail, isValidOrganizerRole, ORGANIZER_ROLES } from "./validation";

describe("isValidEmail", () => {
  it("accepts a well-formed email", () => {
    expect(isValidEmail("person@example.com")).toBe(true);
  });

  it("rejects a string with no @", () => {
    expect(isValidEmail("not-an-email")).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(isValidEmail("")).toBe(false);
  });
});

describe("isValidOrganizerRole", () => {
  it("accepts every role in ORGANIZER_ROLES", () => {
    ORGANIZER_ROLES.forEach((role) => expect(isValidOrganizerRole(role)).toBe(true));
  });

  it("rejects an unknown role", () => {
    expect(isValidOrganizerRole("astronaut")).toBe(false);
  });
});
