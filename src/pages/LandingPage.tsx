import { Nav } from "../components/layout/Nav";
import { Footer } from "../components/layout/Footer";
import { HeroB } from "../components/hero/HeroB";
import { Hero as CrowdSection } from "../components/hero/Hero";
import { SponsorsSection } from "../components/sponsors/SponsorsSection";
import { TwoAudiencesSection } from "../components/sections/TwoAudiencesSection";
import { OwnerSignalsSection } from "../components/sections/OwnerSignalsSection";
import { OnboardingSection } from "../components/sections/OnboardingSection";
import { PosterSection } from "../components/sections/PosterSection";
import { WaitlistSection } from "../components/sections/WaitlistSection";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f3f2f2] text-[#201e1d]">
      <Nav />
      <HeroB />
      <CrowdSection />
      <SponsorsSection />
      <TwoAudiencesSection />
      <OwnerSignalsSection />
      <OnboardingSection />
      <PosterSection />
      <WaitlistSection />
      <Footer />
    </div>
  );
}
