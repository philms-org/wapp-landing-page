import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AttendeeForm } from "./AttendeeForm";
import * as leadsModule from "../../lib/leads";

const submitLeadMock = vi.spyOn(leadsModule, "submitLead");

beforeEach(() => {
  cleanup();
  submitLeadMock.mockClear();
});

describe("AttendeeForm", () => {
  it("shows an error for an invalid email and does not submit", async () => {
    const user = userEvent.setup();
    render(<AttendeeForm />);
    await user.type(screen.getByLabelText(/email address/i), "not-an-email");
    await user.click(screen.getByRole("button", { name: /get early access/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(submitLeadMock).not.toHaveBeenCalled();
  });

  it("submits a valid email and shows the thank-you state", async () => {
    const user = userEvent.setup();
    submitLeadMock.mockResolvedValue(undefined);
    render(<AttendeeForm />);
    await user.type(screen.getByLabelText(/email address/i), "person@example.com");
    await user.click(screen.getByRole("button", { name: /get early access/i }));
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledWith({
      email: "person@example.com",
      track: "attendee",
      role: null,
      source: "wap-landing",
    });
  });

  it("ignores a second submit fired before the first one resolves", async () => {
    const user = userEvent.setup();
    let resolveSubmit!: () => void;
    submitLeadMock.mockReturnValue(
      new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      })
    );
    render(<AttendeeForm />);
    await user.type(screen.getByLabelText(/email address/i), "person@example.com");
    const button = screen.getByRole("button", { name: /get early access/i });
    const form = button.closest("form")!;

    // Fire two submit events back-to-back, before React has re-rendered the
    // button as disabled — this is the race the submittingRef guard closes.
    form.requestSubmit();
    form.requestSubmit();

    resolveSubmit();
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledTimes(1);
  });
});
