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
      <Hero />
      <SponsorsSection />
      <AttendeesSection />
      <OrganizersSection />
      <Footer />
    </div>
  );
}
