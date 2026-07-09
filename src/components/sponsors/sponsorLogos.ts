export interface SponsorLogo {
  id: string;
  label: string;
}

export const SPONSOR_LOGOS: SponsorLogo[] = [
  { id: "sponsor-1", label: "Acme Co." },
  { id: "sponsor-2", label: "Northwind" },
  { id: "sponsor-3", label: "Globex" },
  { id: "sponsor-4", label: "Initech" },
  { id: "sponsor-5", label: "Umbrella" },
  { id: "sponsor-6", label: "Stark Industries" },
  { id: "sponsor-7", label: "Wayne Enterprises" },
  { id: "sponsor-8", label: "Hooli" },
];

export function pickLogo(index: number): SponsorLogo {
  return SPONSOR_LOGOS[index % SPONSOR_LOGOS.length];
}
