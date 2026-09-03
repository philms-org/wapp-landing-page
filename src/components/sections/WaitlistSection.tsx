import { ErrorBoundary } from "../ErrorBoundary";
import { WaitlistForm } from "../forms/WaitlistForm";

export function WaitlistSection() {
  return (
    <section id="waitlist" className="grid border-b-2 border-[#201e1d]/40 sm:grid-cols-2">
      <div className="border-b-2 border-[#201e1d]/40 px-6 py-9 sm:border-r-2 sm:border-b-0 sm:px-14 sm:py-16">
        <h2 className="m-0 mb-4 max-w-[18ch] font-[Archivo] text-[28px] leading-[1.03] font-extrabold tracking-[-0.025em] text-[#201e1d] sm:text-[36px] md:text-[48px]">
          Get on the list, or get your event on it.
        </h2>
        <p className="m-0 max-w-[50ch] text-base leading-[1.5] text-[#444141]">
          Attendees get early access before their next event. Owners and venues get an onboarding
          link and a walkthrough of the dashboard.
        </p>
        <p className="m-0 mt-5 text-[13px] text-[#7d7979]">
          One email when your access opens. Nothing else.
        </p>
      </div>
      <div className="bg-[#f8f4f4] px-6 py-9 sm:px-14 sm:py-16">
        <ErrorBoundary
          fallback={(reset) => (
            <p className="text-[#ae1800]">
              Signup is temporarily unavailable.{" "}
              <button type="button" onClick={reset} className="underline">
                Try again
              </button>
            </p>
          )}
        >
          <WaitlistForm />
        </ErrorBoundary>
      </div>
    </section>
  );
}
