import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
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
    const { container } = render(<AttendeeForm />);
    const input = screen.getByLabelText(/email address/i);
    await user.type(input, "not-an-email");
    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);
    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
    expect(submitLeadMock).not.toHaveBeenCalled();
  });

  it("submits a valid email and shows the thank-you state", async () => {
    const user = userEvent.setup();
    submitLeadMock.mockResolvedValue(undefined);
    const { container } = render(<AttendeeForm />);
    await user.type(screen.getByLabelText(/email address/i), "person@example.com");
    const form = container.querySelector("form");
    if (!form) throw new Error("Form not found");
    fireEvent.submit(form);
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledWith({
      email: "person@example.com",
      track: "attendee",
      role: null,
      source: "wap-landing",
    });
  });
});
