import { getSupabaseClient } from "./supabase";
import type { OrganizerRole } from "./validation";

export type Track = "attendee" | "organizer";

export interface LeadPayload {
  email: string;
  track: Track;
  role: OrganizerRole | null;
  source: string;
}

export function buildLeadPayload(
  email: string,
  track: Track,
  role: OrganizerRole | null
): LeadPayload {
  return { email: email.trim(), track, role, source: "wap-landing" };
}

export async function submitLead(payload: LeadPayload): Promise<void> {
  const { error } = await getSupabaseClient().from("leads").insert(payload);
  if (error) {
    throw new Error(error.message);
  }
}
