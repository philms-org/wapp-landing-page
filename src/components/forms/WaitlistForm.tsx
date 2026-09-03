import { useState, type FormEvent } from "react";
import { isValidOrganizerRole, type OrganizerRole } from "../../lib/validation";
import { useLeadForm } from "../../lib/useLeadForm";

type WaitlistRole = "attendee" | OrganizerRole;

const ROLE_OPTIONS: Array<{ value: WaitlistRole; label: string }> = [
  { value: "attendee", label: "An attendee" },
  { value: "event_owner", label: "An event owner" },
  { value: "location_owner", label: "A location owner" },
  { value: "organizer", label: "An organizer" },
  { value: "other", label: "Something else" },
];

export function WaitlistForm() {
  const [role, setRole] = useState<WaitlistRole>("attendee");
  const track = role === "attendee" ? "attendee" : "organizer";
  const { email, setEmail, error, status, submit } = useLeadForm(track);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submit(isValidOrganizerRole(role) ? role : null);
  }

  if (status === "done") {
    return (
      <div className="border-2 border-[#ec3013] p-6">
        <p className="m-0 mb-2 font-[Archivo] text-xl font-extrabold text-[#201e1d]">
          You are on the list.
        </p>
        <p className="m-0 text-[15px] text-[#444141]">We will email you when access opens.</p>
      </div>
    );
  }

  const buttonLabel =
    status === "submitting"
      ? "Sending…"
      : role === "attendee" || role === "other"
        ? "Get early access"
        : "Talk to us about your event";

  return (
    <form onSubmit={handleSubmit} noValidate className="grid max-w-[460px] gap-4">
      <div className="grid gap-1">
        <label htmlFor="w-role" className="text-sm font-semibold text-[#201e1d]">
          I am
        </label>
        <select
          id="w-role"
          value={role}
          onChange={(e) => setRole(e.target.value as WaitlistRole)}
          className="min-h-12 border-2 border-[#201e1d]/40 bg-white px-3 text-base text-[#201e1d]"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-1">
        <label htmlFor="w-email" className="text-sm font-semibold text-[#201e1d]">
          Work email
        </label>
        <input
          id="w-email"
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-12 border-2 border-[#201e1d]/40 bg-white px-3 text-base text-[#201e1d]"
        />
      </div>
      {error && <p className="m-0 text-sm text-[#ae1800]">{error}</p>}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-12 justify-self-start border-2 border-[#ec3013] bg-[#ec3013] px-[22px] py-3.5 text-left text-base font-extrabold tracking-wide text-white uppercase hover:border-[#ae1800] hover:bg-[#ae1800] disabled:opacity-60"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
