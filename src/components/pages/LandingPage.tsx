import React, { useState } from 'react';
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
import { RequestDemoModal } from '../landing/RequestDemoModal';

interface Props {
  onNavigateLogin: () => void;
  onNavigateApp: () => void;
}

export const LandingPage: React.FC<Props> = ({ onNavigateLogin, onNavigateApp }) => {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const handleOpenDemo = () => {
    setIsDemoModalOpen(true);
  };

  const handleCloseDemo = () => {
    setIsDemoModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
      {/* 1. Announcement Bar */}
      <AnnouncementBar />

      {/* 2. Header / Navbar */}
      <LandingNavbar onNavigateLogin={onNavigateLogin} onRequestDemo={handleOpenDemo} />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 3. Hero Section (Headline, Subheadline, CTA Demo, CTA Login, Live Dashboard Preview, Animated GPS Map, AI Insight Preview) */}
        <HeroSection onNavigateLogin={onNavigateLogin} onRequestDemo={handleOpenDemo} />

        {/* 4. Trust / Metrics Section */}
        <TrustMetricsSection />

        {/* 5. Problem Section */}
        <ProblemSection />

        {/* 6. Solution Ecosystem Section */}
        <SolutionSection />

        {/* 7. Product Features (10 Modules: Real-Time GPS Tracking, Fleet Management, Driver Management, Fuel Management, Maintenance, Geofencing, Route Management, AI Analytics, Safety Management, Reports) */}
        <FeaturesSection />

        {/* 8. Live GPS Section */}
        <GpsSection onNavigateLogin={onNavigateLogin} />

        {/* 9. Smart AI Section */}
        <AiSection onNavigateLogin={onNavigateLogin} />

        {/* 10. Fleet Management */}
        <FleetSection />

        {/* 11. Safety Management & Driver Scorecard */}
        <SafetySection />

        {/* 12. Fuel Management & Siphoning Prevention */}
        <FuelSection onNavigateLogin={onNavigateLogin} />

        {/* 13. Predictive Maintenance & Work Orders */}
        <MaintenanceSection onNavigateLogin={onNavigateLogin} />

        {/* 14. Route Management & Analytics */}
        <AnalyticsSection />

        {/* 15. Industry Solutions (12 Industries: Logistics, Expedition, Rental, Transportation, Bus, Travel, Mining, Plantation, Construction, Distribution, Government, Corporate Fleet) */}
        <IndustriesSection />

        {/* 16. How It Works */}
        <HowItWorksSection />

        {/* 17. Multi-Device Platform */}
        <PlatformSection />

        {/* 18. Pricing Section (4 Tiers: Starter, Business, Professional, Enterprise) */}
        <PricingSection onNavigateLogin={onNavigateLogin} onRequestDemo={handleOpenDemo} />

        {/* 19. Testimonials */}
        <TestimonialsSection />

        {/* 20. Trust Section (Security, Cloud Infrastructure, Data Protection, 24/7 Monitoring, API Integration) */}
        <SecuritySection />

        {/* 21. FAQ & Documentation */}
        <FaqSection />

        {/* 22. Final Call to Action */}
        <FinalCtaSection onNavigateLogin={onNavigateLogin} onRequestDemo={handleOpenDemo} />
      </main>

      {/* 23. Footer */}
      <LandingFooter />

      {/* Interactive Request Demo Modal */}
      <RequestDemoModal
        isOpen={isDemoModalOpen}
        onClose={handleCloseDemo}
        onNavigateLogin={onNavigateLogin}
      />
    </div>
  );
};
