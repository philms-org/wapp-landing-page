const SIGNALS = [
  {
    signal: "Foot traffic",
    captured: "Zone check-ins and app presence",
    answers: "Which halls earn their square metres",
  },
  {
    signal: "Dwell time",
    captured: "Time-in-zone per attendee",
    answers: "Where attention actually goes",
  },
  {
    signal: "Connections",
    captured: "QR Connect exchanges",
    answers: "Whether the room is doing its job",
  },
  {
    signal: "Reconnections",
    captured: "Repeat matches across editions",
    answers: "How loyal your audience really is",
  },
  {
    signal: "Sponsor engagement",
    captured: "Booth scans, session taps, rewards",
    answers: "What a sponsorship is worth next year",
  },
];

export function OwnerSignalsSection() {
  return (
    <section className="border-b-2 border-[#201e1d]/40 px-6 py-9 sm:px-14 sm:py-16">
      <h2 className="m-0 mb-2 font-[Archivo] text-2xl font-extrabold tracking-[-0.02em] text-[#201e1d] sm:text-3xl">
        What owners get, signal by signal
      </h2>
      <p className="m-0 mb-7 max-w-[60ch] text-base text-[#605d5d]">
        Every number comes from attendee activity in the app — nothing estimated, nothing
        extrapolated from door counts.
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full border-collapse text-left">
          <thead>
            <tr>
              {["Signal", "How it is captured", "What it answers"].map((h) => (
                <th
                  key={h}
                  className="border-b-2 border-[#201e1d] py-2.5 pr-4 text-xs font-extrabold tracking-[0.1em] text-[#201e1d] uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SIGNALS.map((row) => (
              <tr key={row.signal}>
                <td className="border-b border-[#d7d3d3] py-3 pr-4 text-sm font-semibold text-[#201e1d]">
                  {row.signal}
                </td>
                <td className="border-b border-[#d7d3d3] py-3 pr-4 text-sm text-[#605d5d]">
                  {row.captured}
                </td>
                <td className="border-b border-[#d7d3d3] py-3 pr-4 text-sm text-[#605d5d]">
                  {row.answers}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
