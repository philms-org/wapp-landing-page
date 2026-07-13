interface WMarkProps {
  className?: string;
}

export function WMark({ className }: WMarkProps) {
  return <img src="/brand/w-mark.png" alt="The W App" className={className} />;
}
