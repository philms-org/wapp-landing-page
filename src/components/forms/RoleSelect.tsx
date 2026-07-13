import { ORGANIZER_ROLES, type OrganizerRole } from "../../lib/validation";

const ROLE_LABELS: Record<OrganizerRole, string> = {
  event_owner: "Event Owner",
  location_owner: "Location Owner",
  organizer: "Organizer",
  other: "Other",
};

interface RoleSelectProps {
  value: OrganizerRole | "";
  onChange: (value: OrganizerRole | "") => void;
}

export function RoleSelect({ value, onChange }: RoleSelectProps) {
  return (
    <select
      aria-label="Your role"
      value={value}
      onChange={(e) => onChange(e.target.value as OrganizerRole | "")}
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900"
    >
      <option value="">Select your role</option>
      {ORGANIZER_ROLES.map((role) => (
        <option key={role} value={role}>
          {ROLE_LABELS[role]}
        </option>
      ))}
    </select>
  );
}
