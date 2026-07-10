export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export const ORGANIZER_ROLES = ["event_owner", "location_owner", "organizer", "other"] as const;
export type OrganizerRole = (typeof ORGANIZER_ROLES)[number];

export function isValidOrganizerRole(value: string): value is OrganizerRole {
  return (ORGANIZER_ROLES as readonly string[]).includes(value);
}
