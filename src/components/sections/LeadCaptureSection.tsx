import type { ReactNode } from "react";
import { ErrorBoundary } from "../ErrorBoundary";

interface LeadCaptureSectionProps {
  id: string;
  title: string;
  description: ReactNode;
  children: ReactNode;
}

export function LeadCaptureSection({ id, title, description, children }: LeadCaptureSectionProps) {
  return (
    <section id={id} className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-4 text-3xl font-bold text-gray-900">{title}</h2>
      <p className="mb-8 text-gray-700">{description}</p>
      <ErrorBoundary
        fallback={(reset) => (
          <p className="text-red-400">
            Signup is temporarily unavailable.{" "}
            <button type="button" onClick={reset} className="underline">
              Try again
            </button>
          </p>
        )}
      >
        {children}
      </ErrorBoundary>
    </section>
  );
}
