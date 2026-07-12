import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("../lib/leads", async () => {
  const actual = await vi.importActual<typeof import("../lib/leads")>("../lib/leads");
  return { ...actual, submitLead: vi.fn() };
});

const { LandingPage } = await import("./LandingPage");

describe("LandingPage", () => {
  it("renders every major section", () => {
    render(<LandingPage />);
    expect(screen.getByText("WHO")).toBeInTheDocument();
    expect(screen.getByText("QR Connect")).toBeInTheDocument();
    expect(screen.getByText("Live Feed")).toBeInTheDocument();
    expect(screen.getByText("Rewards")).toBeInTheDocument();
    expect(screen.getByText(/engage sponsors like never before/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /for attendees/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /for organizers/i })).toBeInTheDocument();
    expect(screen.getByText(/life worth living well/i)).toBeInTheDocument();
  });
});
