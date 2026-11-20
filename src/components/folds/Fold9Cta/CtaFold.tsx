'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  QrCode,
  Wifi,
} from 'lucide-react';
import { landingData } from '@/data/landingData';
import { useContactModal } from '@/components/common/ContactModal';

export const CtaFold: React.FC = () => {
  const { fold9Cta, navigation } = landingData;
  const { openModal } = useContactModal();

  return (
    <section className="cta-section" id="contact">
      <div className="cta-container">
        <div className="cta-grid">
          {/* Left Column: Heading, Subheadline & Dual CTAs */}
          <div className="cta-content-col">
            <div className="pill-badge cta-pill">
              <span className="dot-indicator" />
              <span>22:30 · Get Started</span>
            </div>

            <h2 className="cta-h2">
              Ready to Leave
              <br />
              <span className="cta-accent-text">Paper Registers</span>
              <br />
              Behind?
            </h2>

            <p className="cta-subheadline">
            See GateShield running at your gate in a short demo, in English or Urdu.
            </p>

            {/* Action Buttons */}
            <div className="cta-actions-row">
              <button
                type="button"
                onClick={openModal}
                className="cta-primary-btn"
              >
                <span>Book a Demo</span>
                <ArrowRight size={16} />
              </button>

              <Link
                href={navigation.ctaWhatsApp.href}
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary-btn"
              >
                <MessageCircle size={17} />
                <span>Chat on WhatsApp</span>
              </Link>
            </div>

            {/* Trust Checks Strip */}
            <div className="cta-trust-strip">
              <div className="cta-trust-item">
                <span className="cta-trust-dot" />
                <span>14-day free trial</span>
              </div>
              <div className="cta-trust-item">
                <span className="cta-trust-dot" />
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Device Mockup with Framer Ambient Glow */}
          <div className="cta-visual-col">
            <div className="cta-ambient-glow" />

            {/* Floating Notification Pills (Framer Signature) */}
            <div className="cta-floating-chip left-chip">
              <span className="chip-dot-green" />
              <div className="chip-text-wrap">
                <span className="chip-title">ID Scanned</span>
                <span className="chip-sub">Details filled in automatically</span>
              </div>
            </div>

            <div className="cta-floating-chip right-chip">
              <span className="chip-dot-blue" />
              <div className="chip-text-wrap">
                <span className="chip-title">Badge Printed</span>
                <span className="chip-sub">QR code ready for checkout</span>
              </div>
            </div>

            {/* Floating Phone Device Shell */}
            <div className="cta-phone-shell">
              <div className="cta-phone-notch" />

              {/* Status Bar */}
              <div className="cta-status-bar">
                <span className="cta-time">09:00</span>
                <div className="cta-status-right">
                  <Wifi size={12} />
                  <span className="cta-battery-icon" />
                </div>
              </div>

              {/* Phone Content Screen */}
              <div className="cta-screen-inner">
                <div className="cta-pass-time-display">
                  <span className="pass-big-time">09:00</span>
                  <span className="pass-active-badge">● Active Visitor Pass</span>
                </div>

                {/* Visitor Card */}
                <div className="cta-visitor-card">
                  <div className="visitor-card-header">
                    <div className="visitor-avatar">AH</div>
                    <div>
                      <div className="visitor-name">Ahmed Hassan</div>
                      <div className="visitor-role">Visitor · Administration</div>
                    </div>
                  </div>

                  <div className="visitor-qr-box">
                    <QrCode size={48} className="qr-svg-icon" />
                    <div className="qr-meta-text">
                      <span className="qr-valid-text">Main Gate · Card #VC473</span>
                      <span className="qr-sub-text">Host: Asif · Entry Logged</span>
                    </div>
                  </div>

                  <div className="visitor-status-strip">
                    <CheckCircle2 size={14} color="#10b981" />
                    <span>CNIC Verified · Watchlist Cleared</span>
                  </div>
                </div>

                {/* Bottom Slide Action Button */}
                <div className="cta-phone-slide-bar">
                  <div className="slide-thumb">
                    <ArrowRight size={14} />
                  </div>
                  <span className="slide-label">Slide to verify next entry</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

