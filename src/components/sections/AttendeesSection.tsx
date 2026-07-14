import { AttendeeForm } from "../forms/AttendeeForm";
import { LeadCaptureSection } from "./LeadCaptureSection";

export function AttendeesSection() {
  return (
    <LeadCaptureSection
      id="attendees"
      title="For Attendees"
      description="See who's already in the room, trade contacts with a tap, post to the
        live feed, and unlock perks the more you engage — WAP turns any event
        into a room full of people worth knowing."
    >
      <AttendeeForm />
    </LeadCaptureSection>
  );
}
