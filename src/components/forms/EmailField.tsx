import { Input } from "../ui/input";

interface EmailFieldProps {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
}

export function EmailField({ value, onChange, error }: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <Input
        type="email"
        placeholder="you@example.com"
        aria-label="Email address"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
