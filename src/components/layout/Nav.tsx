import { WMark } from "../brand/WMark";

export function Nav() {
  return (
    <nav className="flex items-center justify-between px-6 py-4">
      <WMark className="h-8 w-8" />
      <div className="flex gap-6 text-sm text-white/80">
        <a href="#attendees" className="hover:text-cyan-400">
          For Attendees
        </a>
        <a href="#organizers" className="hover:text-cyan-400">
          For Organizers
        </a>
      </div>
    </nav>
  );
}
