import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { Hero } from "../components/hero/Hero";
import { SponsorsSection } from "../components/sponsors/SponsorsSection";
import { AttendeesSection } from "../components/sections/AttendeesSection";
import { OrganizersSection } from "../components/sections/OrganizersSection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Nav />
      <Hero />
      <SponsorsSection />
      <AttendeesSection />
      <OrganizersSection />
      <Footer />
    </div>
  );
}
