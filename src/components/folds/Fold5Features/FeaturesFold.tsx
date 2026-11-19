'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  ShieldCheck,
  Briefcase,
  CheckCircle2,
  ArrowRight,
  MapPin,
  BarChart3,
  Sliders,
  CalendarSearch,
  ListPlus,
  MailCheck,
  Eye,
  HardHat,
  ClipboardList,
  Crown,
  Bell,
  Monitor,
  PackageCheck,
} from 'lucide-react';

/* ─── Persona Data ─────────────────────────────────────────────────────────── */

interface Feature {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

interface Persona {
  id: string;
  label: string;
  roleTitle: string;
  tagline: string;
  image: string;
  imageAlt: string;
  accentColor: string;
  accentBg: string;
  features: Feature[];
  stat: { val: string; label: string };
  ctaLabel: string;
}

const personas: Persona[] = [
  {
    id: 'admin',
    label: 'Admin',
    roleTitle: 'Office Administrator',
    tagline: 'Full command over every corner of your workplace — from one screen.',
    image: '/images/Admin.webp',
    imageAlt: 'Admin managing workplace dashboard',
    accentColor: '#3a57a1',
    accentBg: 'rgba(58, 87, 161, 0.08)',
    features: [
      {
        icon: <Monitor size={16} />,
        title: 'Real-Time Occupancy Dashboard',
        desc: 'Live headcount, space usage, and visitor flow across all zones.',
      },
      {
        icon: <MapPin size={16} />,
        title: 'Multi-Location Management',
        desc: 'Manage all your office sites from one centralised admin panel.',
      },
      {
        icon: <BarChart3 size={16} />,
        title: 'Operational Analytics',
        desc: 'Reports on usage, peak times, and workplace efficiency trends.',
      },
      {
        icon: <Sliders size={16} />,
        title: 'Customisable Dashboard',
        desc: 'Tailor widgets, alerts, and views to match your workflow.',
      },
    ],
    stat: { val: '100%', label: 'Visibility across sites' },
    ctaLabel: 'Explore Admin Features',
  },
  {
    id: 'hr',
    label: 'HR & People',
    roleTitle: 'HR Manager',
    tagline: 'Every candidate accounted for, organized from arrival to approval.',
    image: '/images/HR & People.webp',
    imageAlt: 'HR manager smiling on campus',
    accentColor: '#0ea5e9',
    accentBg: 'rgba(14, 165, 233, 0.08)',
    features: [
      {
        icon: <CalendarSearch size={16} />,
        title: 'Interview Candidate Register',
        desc: 'Log each candidate at the gate, tagged to the hiring department, with photo and CNIC on record.',
      },
      {
        icon: <ListPlus size={16} />,
        title: 'Employee Account Approvals',
        desc: 'Review Employee Portal sign-ups and approve staff before they can invite guests.',
      },
      {
        icon: <MailCheck size={16} />,
        title: 'Department & HOD Setup',
        desc: 'Add departments, assign Heads of Department and save their WhatsApp contact numbers.',
      },
    ],
    stat: { val: '100%', label: ' Candidates on record' },
    ctaLabel: 'Explore HR Features',
  },
  {
    id: 'security',
    label: 'Security',
    roleTitle: 'Security Officer',
    tagline: 'Every entry is verified. Every risk is flagged before it becomes a problem.',
    image: '/images/Security.webp',
    imageAlt: 'Security officer outside building',
    accentColor: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.08)',
    features: [
      {
        icon: <Eye size={16} />,
        title: 'Watchlist & ID Screening',
        desc: 'Instant flag on blocked or flagged IDs at the point of entry.',
      },
      {
        icon: <HardHat size={16} />,
        title: 'Contractor Tracking',
        desc: 'Monitor active contractors, zones, and permit validity in real time.',
      },
      {
        icon: <ClipboardList size={16} />,
        title: 'Daily Compliance Checklist',
        desc: 'Guard logs, handover reports, and audit trails in one tap.',
      },
      {
        icon: <Crown size={16} />,
        title: 'VIP Guest Management',
        desc: 'Pre-cleared high-priority entries with dedicated arrival workflows.',
      },
    ],
    stat: { val: '0', label: 'Unverified entries allowed' },
    ctaLabel: 'Explore Security Features',
  },
  {
    id: 'employees',
    label: 'Employees',
    roleTitle: 'TEAM MEMBER',
    tagline: '•Invite your guests and know when they arrive, all from the Employee Portal.',
    image: '/images/Employees.webp',
    imageAlt: 'Employee walking into modern office',
    accentColor: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.08)',
    features: [
      {
        icon: <Bell size={16} />,
        title: 'Guest Invitations',
        desc: 'Invite a guest before they arrive so the gate is expecting them.',
      },
      {
        icon: <Monitor size={16} />,
        title: 'Arrival Notifications',
        desc: 'Get notified as soon as your guest checks in at the gate.',
      },
      {
        icon: <CalendarSearch size={16} />,
        title: 'One-Tap Re-invite',
        desc: 'invite a returning guest again straight from your visit history.',
      },
      {
        icon: <PackageCheck size={16} />,
        title: 'Guest History',
        desc: 'See every guest you’ve invited and when they visited.',
      },
    ],
    stat: { val: '1 Tap ', label: 'To re-invite a returning guest' },
    ctaLabel: 'Explore Employee Features',
  },
];

