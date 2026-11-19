export interface NavItem {
  label: string;
  href: string;
}

export interface StatItem {
  id: string;
  value: string;
  label: string;
  detail: string;
  percentage?: number;
  icon?: string;
}

export interface WorkplaceModule {
  id: string;
  index: string;
  title: string;
  description: string;
  tag: string;
  icon: string;
  accentColor?: string;
  previewType?: 'kiosk' | 'room' | 'mail' | 'attendance' | 'queue' | 'contractor' | 'vip';
}

export interface PersonaFeatureGroup {
  role: 'Admin' | 'HR' | 'Security' | 'Employees';
  subtitle: string;
  description: string;
  features: {
    title: string;
    description: string;
    badge?: string;
  }[];
}

export interface WorkflowStep {
  stepNumber: string;
  title: string;
  description: string;
  timeTag: string;
  highlightText: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: string;
  priceAnnual: string;
  billingPeriod: string;
  discountNote?: string;
  checkinsAllowance: string;
  scope: string;
  isPopular?: boolean;
  ctaText: string;
  ctaHref: string;
  features: string[];
}

export interface IndustryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface LandingPageData {
  meta: {
    title: string;
    description: string;
  };
  navigation: {
    brandName: string;
    links: NavItem[];
    ctaContact: { label: string; href: string };
    ctaWhatsApp: { label: string; href: string };
  };
  fold1Hero: {
    badge: string;
    heading: string;
    subheading: string;
    primaryCta: { label: string; href: string };
    whatsappCta: { label: string; href: string };
  };
  fold2Stats: {
    badge: string;
    heading: string;
    items: StatItem[];
  };
  fold3Why: {
    badge: string;
    heading: string;
    valueStatement: string;
    highlights: string[];
  };
  fold4Modules: {
    badge: string;
    heading: string;
    subheading: string;
    modules: WorkplaceModule[];
  };
  fold5Features: {
    badge: string;
    heading: string;
    subheading: string;
    personaGroups: PersonaFeatureGroup[];
  };
  fold6Workflow: {
    badge: string;
    heading: string;
    subheading: string;
    steps: WorkflowStep[];
  };
  fold7Pricing: {
    badge: string;
    heading: string;
    subheading: string;
    plans: PricingPlan[];
  };
  fold8Industries: {
    badge: string;
    heading: string;
    subheading: string;
    industries: IndustryItem[];
  };
  fold9Cta: {
    badge: string;
    heading: string;
    subheading: string;
    primaryCta: { label: string; href: string };
    whatsappCta: { label: string; href: string };
  };
}
