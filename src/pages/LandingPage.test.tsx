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
    expect(screen.getByText("Who")).toBeInTheDocument();
    expect(screen.getByText("Where")).toBeInTheDocument();
    expect(screen.getByText("What")).toBeInTheDocument();
    expect(screen.getByText("Why")).toBeInTheDocument();
    expect(screen.getByText("QR Connect")).toBeInTheDocument();
    expect(screen.getByText("Live Feed")).toBeInTheDocument();
    expect(screen.getByText("Rewards")).toBeInTheDocument();
    expect(screen.getByText(/engage sponsors like never before/i)).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /walk in knowing who is worth meeting/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /prove what your floor is worth/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /what owners get, signal by signal/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/life worth living well/i)).toBeInTheDocument();
  });
});
