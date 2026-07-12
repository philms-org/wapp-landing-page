import { beforeEach, describe, expect, it, vi } from "vitest";

const insertMock = vi.fn();

vi.mock("./supabase", () => ({
  getSupabaseClient: () => ({
    from: () => ({ insert: insertMock }),
  }),
}));

const { buildLeadPayload, submitLead } = await import("./leads");

beforeEach(() => {
  insertMock.mockReset();
});

describe("buildLeadPayload", () => {
  it("builds an attendee payload with a null role and the landing source", () => {
    expect(buildLeadPayload("person@example.com", "attendee", null)).toEqual({
      email: "person@example.com",
      track: "attendee",
      role: null,
      source: "wap-landing",
    });
  });

  it("trims whitespace from the email", () => {
    expect(buildLeadPayload("  person@example.com  ", "attendee", null).email).toBe(
      "person@example.com"
    );
  });
});

describe("submitLead", () => {
  it("inserts the payload and resolves when there is no error", async () => {
    insertMock.mockResolvedValue({ error: null });
    await expect(
      submitLead(buildLeadPayload("a@b.com", "organizer", "event_owner"))
    ).resolves.toBeUndefined();
    expect(insertMock).toHaveBeenCalledWith({
      email: "a@b.com",
      track: "organizer",
      role: "event_owner",
      source: "wap-landing",
    });
  });

  it("throws when Supabase returns an error", async () => {
    insertMock.mockResolvedValue({ error: { message: "insert failed" } });
    await expect(
      submitLead(buildLeadPayload("a@b.com", "attendee", null))
    ).rejects.toThrow("insert failed");
  });
});
