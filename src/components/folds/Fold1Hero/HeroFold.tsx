'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { landingData } from '@/data/landingData';
import { useContactModal } from '@/components/common/ContactModal';

interface HeroScene {
  id: string;
  tabLabel: string;
  ambientLabel: string;
  ambientTime: string;
  bgImage: string;
  visitorName: string;
  statusBadge: string;
  score: string;
  currentStep: string;
  nextStep: string;
  notifHeadline: string;
  notifDesc: string;
}

const HERO_SCENES: HeroScene[] = [
  {
    id: 'scene-1',
    tabLabel: '09:00 CHECK-IN',
    ambientLabel: 'LOBBY',
    ambientTime: '09:00',
    bgImage: '/images/hero-scene-1.webp',
    visitorName: 'David Vance',
    statusBadge: '1/3 SCANNING',
    score: '33%',
    currentStep: 'CNIC ID Scanned',
    nextStep: 'Host Approval Pending',
    notifHeadline: 'ID Scanned: David Vance',
    notifDesc: 'CNIC verified. Awaiting 1-tap host confirmation.',
  },
  {
    id: 'scene-2',
    tabLabel: '09:01 SECURITY SCAN',
    ambientLabel: 'SCAN',
    ambientTime: '09:01',
    bgImage: '/images/hero-scene-2.webp', // Runner image from user's screenshot
    visitorName: 'Sarah Jenkins',
    statusBadge: '2/4 TODAY',
    score: '13 days',
    currentStep: 'Watchlist Screened',
    nextStep: 'QR Badge Issued',
    notifHeadline: 'GateShield Verified',
    notifDesc: 'Pass active. Gate 02 turnstile access granted.',
  },
  {
    id: 'scene-3',
    tabLabel: '09:02 Visitor Entered',
    ambientLabel: 'Entered',
    ambientTime: '09:02',
    bgImage: '/images/hero-scene-3.webp',
    visitorName: 'Alex Thorne',
    statusBadge: '3/3 CLEAR',
    score: '100%',
    currentStep: 'Room B Booked',
    nextStep: 'Catering Requested',
    notifHeadline: 'Room B Unlocked: Alex Thorne',
    notifDesc: 'Meeting in Conference Room B started on time.',
  },
  {
    id: 'scene-4',
    tabLabel: '12:00 Visitor Exit',
    ambientLabel: 'EXIT',
    ambientTime: '12:00',
    bgImage: '/images/hero-scene-4.webp',
    visitorName: 'Maya Lin',
    statusBadge: 'COMPLETED',
    score: 'Logged',
    currentStep: 'QR Checked-Out',
    nextStep: 'Digital Log Archived',
    notifHeadline: 'Visitor Exit Logged',
    notifDesc: 'Audit trail recorded. Tamper-proof record sealed.',
  },
];

export const HeroFold: React.FC = () => {
  // Default to scene index 1 (the runner image matching the screenshot)
  const [activeSceneIndex, setActiveSceneIndex] = useState(1);
  const activeScene = HERO_SCENES[activeSceneIndex];
  const { fold1Hero } = landingData;
  const { openModal } = useContactModal();

  // Auto-advance or allow user interactive selection
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSceneIndex((prev) => (prev + 1) % HERO_SCENES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section" id="hero">
      {/* Background Image Layer */}
      <div className="hero-bg-layer active">
        <img
          src="/images/Home Page Banner.webp"
          alt="GateShield Reception and Visitor Check-in"
          className="hero-bg-image"
        />
      </div>

      {/* Dark Ambient Vignette Overlay */}
      <div className="hero-overlay" />

      {/* Main Hero Container */}
      <div className="hero-container">
        {/* Left Column: Headlines & Dual Store-style CTAs */}
        <div className="hero-left">
          {/* Ambient Time Indicator (Exact structure from SS: RUN / 07:40) */}
          <div className="hero-ambient-time">
            <div className="time-label">{activeScene.ambientLabel}</div>
            <div className="time-value">{activeScene.ambientTime}</div>
          </div>

          {/* Pill Badge */}
          <div className="hero-pill-badge">
            <span className="dot" />
            <span>New · GateShield 3.0 with Smart QR Screening</span>
          </div>

          {/* Main Headline with Accent Line */}
          <h1 className="hero-heading">
            A Smarter Way to
            <span className="accent-text">Welcome Every Visitor.</span>
          </h1>

          {/* Subheading */}
          <p className="hero-subheading">{fold1Hero.subheading}</p>

          {/* Dual Store-Style CTA Cards */}
          <div className="hero-cta-group">
            {/* Primary Action: Contact & Book Demo */}
            <button
              type="button"
              onClick={openModal}
              className="hero-cta-card primary"
            >
              <div className="hero-cta-icon">
                <ShieldCheck size={22} />
              </div>
              <div className="hero-cta-text">
                <span className="hero-cta-sub">Instant Setup</span>
                <span className="hero-cta-title">Book A Demo</span>
              </div>
            </button>

            {/* WhatsApp Direct Action */}
            <Link
              href={fold1Hero.whatsappCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-cta-card whatsapp"
            >
              <div className="hero-cta-icon">
                <MessageCircle size={22} />
              </div>
              <div className="hero-cta-text">
                <span className="hero-cta-sub">Instant Response</span>
                <span className="hero-cta-title">Chat on WhatsApp</span>
              </div>
            </Link>
          </div>

          {/* Agency Trust Endorsement Strip */}
          {/* <div className="hero-trust-bar">
            <span className="hero-trust-dot" />
            <span>
              Powered by{' '}
              <a
                href="https://artxpro.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-agency-link"
              >
                Artxpro
              </a>{' '}
              · Premier Digital Agency & Enterprise Infrastructure
            </span>
          </div> */}
        </div>

        {/* Right Column: Realistic Phone Mockup & Floating Notification */}
        <div className="hero-right">
          <div className="phone-mockup-wrapper">
            <img
              src="/images/Hero Mobile Mockup Dark.webp"
              alt="GateShield Mobile App Mockup"
              width={310}
              height={660}
              className="phone-mockup-img"
            />

            {/* Overlapping Floating Notification (Exact layout from SS!) */}
            <div className="hero-floating-notification">
              <div className="notif-header">
                <div className="notif-app-info">
                  <div className="notif-app-icon">G</div>
                  <span className="notif-app-name">GATESHIELD</span>
                </div>
                <span className="notif-time">now</span>
              </div>
              <div className="notif-title">Pass verified, Gate 02</div>
              <div className="notif-desc">
                QR pass validated. Visitor {activeScene.visitorName} authorized for entry.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
