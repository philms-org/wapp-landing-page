import { OrganizerForm } from "../forms/OrganizerForm";
import { ErrorBoundary } from "../ErrorBoundary";

export function OrganizersSection() {
  return (
    <section id="organizers" className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-4 text-3xl font-bold">For Organizers</h2>
      <p className="mb-8 text-white/80">
        Run check-ins, track engagement, and manage rewards for your venue or
        event from one admin portal — with an audience that's already primed
        to connect.
      </p>
      <ErrorBoundary
        fallback={
          <p className="text-red-400">
            Signup is temporarily unavailable. Please check back soon.
          </p>
        }
      >
        <OrganizerForm />
      </ErrorBoundary>
    </section>
  );
}
