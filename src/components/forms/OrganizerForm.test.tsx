import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const submitLeadMock = vi.fn();

vi.mock("../../lib/leads", async () => {
  const actual = await vi.importActual<typeof import("../../lib/leads")>("../../lib/leads");
  return { ...actual, submitLead: submitLeadMock };
});

const { OrganizerForm } = await import("./OrganizerForm");

beforeEach(() => {
  cleanup();
  submitLeadMock.mockReset();
});

describe("OrganizerForm", () => {
  it("requires a role before submitting", async () => {
    render(<OrganizerForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), "owner@example.com");
    await userEvent.click(screen.getByRole("button", { name: /talk to us/i }));
    expect(await screen.findByText(/select your role/i)).toBeInTheDocument();
    expect(submitLeadMock).not.toHaveBeenCalled();
  });

  it("submits with email and role, and shows the thank-you state", async () => {
    submitLeadMock.mockResolvedValue(undefined);
    render(<OrganizerForm />);
    await userEvent.type(screen.getByLabelText(/email address/i), "owner@example.com");
    await userEvent.selectOptions(screen.getByLabelText(/your role/i), "event_owner");
    await userEvent.click(screen.getByRole("button", { name: /talk to us/i }));
    expect(await screen.findByText(/thanks/i)).toBeInTheDocument();
    expect(submitLeadMock).toHaveBeenCalledWith({
      email: "owner@example.com",
      track: "organizer",
      role: "event_owner",
      source: "wap-landing",
    });
  });
});
