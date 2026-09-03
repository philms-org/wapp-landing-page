import { WMark } from "../brand/WMark";

export function Nav() {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between gap-4 border-b-2 border-[#201e1d]/40 bg-[#f3f2f2] px-6 py-3.5 sm:px-14">
      <a href="#top" className="flex items-center gap-2.5 text-[#201e1d]">
        <WMark className="h-7 w-7" />
        <span className="font-[Archivo] text-[15px] font-extrabold tracking-[0.14em] text-[#201e1d] uppercase">
          The W App
        </span>
      </a>
      <div className="flex items-center gap-4 text-[13px] tracking-[0.08em] uppercase sm:gap-7">
        <a href="#attendees" className="text-[#444141] hover:text-[#ec3013]">
          Attendees
        </a>
        <a href="#owners" className="text-[#444141] hover:text-[#ec3013]">
          Owners
        </a>
        <a
          href="#waitlist"
          className="border-2 border-[#ec3013] bg-[#ec3013] px-3.5 py-2 text-[13px] font-extrabold text-white hover:border-[#ae1800] hover:bg-[#ae1800]"
        >
          Join the waitlist
        </a>
      </div>
    </nav>
  );
}
