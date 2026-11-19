'use client';

import React from 'react';
import {
  Factory,
  Warehouse,
  Building2,
  Presentation,
  Ticket,
  Home,
  HeartPulse,
  GraduationCap,
} from 'lucide-react';

interface IndustryItem {
  id: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ReactNode;
}

const industries: IndustryItem[] = [
  {
    id: 'factories',
    title: 'Factories',
    description: 'Log workers, contractors and cargo trucks at the main gate, with vehicle numbers and delivery documents on file.',
    tag: 'Perimeter & Safety',
    icon: <Factory size={22} />,
  },
  {
    id: 'warehouses',
    title: 'Warehouses',
    description: 'Record every delivery vehicle, plus photos of incoming and outgoing documents.',
    tag: 'Logistics & Docks',
    icon: <Warehouse size={22} />,
  },
  {
    id: 'offices',
    title: 'Offices',
    description: 'Check in visitors and interview candidates, and let employees invite their own guests.',
    tag: 'Corporate Lobby',
    icon: <Building2 size={22} />,
  },
  {
    id: 'exhibitions',
    title: 'Exhibitions',
    description: 'Register visitors, vendors and VIP guests at entry, with a separate list for each.',
    tag: 'Expos & Trade Shows',
    icon: <Presentation size={22} />,
  },
  {
    id: 'concerts',
    title: 'Concerts & Events',
    description: 'Pre-register VIPs, restrict operator logins to your network and keep a full audit trail.',
    tag: 'High-Volume Turnstiles',
    icon: <Ticket size={22} />,
  },
  {
    id: 'residential',
    title: 'Residential Societies',
    description: 'Keep a digital record of every guest, with CNIC, photo and the resident visited.',
    tag: 'Gated Communities',
    icon: <Home size={22} />,
  },
  {
    id: 'hospitals',
    title: 'Hospitals',
    description: 'Register visitors at reception and see who is still inside at the end of visiting hours.',
    tag: 'Healthcare Clinics',
    icon: <HeartPulse size={22} />,
  },
  {
    id: 'education',
    title: 'Educational Institutions',
    description: 'Log every campus visitor and interview candidate, with photo ID on record.',
    tag: 'Campuses & Schools',
    icon: <GraduationCap size={22} />,
  },
];

export const IndustriesFold: React.FC = () => {
  return (
    <section className="industries-section" id="industries">
      <div className="industries-container">
        {/* Section Header */}
        <div className="industries-header">
          <div className="light-pill-badge">
            <span className="dot" />
            <span>12:30 · Industries We Serve</span>
          </div>

          <h2 className="industries-h2">One Solution for Every Industry</h2>

          <p className="industries-subheadline">
            From factory gates to office receptions, Gate Shield helps you manage visitors, access, and everyday operations with ease.
          </p>
        </div>

        {/* 8-Card Responsive Bento Grid */}
        <div className="industries-grid">
          {industries.map((ind) => (
            <div key={ind.id} className="industry-card">
              <div className="industry-card-top">
                <div className="industry-icon-box">{ind.icon}</div>
                <span className="industry-tag">{ind.tag}</span>
              </div>

              <div className="industry-card-body">
                <h3 className="industry-title">{ind.title}</h3>
                <p className="industry-desc">{ind.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
