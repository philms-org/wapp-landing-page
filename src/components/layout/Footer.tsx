import { WMark } from "../brand/WMark";

export function Footer() {
  return (
    <footer className="flex flex-wrap items-center justify-between gap-4 px-6 py-8 sm:px-14">
      <div className="flex items-center gap-2.5">
        <WMark className="h-5.5 w-5.5" />
        <span className="text-sm text-[#605d5d] italic">Life Worth Living Well</span>
      </div>
      <span className="text-[13px] text-[#7d7979]">
        © {new Date().getFullYear()} The W App · iOS · Android · Web
      </span>
    </footer>
  );
}
