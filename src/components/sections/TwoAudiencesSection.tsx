const ATTENDEE_POINTS = [
  "The room list, filtered by company, role and what people came for.",
  "One-tap QR exchange — contacts land in your phone, not a lanyard pile.",
  "Reconnect prompts for people you met at last year's event.",
  "Perks and status that grow the more you actually show up.",
];

const OWNER_POINTS = [
  "Foot traffic and dwell by zone, hall and hour — no beacons to install.",
  "Connections made on site, and how many were repeat reconnections.",
  "Sponsor engagement attributed to the booth, session or activation.",
  "Check-ins, rewards and the live feed run from one admin portal.",
];

export function TwoAudiencesSection() {
  return (
    <section id="attendees" className="grid border-b-2 border-[#201e1d]/40 sm:grid-cols-2">
      <div className="border-b-2 border-[#201e1d]/40 px-6 py-9 sm:border-r-2 sm:border-b-0 sm:px-14 sm:py-16">
        <p className="m-0 mb-3 text-xs tracking-[0.16em] text-[#ae1800] uppercase">
          For attendees
        </p>
        <h2 className="m-0 mb-5 max-w-[22ch] font-[Archivo] text-[28px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[#201e1d] sm:text-[36px] md:text-[44px]">
          Walk in knowing who is worth meeting.
        </h2>
        <div className="grid border-t-2 border-[#201e1d]/40">
          {ATTENDEE_POINTS.map((point) => (
            <p
              key={point}
              className="m-0 border-b border-[#d7d3d3] py-3.5 text-base leading-[1.45] text-[#201e1d] last:border-b-0"
            >
              {point}
            </p>
          ))}
        </div>
        <a
          href="#waitlist"
          className="mt-6 inline-block border-2 border-[#ec3013] bg-[#ec3013] px-5 py-3 text-[15px] font-extrabold tracking-wide text-white uppercase hover:bg-[#ae1800] hover:border-[#ae1800]"
        >
          Join the waitlist
        </a>
      </div>
      <div id="owners" className="px-6 py-9 sm:px-14 sm:py-16">
        <p className="m-0 mb-3 text-xs tracking-[0.16em] text-[#ae1800] uppercase">
          For event &amp; venue owners
        </p>
        <h2 className="m-0 mb-5 max-w-[22ch] font-[Archivo] text-[28px] leading-[1.05] font-extrabold tracking-[-0.02em] text-[#201e1d] sm:text-[36px] md:text-[44px]">
          Prove what your floor is worth.
        </h2>
        <div className="grid border-t-2 border-[#201e1d]/40">
          {OWNER_POINTS.map((point) => (
            <p
              key={point}
              className="m-0 border-b border-[#d7d3d3] py-3.5 text-base leading-[1.45] text-[#201e1d] last:border-b-0"
            >
              {point}
            </p>
          ))}
        </div>
        <a
          href="#waitlist"
          className="mt-6 inline-block border-2 border-[#201e1d] px-5 py-3 text-[15px] font-extrabold tracking-wide text-[#201e1d] uppercase hover:bg-[#201e1d] hover:text-white"
        >
          Onboard your event
        </a>
      </div>
    </section>
  );
}