/* ─── Component ─────────────────────────────────────────────────────────────── */

export const FeaturesFold: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('admin');
  const active = personas.find((p) => p.id === activeId) ?? personas[0];

  return (
    <section className="features-section" id="features">
      <div className="features-container">

        {/* ── Section Header ── */}
        <div className="features-header">
          <div className="light-pill-badge">
            <span className="dot" />
            <span>11:00 · Role-Based Experience</span>
          </div>
          <h2 className="features-h2">
            Built for Everyone Who<br />
            Runs Your Workplace
          </h2>
          <p className="features-subheadline">
            Whether you manage the building, screen visitors, coordinate people, or just need
            a smooth daily experience — Gate Shield has a feature set built exactly for you.
          </p>
        </div>

        {/* ── Persona Tab Switcher ── */}
        <div className="features-tabs" role="tablist" aria-label="Persona switcher">
          {personas.map((p) => {
            const isActive = p.id === activeId;
            return (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`features-tab-btn ${isActive ? 'active' : ''}`}
                style={isActive ? ({ '--tab-accent': p.accentColor } as React.CSSProperties) : undefined}
                onClick={() => setActiveId(p.id)}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* ── Main Content: 2-Column Split ── */}
        <div className="features-content-grid" key={active.id}>

          {/* Left: Feature List Column */}
          <div className="features-left-col">
            {/* Role Intro */}
            <div className="features-role-intro">
              <span
                className="features-role-chip"
                style={{ color: active.accentColor, background: active.accentBg }}
              >
                {active.roleTitle}
              </span>
              <p className="features-tagline">{active.tagline}</p>
            </div>

            {/* Feature Cards */}
            <div className="features-card-list">
              {active.features.map((feat, idx) => (
                <div
                  className="feature-card"
                  key={idx}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div
                    className="feature-card-icon"
                    style={{ color: active.accentColor, background: active.accentBg }}
                  >
                    {feat.icon}
                  </div>
                  <div className="feature-card-body">
                    <span className="feature-card-title">{feat.title}</span>
                    <span className="feature-card-desc">{feat.desc}</span>
                  </div>
                  <CheckCircle2
                    size={16}
                    className="feature-card-check"
                    style={{ color: active.accentColor }}
                  />
                </div>
              ))}
            </div>

            {/* Stat + CTA Row */}
            <div className="features-bottom-row">
              <div className="features-stat-pill">
                <span
                  className="features-stat-val"
                  style={{ color: active.accentColor }}
                >
                  {active.stat.val}
                </span>
                <span className="features-stat-label">{active.stat.label}</span>
              </div>
              <Link
                href="#contact"
                className="features-cta-link"
              >
                <span>{active.ctaLabel}</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Right: Image Showcase Column */}
          <div className="features-right-col">
            {/* Background image card */}
            <div className="features-image-card">
              <img
                src={active.image}
                alt={active.imageAlt}
                className="features-persona-img"
              />

              {/* Floating stat chip over image */}
              <div className="features-img-overlay-chip">
                <span
                  className="features-overlay-dot"
                  style={{ background: active.accentColor }}
                />
                <div>
                  <div className="features-overlay-val" style={{ color: active.accentColor }}>
                    {active.stat.val}
                  </div>
                  <div className="features-overlay-label">{active.stat.label}</div>
                </div>
              </div>

              {/* Role badge bottom-left of image */}
              <div className="features-img-role-badge">
                <span
                  className="features-img-role-dot"
                  style={{ background: active.accentColor }}
                />
                {active.roleTitle}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

