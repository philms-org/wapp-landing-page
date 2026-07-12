import { describe, it, vi } from "vitest";
import { render } from "@testing-library/react";

vi.mock("./lib/leads", async () => {
  const actual = await vi.importActual<typeof import("./lib/leads")>("./lib/leads");
  return { ...actual, submitLead: vi.fn() };
});

const { App } = await import("./App");

describe("App", () => {
  it("renders without crashing", () => {
    render(<App />);
  });
});
