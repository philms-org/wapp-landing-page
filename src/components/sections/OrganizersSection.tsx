import { OrganizerForm } from "../forms/OrganizerForm";
import { LeadCaptureSection } from "./LeadCaptureSection";

export function OrganizersSection() {
  return (
    <LeadCaptureSection
      id="organizers"
      title="For Organizers"
      description="Run check-ins, track engagement, and manage rewards for your venue or
        event from one admin portal — with an audience that's already primed
        to connect."
    >
      <OrganizerForm />
    </LeadCaptureSection>
  );
}
