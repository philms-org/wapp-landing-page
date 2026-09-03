import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const submitLeadMock = vi.fn();

vi.mock("../../lib/leads", async () => {
  const actual = await vi.importActual<typeof import("../../lib/leads")>("../../lib/leads");
  return { ...actual, submitLead: submitLeadMock };
});

const { WaitlistForm } = await import("./WaitlistForm");

beforeEach(() => {
  submitLeadMock.mockReset();
});

describe("WaitlistForm", () => {
  it("shows an error for an invalid email and does not submit", async () => {
    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText(/work email/i), "not-an-email");
    await userEvent.click(screen.getByRole("button", { name: /get early access/i }));
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
    expect(submitLeadMock).not.toHaveBeenCalled();
  });

  it("defaults to the attendee track and shows the attendee button label", async () => {
    submitLeadMock.mockResolvedValue(undefined);
    render(<WaitlistForm />);
    await userEvent.type(screen.getByLabelText(/work email/i), "person@example.com");
    await userEvent.click(screen.getByRole("button", { name: /get early access/i }));
    expect(await screen.findByText(/you are on the list/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledWith({
      email: "person@example.com",
      track: "attendee",
      role: null,
      source: "wap-landing",
    });
  });

  it("submits an organizer role under the organizer track", async () => {
    submitLeadMock.mockResolvedValue(undefined);
    render(<WaitlistForm />);
    await userEvent.selectOptions(screen.getByLabelText(/^i am$/i), "event_owner");
    await userEvent.type(screen.getByLabelText(/work email/i), "owner@example.com");
    await userEvent.click(screen.getByRole("button", { name: /talk to us about your event/i }));
    expect(await screen.findByText(/you are on the list/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledWith({
      email: "owner@example.com",
      track: "organizer",
      role: "event_owner",
      source: "wap-landing",
    });
  });
});
