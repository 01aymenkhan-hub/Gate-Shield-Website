'use client';

import React, { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export const ScrollAnimations: React.FC = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // =========================================================
      // FOLD 1: HERO — entrance on page load (no scroll trigger)
      // =========================================================
      const heroSection = document.querySelector('.hero-section');
      if (heroSection) {
        const badge     = heroSection.querySelector('.hero-pill-badge');
        const heading   = heroSection.querySelector('.hero-heading');
        const subhead   = heroSection.querySelector('.hero-subheading');
        const ctaGroup  = heroSection.querySelector('.hero-cta-group');
        const ambTime   = heroSection.querySelector('.hero-ambient-time');
        const heroRight = heroSection.querySelector('.hero-right');

        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (badge)     heroTl.fromTo(badge,    { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55 }, 0.1);
        if (heading)   heroTl.fromTo(heading,  { y: 32,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.25);
        if (subhead)   heroTl.fromTo(subhead,  { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6  }, 0.45);
        if (ctaGroup)  heroTl.fromTo(ctaGroup, { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.6  }, 0.6);
        if (ambTime)   heroTl.fromTo(ambTime,  { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5  }, 0.55);
        if (heroRight) heroTl.fromTo(heroRight,{ x: 40,  opacity: 0, scale: 0.97 }, { x: 0, opacity: 1, scale: 1, duration: 0.9 }, 0.3);
      }

      // =========================================================
      // FOLD 2: STATS
      // =========================================================
      const statsSection = document.querySelector('.stats-section');
      if (statsSection) {
        const badge      = statsSection.querySelector('.light-pill-badge');
        const statItems  = statsSection.querySelectorAll('.stat-item');
        const trustBar   = statsSection.querySelector('.trust-bar');

        const st = { trigger: statsSection, start: 'top 82%', once: true };

        if (badge) {
          gsap.fromTo(badge,
            { y: -14, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', scrollTrigger: st }
          );
        }

        if (statItems.length > 0) {
          gsap.fromTo(statItems,
            { y: 45, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.65, stagger: 0.1, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 78%' },
            }
          );
        }

        if (trustBar) {
          gsap.fromTo(trustBar,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out',
              scrollTrigger: { ...st, start: 'top 72%' },
            }
          );
        }
      }

      // =========================================================
      // FOLD 4: MODULES (tabs + preview)
      // =========================================================
      const modulesSection = document.querySelector('.modules-section');
      if (modulesSection) {
        const header       = modulesSection.querySelector('.modules-header');
        const leftTabs     = modulesSection.querySelector('.modules-tabs-list');
        const previewPanel = modulesSection.querySelector('.module-preview-panel');

        const st = { trigger: modulesSection, start: 'top 82%', once: true };

        if (header) {
          gsap.fromTo(header,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: st }
          );
        }

        if (leftTabs) {
          gsap.fromTo(leftTabs,
            { x: -40, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 76%' },
            }
          );
        }

        if (previewPanel) {
          gsap.fromTo(previewPanel,
            { x: 40, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 76%' },
            }
          );
        }
      }

      // =========================================================
      // FOLD 5: FEATURES
      // =========================================================
      const featuresSection = document.querySelector('.features-section');
      if (featuresSection) {
        const header      = featuresSection.querySelector('.features-header');
        const tabs        = featuresSection.querySelector('.features-tabs');
        const leftCol     = featuresSection.querySelector('.features-left-col');
        const rightCol    = featuresSection.querySelector('.features-right-col');

        const st = { trigger: featuresSection, start: 'top 82%', once: true };

        if (header) {
          gsap.fromTo(header,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: st }
          );
        }

        if (tabs) {
          gsap.fromTo(tabs,
            { y: 18, opacity: 0 },
            {
              y: 0, opacity: 1, duration: 0.55, ease: 'power2.out',
              scrollTrigger: { ...st, start: 'top 78%' },
            }
          );
        }

        if (leftCol) {
          gsap.fromTo(leftCol,
            { x: -32, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 74%' },
            }
          );
        }

        if (rightCol) {
          gsap.fromTo(rightCol,
            { x: 32, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 74%' },
            }
          );
        }
      }

      // =========================================================
      // FOLD 6: WORKFLOW / HOW IT WORKS
      // =========================================================
      const workflowSection = document.querySelector('.workflow-section');
      if (workflowSection) {
        const leftCol  = workflowSection.querySelector('.workflow-left');
        const phone    = workflowSection.querySelector('.workflow-phone-shell');
        const rightCol = workflowSection.querySelector('.workflow-right');

        const st = { trigger: workflowSection, start: 'top 82%', once: true };

        if (leftCol) {
          gsap.fromTo(leftCol,
            { x: -36, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: st }
          );
        }

        if (phone) {
          gsap.fromTo(phone,
            { y: 50, scale: 0.95, opacity: 0 },
            {
              y: 0, scale: 1, opacity: 1, duration: 0.9, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 78%' },
            }
          );
        }

        if (rightCol) {
          gsap.fromTo(rightCol,
            { x: 36, opacity: 0 },
            {
              x: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 78%' },
            }
          );
        }
      }

      // =========================================================
      // FOLD 7: PRICING
      // =========================================================
      const pricingSection = document.querySelector('.pricing-section');
      if (pricingSection) {
        const header = pricingSection.querySelector('.pricing-header');
        const cards  = pricingSection.querySelectorAll('.pricing-card');

        const st = { trigger: pricingSection, start: 'top 82%', once: true };

        if (header) {
          gsap.fromTo(header,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: st }
          );
        }

        if (cards.length > 0) {
          gsap.fromTo(cards,
            { y: 50, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.7, stagger: 0.15, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 76%' },
            }
          );
        }
      }

      // =========================================================
      // FOLD 8: INDUSTRIES
      // =========================================================
      const industriesSection = document.querySelector('.industries-section');
      if (industriesSection) {
        const header = industriesSection.querySelector('.industries-header');
        const cards  = industriesSection.querySelectorAll('.industry-card');

        const st = { trigger: industriesSection, start: 'top 82%', once: true };

        if (header) {
          gsap.fromTo(header,
            { y: 28, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', scrollTrigger: st }
          );
        }

        if (cards.length > 0) {
          gsap.fromTo(cards,
            { y: 36, opacity: 0 },
            {
              y: 0, opacity: 1,
              duration: 0.55, stagger: 0.07, ease: 'power3.out',
              scrollTrigger: { ...st, start: 'top 76%' },
            }
          );
        }
      }

      // =========================================================
      // FOLD 9: CTA
      // =========================================================
      const ctaSection = document.querySelector('.cta-section');
      if (ctaSection) {
        const contentCol = ctaSection.querySelector('.cta-content-col');
        const badge      = ctaSection.querySelector('.pill-badge');
        const h2         = ctaSection.querySelector('.cta-h2');
        const subhead    = ctaSection.querySelector('.cta-subheadline');
        const actions    = ctaSection.querySelector('.cta-actions-row');
        const trust      = ctaSection.querySelector('.cta-trust-strip');

        const st = { trigger: ctaSection, start: 'top 82%', once: true };

        if (contentCol) {
          const ctaTl = gsap.timeline({
            scrollTrigger: { ...st, start: 'top 78%' },
          });

          if (badge)   ctaTl.fromTo(badge,   { y: -12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0);
          if (h2)      ctaTl.fromTo(h2,      { y: 32,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.7,  ease: 'power3.out' }, 0.15);
          if (subhead) ctaTl.fromTo(subhead, { y: 20,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power2.out' }, 0.35);
          if (actions) ctaTl.fromTo(actions, { y: 18,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.5,  ease: 'power2.out' }, 0.5);
          if (trust)   ctaTl.fromTo(trust,   { y: 14,  opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power2.out' }, 0.65);
        }
      }

      // =========================================================
      // NAVBAR — slide down on load
      // =========================================================
      const navbar = document.querySelector('.navbar-container');
      if (navbar) {
        gsap.fromTo(navbar,
          { y: -60, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.05 }
        );
      }

      // Refresh after all triggers registered
      ScrollTrigger.refresh();
    });

    return () => ctx.revert();
  }, []);

  return null;
};
