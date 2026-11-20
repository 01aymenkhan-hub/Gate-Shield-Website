'use client';

import React from 'react';
import { useContactModal } from '@/components/common/ContactModal';
import {
  Check,
  Sparkles,
  ArrowRight,
  Building2,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { useCurrency } from '@/components/common/CurrencyProvider';

export const PricingFold: React.FC = () => {
  const { currencyInfo, formatNumberFromPkr, formatInlineFromPkr } = useCurrency();
  const { openModal } = useContactModal();

  return (
    <section className="pricing-section" id="pricing">
      <div className="pricing-container">
        {/* Section Header */}
        <div className="pricing-header">
          <div className="light-pill-badge">
            <span className="dot" />
            <span>12:00 · Transparent Pricing</span>
          </div>

          <h2 className="pricing-h2">The Right Solution at the Right Price</h2>

          <p className="pricing-subheadline">
          No hidden fees. Pay monthly, or pay annually and save.
          </p>
        </div>

        {/* 3-Card Modern Pricing Grid */}
        <div className="pricing-cards-grid">
          {/* Card 1: Starter */}
          <div className="pricing-card card-starter">
            <div className="pricing-card-inner">
              <div className="card-top-meta">
                <span className="card-tier-badge">
                  <Zap size={12} />
                  <span>Essential</span>
                </span>
              </div>

              <div className="card-head-block">
                <h3 className="card-title">Starter</h3>
                <p className="card-subtitle">
                Ideal for single offices replacing their paper register.
                </p>
              </div>

              <div className="card-price-block">
                <div className="card-price-row">
                  <span className="price-currency">{currencyInfo.symbol}</span>
                  <span className="price-amount">{formatNumberFromPkr(9950)}</span>
                  <span className="price-period">/month</span>
                </div>

                <div className="card-billing-info">
                  <p className="billing-annual">
                    {formatInlineFromPkr(7000)} /month, billed annually at{' '}
                    {formatInlineFromPkr(84000)}
                  </p>
                  <span className="billing-savings-pill">
                    Save {formatInlineFromPkr(36000)} a year (30%)
                  </span>
                </div>
              </div>

              <div className="card-divider" />

              <div className="card-features-wrap">
                <div className="card-features-label">WHAT&apos;S INCLUDED</div>
                <div className="card-features-list">
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>250 check-ins /month</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Up to 10 Employees</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Single location</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Vechile Entries</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Standard support</span>
                  </div>
                </div>
              </div>

              <div className="card-action-wrap">
                <button
                  type="button"
                  onClick={openModal}
                  className="pricing-action-btn outline-btn"
                >
                  <span>Sign Up</span>
                  <ArrowRight size={15} className="btn-arrow" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Premium (Recommended Highlight) */}
          <div className="pricing-card card-premium-recommended">
            <div className="pricing-card-glow" aria-hidden="true" />
            <div className="recommended-ribbon" aria-label="Recommended plan">
              <Sparkles size={11} />
              <span>Recommended</span>
            </div>
            <div className="pricing-card-inner highlight-inner">
              <div className="card-head-block">
                <h3 className="card-title text-white">Premium</h3>
                <p className="card-subtitle text-white-dim">
                Built for growing teams managing multiple gates.
                </p>
              </div>

              <div className="card-price-block">
                <div className="card-price-row text-white">
                  <span className="price-currency text-white-dim">{currencyInfo.symbol}</span>
                  <span className="price-amount text-white">{formatNumberFromPkr(14950)}</span>
                  <span className="price-period text-white-dim">/month</span>
                </div>

                <div className="card-billing-info">
                  <p className="billing-annual text-white-dim">
                    {formatInlineFromPkr(12000)} /month, billed annually at{' '}
                    {formatInlineFromPkr(144000)}
                  </p>
                  <span className="billing-savings-pill recommended-savings">
                    Save {formatInlineFromPkr(36000)} a year (20%)
                  </span>
                </div>
              </div>

              <div className="card-divider divider-light" />

              <div className="card-features-wrap">
                <div className="card-features-label text-white-dim">
                  EVERYTHING IN STARTER, PLUS
                </div>
                <div className="card-features-list">
                  <div className="feature-item text-white">
                    <div className="feature-check white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>500 check-ins /month</span>
                  </div>
                  <div className="feature-item text-white">
                    <div className="feature-check white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Up to 50 Employees</span>
                  </div>
                  <div className="feature-item text-white">
                    <div className="feature-check white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Whatsapp Integration</span>
                  </div>
                  <div className="feature-item text-white">
                    <div className="feature-check white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>2 Locations</span>
                  </div>
                  <div className="feature-item text-white">
                    <div className="feature-check white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Vechile Entries</span>
                  </div>
                  <div className="feature-item text-white">
                    <div className="feature-check white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Meeting Room</span>
                  </div>
                  <div className="feature-item text-white">
                    <div className="feature-check white">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Standard Support</span>
                  </div>
                </div>
              </div>

              <div className="card-action-wrap">
                <button
                  type="button"
                  onClick={openModal}
                  className="pricing-action-btn solid-white-btn"
                >
                  <span>Sign Up</span>
                  <ArrowRight size={15} className="btn-arrow" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Enterprise */}
          <div className="pricing-card card-enterprise">
            <div className="pricing-card-inner">
              <div className="card-top-meta">
                <span className="card-tier-badge enterprise-pill">
                  <Building2 size={12} />
                  <span>Custom Scale</span>
                </span>
              </div>

              <div className="card-head-block">
                <h3 className="card-title">Enterprise</h3>
                <p className="card-subtitle">
                Tailored deployment and support for large facilities.
                </p>
              </div>

              <div className="card-price-block">
                <div className="card-price-row connect-row">
                  <span className="connect-heading">Custom pricing</span>
                </div>

                <div className="card-billing-info">
                  <p className="billing-annual">Custom annual deployment</p>
                  <span className="billing-savings-pill neutral-pill">
                    Dedicated onboarding &amp; SLA
                  </span>
                </div>
              </div>

              <div className="card-divider" />

              <div className="card-features-wrap">
                <div className="card-features-label">EVERYTHING IN PREMIUM, PLUS</div>
                <div className="card-features-list">
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Unlimited visitors</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Unlimited Employees</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Unlimited gates and operators</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Black listing</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Whatsapp Integration</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Evacuation alerts</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Meeting Room</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-check green">
                      <Check size={12} strokeWidth={3} />
                    </div>
                    <span>Standard Support</span>
                  </div>
                </div>
              </div>

              <div className="card-action-wrap">
                <button
                  type="button"
                  onClick={openModal}
                  className="pricing-action-btn outline-btn"
                >
                  <span>Contact Us</span>
                  <ArrowRight size={15} className="btn-arrow" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Assurance Strip */}
        <div className="pricing-assurance-strip">
          <ShieldCheck size={15} />
          <span>No hidden fees · Quick setup · Support on every plan</span>
        </div>
      </div>
    </section>
  );
};
