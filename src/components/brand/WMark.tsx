interface WMarkProps {
  className?: string;
}

export function WMark({ className }: WMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10 25 L30 75 L50 40 L70 75 L90 25"
        stroke="currentColor"
        strokeWidth="10"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <circle cx="30" cy="75" r="5" fill="white" />
      <circle cx="70" cy="75" r="5" fill="white" />
    </svg>
  );
}
