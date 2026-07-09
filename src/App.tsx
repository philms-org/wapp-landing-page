import { Hero } from "./components/hero/Hero";
import { SponsorsSection } from "./components/sponsors/SponsorsSection";

export function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Hero />
      <SponsorsSection />
    </div>
  );
}
