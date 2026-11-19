import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroFold } from '@/components/folds/Fold1Hero/HeroFold';
import { StatsFold } from '@/components/folds/Fold2Stats/StatsFold';
import { WhyGateShieldFold } from '@/components/folds/Fold3Why/WhyGateShieldFold';
import { ModulesFold } from '@/components/folds/Fold4Modules/ModulesFold';
import { FeaturesFold } from '@/components/folds/Fold5Features/FeaturesFold';
import { WorkflowFold } from '@/components/folds/Fold6Workflow/WorkflowFold';
import { PricingFold } from '@/components/folds/Fold7Pricing/PricingFold';
import { IndustriesFold } from '@/components/folds/Fold8Industries/IndustriesFold';
import { CtaFold } from '@/components/folds/Fold9Cta/CtaFold';
import { ContactModalProvider } from '@/components/common/ContactModal';
import { ScrollAnimations } from '@/components/common/ScrollAnimations';

export default function HomePage() {
  return (
    <ContactModalProvider>
      <ScrollAnimations />
      <Navbar />
      <main>
        {/* Fold 1: Hero & Introduction */}
        <HeroFold />

        {/* Folds 2 to 3: Warm Light Canvas (top cap) */}
        <div className="light-canvas-wrapper light-canvas-top">
          {/* Fold 2: Results By The Numbers */}
          <StatsFold />
        </div>

        {/* Fold 3: Why GateShield — standalone, unpinned-friendly cream section */}
        <WhyGateShieldFold />

        {/* Folds 4 to 8: Warm Light Canvas (bottom cap) */}
        <div className="light-canvas-wrapper light-canvas-bottom">
          {/* Fold 4: Workplace Modules */}
          <ModulesFold />

          {/* Fold 5: Role-Based Features */}
          <FeaturesFold />

          {/* Fold 6: How to Use – ID Scan to Entry Pass */}
          <WorkflowFold />

          {/* Fold 7: Pricing & Plans */}
          <PricingFold />

          {/* Fold 8: Industries We Serve */}
          <IndustriesFold />
        </div>

        {/* Fold 9: High-Impact Conversion CTA */}
        <CtaFold />
      </main>

      {/* Global Footer */}
      <Footer />
    </ContactModalProvider>
  );
}
