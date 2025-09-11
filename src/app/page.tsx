"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { HowItWorksSection } from "@/components/sections/HowItWorksSection";
import { FeaturesSection } from "@/components/sections/FeaturesSection";
import { PricingSection } from "@/components/sections/PricingSection";
import { CTASection } from "@/components/sections/CTASection";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background" suppressHydrationWarning>
      <Navbar />

      <HeroSection />

      <HowItWorksSection />

      <FeaturesSection />

      <PricingSection />

      <CTASection />

      <Footer />
    </div>
  );
}
