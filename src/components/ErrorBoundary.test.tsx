import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./ErrorBoundary";

function Bomb(): never {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // React logs the caught error to console.error; this is expected noise
    // for this test, not a real warning, so we suppress it here.
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("renders the fallback when a child throws during render", () => {
    render(
      <ErrorBoundary fallback={<p>Signup is temporarily unavailable.</p>}>
        <Bomb />
      </ErrorBoundary>
    );
    expect(screen.getByText(/signup is temporarily unavailable/i)).toBeInTheDocument();
  });

  it("renders children normally when nothing throws", () => {
    render(
      <ErrorBoundary fallback={<p>Fallback</p>}>
        <p>All good</p>
      </ErrorBoundary>
    );
    expect(screen.getByText("All good")).toBeInTheDocument();
    expect(screen.queryByText("Fallback")).not.toBeInTheDocument();
  });

  it("recovers when the function-fallback's reset is called", async () => {
    const { rerender } = render(
      <ErrorBoundary fallback={(reset) => <button onClick={reset}>Retry</button>}>
        <Bomb />
      </ErrorBoundary>
    );
    const retryButton = screen.getByRole("button", { name: /retry/i });

    // Swap in a non-throwing child before triggering reset, mirroring how a
    // real caller would fix the underlying error before letting the user retry.
    rerender(
      <ErrorBoundary fallback={(reset) => <button onClick={reset}>Retry</button>}>
        <p>Recovered</p>
      </ErrorBoundary>
    );
    retryButton.click();

    expect(await screen.findByText("Recovered")).toBeInTheDocument();
  });
});
