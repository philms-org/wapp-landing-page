import { AttendeeForm } from "../forms/AttendeeForm";
import { ErrorBoundary } from "../ErrorBoundary";

export function AttendeesSection() {
  return (
    <section id="attendees" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-4 text-3xl font-bold">For Attendees</h2>
      <p className="mb-8 text-white/80">
        See who's already in the room, trade contacts with a tap, post to the
        live feed, and unlock perks the more you engage — WAP turns any event
        into a room full of people worth knowing.
      </p>
      <ErrorBoundary
        fallback={
          <p className="text-red-400">
            Signup is temporarily unavailable. Please check back soon.
          </p>
        }
      >
        <AttendeeForm />
      </ErrorBoundary>
    </section>
  );
}
