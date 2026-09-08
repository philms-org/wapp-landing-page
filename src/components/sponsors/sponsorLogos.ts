export interface SponsorLogo {
  id: string;
  label: string;
}

// Entirely invented placeholder names — deliberately not real companies or
// trademarked fictional ones (avoid implying any real partnership/endorsement).
export const SPONSOR_LOGOS: SponsorLogo[] = [
  { id: "sponsor-1", label: "Acme Co." },
  { id: "sponsor-2", label: "Contoso" },
  { id: "sponsor-3", label: "Fabrikam" },
  { id: "sponsor-4", label: "Northwind Traders" },
  { id: "sponsor-5", label: "Litware Inc." },
  { id: "sponsor-6", label: "Proseware" },
  { id: "sponsor-7", label: "Woodgrove Bank" },
  { id: "sponsor-8", label: "Tailspin Toys" },
  { id: "sponsor-9", label: "Wingtip Toys" },
  { id: "sponsor-10", label: "Fourth Coffee" },
  { id: "sponsor-11", label: "Adatum" },
  { id: "sponsor-12", label: "Adventure Works" },
];

export function pickLogo(index: number): SponsorLogo {
  return SPONSOR_LOGOS[index % SPONSOR_LOGOS.length];
}
