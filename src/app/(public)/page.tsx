import MainSection from "@/components/public/home/main-section";
import AppShowcase from "@/components/public/home/app-showcase";
import FeatureShowcase from "@/components/public/home/feature-showcase";
import ShortcutSection from "@/components/public/home/shortcut-section";
import PerksSection from "@/components/public/home/perks-section";
import SupportSection from "@/components/public/home/support-section";
import CTASection from "@/components/public/home/cta-section";

export default function LandingPage() {
  return (
    <main className="w-full overflow-x-clip flex flex-col">
      <MainSection />
      <AppShowcase />
      <FeatureShowcase />
      <ShortcutSection />
      <PerksSection />
      <SupportSection />
      <CTASection />
    </main>
  );
}