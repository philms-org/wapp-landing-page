import { useState, type FormEvent } from "react";
import { isValidOrganizerRole, type OrganizerRole } from "../../lib/validation";
import { useLeadForm } from "../../lib/useLeadForm";

type HeroBRole = "attendee" | OrganizerRole;

const ROLE_OPTIONS: Array<{ value: HeroBRole; label: string }> = [
  { value: "attendee", label: "I attend events" },
  { value: "event_owner", label: "I own an event" },
  { value: "location_owner", label: "I own a venue" },
  { value: "organizer", label: "I organize events" },
];

const ROOM = [
  { name: "Dana Okonkwo", role: "Head of Partnerships · Meridian", tag: "2 mutual" },
  { name: "Ravi Menon", role: "Founder · Sable Logistics", tag: "Met last year" },
  { name: "Alina Prokop", role: "Buyer · Northline Group", tag: "Looking to buy" },
];

const TRAFFIC = [
  { zone: "Main stage", pct: 88 },
  { zone: "Expo floor", pct: 64 },
  { zone: "Sponsor row", pct: 41 },
  { zone: "Lounge", pct: 27 },
];

function HeroBForm() {
  const [role, setRole] = useState<HeroBRole>("attendee");
  const track = role === "attendee" ? "attendee" : "organizer";
  const { email, setEmail, error, status, submit } = useLeadForm(track);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    void submit(isValidOrganizerRole(role) ? role : null);
  }

  if (status === "done") {
    return (
      <p className="m-0 border-2 border-[#ec3013] p-4 font-semibold text-[#ae1800]">
        You are on the list. We will be in touch before your next event.
      </p>
    );
  }

  const buttonLabel =
    status === "submitting" ? "Sending…" : role === "attendee" ? "Get early access" : "Onboard my event";

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 grid max-w-[460px] gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="email"
          placeholder="you@company.com"
          aria-label="Work email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-12 border-2 border-[#201e1d]/40 bg-white px-3 text-base text-[#201e1d]"
        />
        <select
          aria-label="I am"
          value={role}
          onChange={(e) => setRole(e.target.value as HeroBRole)}
          className="min-h-12 border-2 border-[#201e1d]/40 bg-white px-3 text-base text-[#201e1d]"
        >
          {ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={status === "submitting"}
        className="min-h-12 justify-self-start border-2 border-[#ec3013] bg-[#ec3013] px-[22px] py-3.5 text-left text-base font-extrabold tracking-wide text-white uppercase hover:border-[#ae1800] hover:bg-[#ae1800] disabled:opacity-60"
      >
        {buttonLabel}
      </button>
      {error && <p className="m-0 text-sm text-[#ae1800]">{error}</p>}
      <p className="m-0 text-[13px] text-[#7d7979]">
        Free through beta · One email, no sequence · Owners get a 3-minute onboarding link
      </p>
    </form>
  );
}

export function HeroB() {
  return (
    <section id="top" className="grid border-b-2 border-[#201e1d]/40 sm:grid-cols-2">
      <div className="border-b-2 border-[#201e1d]/40 px-6 py-10 sm:border-r-2 sm:border-b-0 sm:px-14 sm:py-20">
        <p className="m-0 mb-6 text-[13px] tracking-[0.16em] text-[#ae1800] uppercase">
          Conferences · Expos · High-traffic venues
        </p>
        <h1 className="m-0 max-w-[20ch] font-[Archivo] text-[38px] leading-[1] font-extrabold tracking-[-0.03em] text-[#201e1d] sm:text-[52px] md:text-[68px]">
          The room, measured. The people, introduced.
        </h1>
        <p className="m-0 mt-6 max-w-[52ch] text-[17px] leading-[1.5] text-[#444141]">
          W gives attendees a one-tap way to meet the right people, and gives event and venue
          owners the foot traffic, reconnection and sponsor data the badge scan never captured.
        </p>
        <HeroBForm />
      </div>
      <div className="grid content-start gap-6 bg-[#f8f4f4] px-6 py-8 sm:px-10 sm:py-12">
        <div className="border-2 border-[#201e1d] bg-[#f3f2f2]">
          <div className="flex items-baseline justify-between gap-3 border-b-2 border-[#201e1d] px-4 py-3.5">
            <span className="font-[Archivo] text-[13px] font-extrabold tracking-[0.14em] text-[#201e1d] uppercase">
              In the room · Hall C
            </span>
            <span className="text-[13px] text-[#ae1800]">184 live</span>
          </div>
          {ROOM.map((person, i) => (
            <div
              key={person.name}
              className={`flex items-center justify-between gap-3 px-4 py-3 ${
                i < ROOM.length - 1 ? "border-b border-[#d7d3d3]" : "border-b-2 border-[#201e1d]"
              }`}
            >
              <div>
                <p className="m-0 text-[15px] font-semibold text-[#201e1d]">{person.name}</p>
                <p className="m-0 mt-0.5 text-[13px] text-[#605d5d]">{person.role}</p>
              </div>
              <span className="border border-[#201e1d]/40 px-2 py-1 text-xs whitespace-nowrap text-[#605d5d]">
                {person.tag}
              </span>
            </div>
          ))}
          <div className="px-4 py-3 text-[13px] tracking-[0.08em] text-[#605d5d] uppercase">
            QR Connect · one tap to trade contacts
          </div>
        </div>
        <div className="border-2 border-[#201e1d]/40 p-4">
          <p className="m-0 mb-3.5 text-xs tracking-[0.14em] text-[#605d5d] uppercase">
            Foot traffic by zone · owner view
          </p>
          <div className="grid gap-2.5">
            {TRAFFIC.map((row) => (
              <div key={row.zone} className="grid grid-cols-[92px_1fr_auto] items-center gap-2.5 text-[13px]">
                <span className="text-[#201e1d]">{row.zone}</span>
                <span
                  className={`h-2.5 ${row.pct >= 60 ? "bg-[#ec3013]" : "bg-[#bab6b6]"}`}
                  style={{ width: `${row.pct}%` }}
                />
                <span className="text-[#605d5d]">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
