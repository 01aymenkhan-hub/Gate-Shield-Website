import { LandingPageData } from '@/types/landing';

export const landingData: LandingPageData = {
  meta: {
    title: 'GateShield — Modern Workplace Visitor & Security Management',
    description:
      'Move beyond paper registers with faster check-ins, QR-code passes, watchlist screening, and organized digital records.',
  },
  navigation: {
    brandName: 'GateShield',
    links: [
      { label: 'Modules', href: '#modules' },
      { label: 'Features', href: '#features' },
      { label: 'How It Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#pricing' },
      { label: 'Industries', href: '#industries' },
    ],
    ctaContact: {
      label: 'Try For Free',
      href: '#contact',
    },
    ctaWhatsApp: {
      label: 'Chat on WhatsApp',
      href: 'https://wa.me/?text=Hello%20GateShield%20Team',
    },
  },
  fold1Hero: {
    badge: '● 09:00 · Smart Workplace Security',
    heading: 'A Smarter Way to Welcome Every Visitor',
    subheading:
      'Move beyond paper registers with faster check-ins, QR-code passes, and organized visitor records.',
    primaryCta: {
      label: 'Get Started with Gate Shield',
      href: '#pricing',
    },
    whatsappCta: {
      label: 'Chat on WhatsApp',
      href: 'https://wa.me/?text=Hello%20GateShield%20Team',
    },
  },
  fold2Stats: {
    badge: '● 09:30 · Results By The Numbers',
    heading: 'Results By The Numbers',
    items: [
      {
        id: 'stat-1',
        value: '80%',
        label: 'Reduction in lobby wait time',
        detail: 'Eliminate manual registration queues with quick QR scanning.',
        percentage: 80,
      },
      {
        id: 'stat-2',
        value: '30s',
        label: 'Average visitor check-in time',
        detail: 'Instant automated lookups and digital badge generation.',
        percentage: 85,
      },
      {
        id: 'stat-3',
        value: '100%',
        label: 'Digital audit trail completeness',
        detail: 'Zero missed records with tamper-proof timestamped logs.',
        percentage: 100,
      },
      {
        id: 'stat-4',
        value: '50 Mins',
        label: 'Setup and Training time',
        detail: 'Zero proprietary hardware setup; works on any tablet or web device.',
        percentage: 95,
      },
    ],
  },
  fold3Why: {
    badge: '● 10:00 · Why GateShield',
    heading: 'Modern facility control without the operational friction.',
    valueStatement:
      'Less paperwork, faster check-ins, instant visitor records, and a simple system your team can start using without the hassle.',
    highlights: [
      'Instant QR-Passes',
      'Zero Lost Registers',
      'Watchlist Screening',
      'Tamper-Proof Audit Logs',
    ],
  },
  fold4Modules: {
    badge: '● 10:30 · Integrated Suite',
    heading: 'The Tools That Keep Your Workplace Moving',
    subheading:
      'From the main gate to the mailroom, GateShield keeps visitors, deliveries, contractors and VIPs in separate registers, all in one simple system.',
    modules: [
      {
        id: 'visitor-mgmt',
        index: '01',
        title: 'Visitor Management',
        description:
          'Fast check-ins, watchlist screening, and automatic badge printing, all from one kiosk.',
        tag: 'Core System',
        icon: 'UserCheck',
        previewType: 'kiosk',
      },
      {
        id: 'meeting-room',
        index: '02',
        title: 'Meeting Room Management',
        description:
          'Book meeting rooms, request catering, and cancel unused bookings automatically to free up space.',
        tag: 'Productivity',
        icon: 'Calendar',
        previewType: 'room',
      },
      {
        id: 'mailroom-mgmt',
        index: '03',
        title: 'Mail Management',
        description:
          'Route packages to the right recipients and notify them as soon as deliveries arrive.',
        tag: 'Logistics',
        icon: 'Package',
        previewType: 'mail',
      },
      {
        id: 'attendance-mgmt',
        index: '04',
        title: 'Employee Management',
        description:
          'Invite Guest and Track Parcel ',
        tag: 'Workforce',
        icon: 'Clock',
        previewType: 'attendance',
      },
      {
        id: 'queue-mgmt',
        index: '05',
        title: 'Queue Management System',
        description:
          'Issue digital tokens, manage service counters, and notify visitors when it is their turn.',
        tag: 'Operations',
        icon: 'Layers',
        previewType: 'queue',
      },
      {
        id: 'contractor-mgmt',
        index: '06',
        title: 'Contractor Management System',
        description:
          'Track contractors, verify certifications, and control site access with clear compliance records.',
        tag: 'Compliance',
        icon: 'ShieldCheck',
        previewType: 'contractor',
      },
      {
        id: 'vip-guest',
        index: '07',
        title: 'VIP Guest Management',
        description:
          'Prepare for VIP arrivals with a dedicated guest list, pre-cleared passes, and instant host alerts.',
        tag: 'Priority',
        icon: 'Crown',
        previewType: 'vip',
      },
    ],
  },
  fold5Features: {
    badge: '● 11:00 · Role-Based Capabilities',
    heading: 'Built for Everyone Who Runs Your Workplace',
    subheading:
      'From the front gate to the admin dashboard, Gate Shield gives every team the tools to keep your workplace running smoothly.',
    personaGroups: [
      {
        role: 'Admin',
        subtitle: 'Command & Analytics',
        description:
          'Comprehensive multi-facility visibility, compliance tracking, and administrative control.',
        features: [
          {
            title: 'Real-Time Occupancy Dashboard',
            description: "See who's inside your building at a glance.",
            badge: 'Live',
          },
          {
            title: 'Multi-Location Management',
            description: 'Manage multiple gates and locations from one dashboard.',
            badge: 'Scalable',
          },
          {
            title: 'Operational Analytics',
            description: 'Track usage and measure workplace efficiency with reports.',
            badge: 'Insights',
          },
          {
            title: 'Customizable Dashboard',
            description: "Match the system to your company's branding and needs.",
            badge: 'White-label',
          },
        ],
      },
      {
        role: 'HR',
        subtitle: 'Candidate & Guest Experience',
        description:
          'Deliver seamless, dignified first impressions for candidates, partners, and visitors.',
        features: [
          {
            title: 'Interviewee Management',
            description:
              'Schedule interviews, create visitor waitlists, and keep your team informed about arrivals.',
            badge: 'Recruitment',
          },
          {
            title: 'Pre-Registration Invites',
            description:
              'Send QR passes, gate directions, and WiFi credentials ahead of scheduled visits.',
            badge: 'Speed',
          },
        ],
      },
      {
        role: 'Security',
        subtitle: 'Access Control & Perimeter Safety',
        description:
          'Equip security guards with instant screening tools, verification workflows, and audit logs.',
        features: [
          {
            title: 'Watchlist & ID Screening',
            description: 'Flag unauthorized visitors during check-in in real time.',
            badge: 'High Security',
          },
          {
            title: 'Contractor & Third-Party Tracking',
            description: 'Track vendors, contractors, authorized zones, and visit duration.',
            badge: 'Access Rules',
          },
          {
            title: 'Daily Compliance Checklist',
            description: 'Keep security teams equipped, prepared, and on schedule.',
            badge: 'SOPs',
          },
          {
            title: 'VIP Guest Management',
            description: 'Prepare for VIP arrivals with a dedicated guest list and notifications.',
            badge: 'Priority',
          },
        ],
      },
      {
        role: 'Employees',
        subtitle: 'Self-Service & Autonomy',
        description:
          'Give staff intuitive controls to approve guests, reserve spaces, and receive parcels.',
        features: [
          {
            title: 'Instant Visitor Approvals',
            description: 'Approve or decline visitor requests in seconds from phone or Slack.',
            badge: 'Instant',
          },
          {
            title: 'Desk Booking on the Go',
            description: 'Reserve your workspace before arriving at the office.',
            badge: 'Hybrid Work',
          },
          {
            title: 'Meeting Room Booking',
            description: 'Check availability and book rooms without back-and-forth emails.',
            badge: 'Smart Calendar',
          },
          {
            title: 'Package Notifications',
            description: 'Get notified when deliveries arrive and collect them at your convenience.',
            badge: 'Automated',
          },
        ],
      },
    ],
  },
  fold6Workflow: {
    badge: '● 11:30 ·How it Works',
    heading: 'From ID Scan to Entry Pass',
    subheading:
      'A seamless 4-step security pipeline designed for lightning-fast lobby throughput.',
    steps: [
      {
        stepNumber: '01',
        title: 'Scan the ID',
        description: "Scan the visitor's CNIC or driving license at the security desk or self-service kiosk.",
        timeTag: 'Step 1 · 5 seconds',
        highlightText: 'Optical character and barcode capture from government identification.',
      },
      {
        stepNumber: '02',
        title: 'Fetch Visitor Details',
        description: 'Visitor information is retrieved automatically from the registry or pre-invitation log.',
        timeTag: 'Step 2 · Instant',
        highlightText: 'Auto-fills personal information and checks company blacklist/whitelist.',
      },
      {
        stepNumber: '03',
        title: 'Verify the Details',
        description: 'The guard checks and confirms the information with host pre-authorization.',
        timeTag: 'Step 3 · Guard Check',
        highlightText: 'Instant notification dispatched to the employee host for 1-tap clearance.',
      },
      {
        stepNumber: '04',
        title: 'Generate a QR Pass',
        description: "A QR code is generated for the visitor's entry, sent via SMS/WhatsApp or printed.",
        timeTag: 'Step 4 · Digital Pass',
        highlightText: 'Time-bound digital credential valid only for authorized building zones.',
      },
    ],
  },
  fold7Pricing: {
    badge: '● 12:00 · Transparent Pricing',
    heading: 'The Right Solution at the Right Price',
    subheading:
      'No hidden fees. Pay monthly, or pay annually and save.',
    plans: [
      {
        id: 'plan-starter',
        name: 'Starter',
        priceMonthly: 'PKR 10,000',
        priceAnnual: 'PKR 10,000',
        billingPeriod: '/month /location',
        discountNote: 'Billed annually at PKR 84,000 · Save PKR 36,000 a year (30%)',
        checkinsAllowance: '300 check-ins /month',
        scope: 'Up to 50 Employees · Single location',
        ctaText: 'Sign Up',
        ctaHref: '#contact',
        features: [
          '300 check-ins /month',
          'Up to 50 Employees',
          'Single location',
          'Standard support',
        ],
      },
      {
        id: 'plan-premium',
        name: 'Premium',
        badge: 'Recommended',
        isPopular: true,
        priceMonthly: 'PKR 3,200',
        priceAnnual: 'PKR 3,200',
        billingPeriod: '/month /location',
        discountNote: 'Billed annually at PKR 38,400 · Save PKR 9,600 (3 months free)',
        checkinsAllowance: '1000 check-ins /month',
        scope: 'Up to 200 Employees · Multiple locations',
        ctaText: 'Sign Up',
        ctaHref: '#contact',
        features: [
          '1000 check-ins /month',
          'Up to 200 Employees',
          'Multiple locations',
        ],
      },
      {
        id: 'plan-enterprise',
        name: 'Enterprise',
        badge: 'Custom Scale',
        priceMonthly: 'Connect',
        priceAnnual: 'Connect',
        billingPeriod: '',
        discountNote: '',
        checkinsAllowance: 'Unlimited visitors',
        scope: '',
        ctaText: 'Connect',
        ctaHref: '#contact',
        features: [
          'Unlimited visitors',
          'Category based form',
          'Third party integration',
          'Black listing',
          'Evacuation alerts',
        ],
      },
    ],
  },
  fold8Industries: {
    badge: '● 12:30 · Industries We Serve',
    heading: 'One Solution for Every Industry',
    subheading:
      'From factory gates to office receptions, Gate Shield helps you manage visitors, access, and everyday operations with ease.',
    industries: [
      {
        id: 'factories',
        title: 'Factories',
        description: 'Manage visitor entry and keep accurate records of everyone entering your facility.',
        icon: 'Factory',
      },
      {
        id: 'warehouses',
        title: 'Warehouses',
        description: 'Track visitors and contractors while keeping site access organized.',
        icon: 'Warehouse',
      },
      {
        id: 'offices',
        title: 'Offices',
        description: 'Manage visitors and interview candidates from arrival to check-in.',
        icon: 'Building2',
      },
      {
        id: 'exhibitions',
        title: 'Exhibitions',
        description: 'Keep guest lists organized and simplify entry for visitors and VIPs.',
        icon: 'Presentation',
      },
      {
        id: 'concerts',
        title: 'Concerts & Events',
        description: 'Generate tickets and verify them at entry for a smoother check-in experience.',
        icon: 'Ticket',
      },
      {
        id: 'residential',
        title: 'Residential Societies',
        description: 'Manage guest and visitor entry with organized digital records.',
        icon: 'Home',
      },
      {
        id: 'hospitals',
        title: 'Hospitals',
        description: 'Manage visitor access and appointments for a more organized reception.',
        icon: 'Hospital',
      },
      {
        id: 'education',
        title: 'Educational Institutions',
        description: 'Manage campus visitors, interview candidates, and entry records with ease.',
        icon: 'GraduationCap',
      },
    ],
  },
  fold9Cta: {
    badge: '● Ready to Transform',
    heading: 'Ready to Leave Paper Registers Behind?',
    subheading:
      'Make every entry faster, simpler, and easier to track with Gate Shield.',
    primaryCta: {
      label: 'Get Started with Gate Shield',
      href: '#pricing',
    },
    whatsappCta: {
      label: 'Chat on WhatsApp',
      href: 'https://wa.me/?text=Hello%20GateShield%20Team',
    },
  },
};
