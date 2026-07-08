import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

describe("App", () => {
  it("renders the placeholder", () => {
    render(<App />);
    expect(screen.getByText("The W App")).toBeInTheDocument();
  });
});
