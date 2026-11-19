'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronUp } from 'lucide-react';
import { landingData } from '@/data/landingData';

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/GateShieldpro/',
    className: 'social-facebook',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M13.5 21v-8.2h2.76l.41-3.2H13.5V7.55c0-.93.26-1.56 1.59-1.56h1.7V3.13c-.3-.04-1.3-.13-2.48-.13-2.45 0-4.13 1.5-4.13 4.24v2.36H7.4v3.2h2.78V21h3.32Z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/gateshieldpro/',
    className: 'social-instagram',
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
        <circle cx="12" cy="12" r="4.2" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://www.youtube.com/@Gateshieldpro',
    className: 'social-youtube',
    icon: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
      </svg>
    ),
  },
];

export const Footer: React.FC = () => {
  const { navigation } = landingData;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Main Clean Row: Brand Logo on Left, Navigation on Right */}
        <div className="footer-main-row">
          <div className="footer-brand-wrap">
            <Link href="/" className="footer-logo-link">
              <img
                src="/logo/logo-white.png"
                alt="GateShield Logo"
                width={150}
                height={38}
                className="footer-logo-img"
              />
            </Link>
            <p className="footer-short-desc">
              Smart workplace security & visitor management.
            
            </p>
            <div className="footer-social-links" aria-label="Social Media">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  title={social.name}
                  className={`footer-social-link ${social.className}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <nav className="footer-nav-links" aria-label="Footer Navigation">
            {navigation.links.map((link) => (
              <Link key={link.href} href={link.href} className="footer-nav-link">
                {link.label}
              </Link>
            ))}
            <Link
              href={navigation.ctaWhatsApp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-nav-link footer-wa-link"
            >
              WhatsApp
            </Link>
          </nav>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} GateShield · Powered by{' '}
            <a
              href="https://artxpro.com"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-agency-link"
            >
              Artxpro
            </a>
            . All rights reserved.
          </p>

          <button
            type="button"
            className="footer-back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <span>Back to top</span>
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
};
