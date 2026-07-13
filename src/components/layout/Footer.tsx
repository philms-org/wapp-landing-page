import { WMark } from "../brand/WMark";

export function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 border-t border-gray-200 px-6 py-10 text-center text-gray-500">
      <WMark className="h-6 w-6" />
      <p className="text-sm italic">Life Worth Living Well</p>
      <p className="text-xs">&copy; {new Date().getFullYear()} The W App</p>
    </footer>
  );
}
