import { Hero } from "./components/hero/Hero";
import { SponsorsSection } from "./components/sponsors/SponsorsSection";
import { AttendeesSection } from "./components/sections/AttendeesSection";

export function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SponsorsSection />
      <AttendeesSection />
    </div>
  );
}
