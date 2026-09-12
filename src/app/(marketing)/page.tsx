'use client';

import * as React from 'react';
import { CinematicHero } from '@/components/home/CinematicHero';
import { StatCounterStrip } from '@/components/home/StatCounterStrip';
import { ScrollFrameSequence } from '@/components/ui/ScrollFrameSequence';
import { PartnerTrustGrid } from '@/components/home/PartnerTrustGrid';
import { TechnologyStatement } from '@/components/home/TechnologyStatement';
import { HorizontalServicesShowcase } from '@/components/home/HorizontalServicesShowcase';
import { BusinessRoadmapJourney } from '@/components/home/BusinessRoadmapJourney';
import { CapabilityExplorer } from '@/components/home/CapabilityExplorer';
import { SystemArchitectureFlow } from '@/components/home/SystemArchitectureFlow';
import { LayeredParallaxSection } from '@/components/home/LayeredParallaxSection';
import { ProductsShowcase } from '@/components/home/ProductsShowcase';
import { ServicesExplorer } from '@/components/home/ServicesExplorer';
import { DirectorSection } from '@/components/home/DirectorSection';
import { VerifiedCaseStudies } from '@/components/home/VerifiedCaseStudies';
import { InfrastructureStack } from '@/components/home/InfrastructureStack';
import { GlobalInfrastructureMap } from '@/components/home/GlobalInfrastructureMap';
import { TrustProofSection } from '@/components/home/TrustProofSection';
import { EditorialAboutSection } from '@/components/home/EditorialAboutSection';
import { InsightsShowcase } from '@/components/home/InsightsShowcase';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { EnterpriseFAQSection } from '@/components/home/EnterpriseFAQSection';
import { FinalCinematicCTA } from '@/components/home/FinalCinematicCTA';
import { SystemEstimateModal } from '@/components/home/SystemEstimateModal';

export default function WideStudioPage() {
  const [isEstimateOpen, setIsEstimateOpen] = React.useState(false);

  return (
    <div className="bg-[#0a0a0b] text-[#e8e8e6] min-h-screen overflow-x-hidden">
      
      {/* 01. CINEMATIC HERO */}
      <CinematicHero />

      {/* 01.1 ANIMATED STAT-COUNTER STRIP */}
      <StatCounterStrip />

      {/* 02. 3D HARDWARE TURNTABLE SEQUENCE */}
      <section id="hardware-sequence" className="w-full overflow-hidden">
        <ScrollFrameSequence />
      </section>

      {/* 03. CATEGORIZED PARTNER & CLIENT TRUST MATRIX GRID */}
      <PartnerTrustGrid />

      {/* 04. EDITORIAL TECHNOLOGY STATEMENT */}
      <TechnologyStatement />

      {/* 05. HORIZONTAL PINNED SERVICES SHOWCASE */}
      <HorizontalServicesShowcase />

      {/* 05.1 BUSINESS ROADMAP & MULTIMODAL ENGINEERING JOURNEY */}
      <BusinessRoadmapJourney />

      {/* 06. LIVING SYSTEM ARCHITECTURE FLOW */}
      <SystemArchitectureFlow />

      {/* 06.1 SPATIAL MULTI-LAYER PARALLAX ARCHITECTURE */}
      <LayeredParallaxSection />

      {/* 07. REAL PRODUCTS & PLATFORMS SHOWCASE */}
      <ProductsShowcase />

      {/* 08. CAPABILITY EXPLORER */}
      <CapabilityExplorer />

      {/* 09. INTERACTIVE SERVICES EXPLORER */}
      <ServicesExplorer />

      {/* 10. FOUNDER & MANAGING DIRECTOR LEADERSHIP */}
      <DirectorSection />

      {/* 11. VERIFIED CASE STUDIES */}
      <VerifiedCaseStudies />

      {/* 12. LAYERED INFRASTRUCTURE & TECHNOLOGY STACK */}
      <InfrastructureStack />

      {/* 13. GLOBAL CLOUD & EDGE INFRASTRUCTURE MAP */}
      <GlobalInfrastructureMap />

      {/* 14. ENTERPRISE TRUST & ARCHITECTURAL PROOF */}
      <TrustProofSection />

      {/* 15. EDITORIAL ABOUT OHO TECH */}
      <EditorialAboutSection />

      {/* 16. TECHNICAL INSIGHTS & PERSPECTIVES */}
      <InsightsShowcase />

      {/* 16.1 CLIENT TESTIMONIALS & OUTCOMES CAROUSEL */}
      <TestimonialsCarousel />

      {/* 17. ENTERPRISE FAQ */}
      <EnterpriseFAQSection />

      {/* 18. DRAMATIC FINAL ACTION CTA */}
      <FinalCinematicCTA onOpenEstimate={() => setIsEstimateOpen(true)} />

      {/* 19. SYSTEM ESTIMATE MODAL */}
      <SystemEstimateModal 
        isOpen={isEstimateOpen} 
        onClose={() => setIsEstimateOpen(false)} 
      />

    </div>
  );
}

