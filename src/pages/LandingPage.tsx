import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/hero/Hero";
import { SponsorsSection } from "../components/sponsors/SponsorsSection";
import { AttendeesSection } from "../components/sections/AttendeesSection";
import { OrganizersSection } from "../components/sections/OrganizersSection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />
      <header className="mx-auto max-w-3xl px-6 pb-4 pt-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">The W App</h1>
        <p className="mt-3 text-lg text-gray-600">
          Your favorite online thing for events and high-traffic venues
        </p>
      </header>
      <Hero />
      <SponsorsSection />
      <AttendeesSection />
      <OrganizersSection />
      <Footer />
    </div>
  );
}
