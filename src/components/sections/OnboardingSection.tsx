export function OnboardingSection() {
  return (
    <section className="grid border-b-2 border-[#201e1d]/40 sm:grid-cols-2">
      <div
        aria-hidden="true"
        className="min-h-[240px] sm:min-h-[320px]"
        style={{
          background:
            "repeating-linear-gradient(135deg, #bab6b6 0px, #bab6b6 2px, #d7d3d3 2px, #d7d3d3 22px)",
          filter: "grayscale(1)",
        }}
      />
      <div className="grid content-center gap-4 border-t-2 border-[#201e1d]/40 px-6 py-9 sm:border-t-0 sm:border-l-2 sm:px-14 sm:py-16">
        <p className="m-0 text-xs tracking-[0.16em] text-[#ae1800] uppercase">
          Three minutes to onboard
        </p>
        <h2 className="m-0 max-w-[24ch] font-[Archivo] text-[26px] leading-[1.08] font-extrabold tracking-[-0.02em] text-[#201e1d] sm:text-[32px] md:text-[40px]">
          Name the event, draw the zones, share the join code.
        </h2>
        <p className="m-0 max-w-[52ch] text-base leading-[1.5] text-[#444141]">
          No hardware, no badge printers, no integration project. Attendees join from iOS,
          Android or the web, and your dashboard starts filling on day one.
        </p>
        <a
          href="#waitlist"
          className="mt-1 inline-block w-fit border-2 border-[#ec3013] bg-[#ec3013] px-5 py-3 text-[15px] font-extrabold tracking-wide text-white uppercase hover:bg-[#ae1800] hover:border-[#ae1800]"
        >
          Start onboarding
        </a>
      </div>
    </section>
  );
}
