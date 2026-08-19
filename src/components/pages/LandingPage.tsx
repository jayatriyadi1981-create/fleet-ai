import React from 'react';
import { AnnouncementBar } from '../landing/AnnouncementBar';
import { LandingNavbar } from '../landing/LandingNavbar';
import { HeroSection } from '../landing/HeroSection';
import { TrustMetricsSection } from '../landing/TrustMetricsSection';
import { ProblemSection } from '../landing/ProblemSection';
import { SolutionSection } from '../landing/SolutionSection';
import { FeaturesSection } from '../landing/FeaturesSection';
import { GpsSection } from '../landing/GpsSection';
import { AiSection } from '../landing/AiSection';
import { FleetSection } from '../landing/FleetSection';
import { SafetySection } from '../landing/SafetySection';
import { FuelSection } from '../landing/FuelSection';
import { MaintenanceSection } from '../landing/MaintenanceSection';
import { AnalyticsSection } from '../landing/AnalyticsSection';
import { IndustriesSection } from '../landing/IndustriesSection';
import { HowItWorksSection } from '../landing/HowItWorksSection';
import { PlatformSection } from '../landing/PlatformSection';
import { PricingSection } from '../landing/PricingSection';
import { TestimonialsSection } from '../landing/TestimonialsSection';
import { SecuritySection } from '../landing/SecuritySection';
import { FaqSection } from '../landing/FaqSection';
import { FinalCtaSection } from '../landing/FinalCtaSection';
import { LandingFooter } from '../landing/LandingFooter';

interface Props {
  onNavigateLogin: () => void;
  onNavigateApp: () => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigateLogin, onNavigateApp }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Navbar */}
      <LandingNavbar onNavigateLogin={onNavigateLogin} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Section */}
        <HeroSection onNavigateLogin={onNavigateLogin} />

        {/* 4. Trust / Metrics */}
        <TrustMetricsSection />

        {/* 5. Problem Section */}
        <ProblemSection />

        {/* 6. Solution Ecosystem Section */}
        <SolutionSection />

        {/* 7. Core Features */}
        <FeaturesSection />

        {/* 8. Live GPS Section */}
        <GpsSection onNavigateLogin={onNavigateLogin} />

        {/* 9. Smart AI Section */}
        <AiSection onNavigateLogin={onNavigateLogin} />

        {/* 10. Fleet Management */}
        <FleetSection />

        {/* 11. Safety Section */}
        <SafetySection />

        {/* 12. Fuel Management */}
        <FuelSection onNavigateLogin={onNavigateLogin} />

        {/* 13. Predictive Maintenance */}
        <MaintenanceSection onNavigateLogin={onNavigateLogin} />

        {/* 14. Analytics Section */}
        <AnalyticsSection />

        {/* 15. Industries Section */}
        <IndustriesSection />

        {/* 16. How It Works */}
        <HowItWorksSection />

        {/* 17. Platform Section */}
        <PlatformSection />

        {/* 18. Pricing */}
        <PricingSection onNavigateLogin={onNavigateLogin} />

        {/* 19. Testimonials */}
        <TestimonialsSection />

        {/* 20. Security Section */}
        <SecuritySection />

        {/* 21. FAQ */}
        <FaqSection />

        {/* 22. Final CTA */}
        <FinalCtaSection onNavigateLogin={onNavigateLogin} />
      </main>

      {/* 23. Footer */}
      <LandingFooter />
    </div>
  );
};
