'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { landingData } from '@/data/landingData';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { navigation } = landingData;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Left: Brand Logo & Agency Trust Badge */}
        <div className="navbar-brand-group">
          <Link href="/" className="navbar-logo-wrap">
            <img
              src="/logo/logo-white.png"
              alt="GateShield Logo"
              width={145}
              height={38}
              className="navbar-logo-img"
            />
          </Link>

        </div>

        {/* Center: Glass Pill Navigation Menu */}
        <nav className="navbar-pill-menu" aria-label="Main Navigation">
          {navigation.links.map((link) => (
            <Link key={link.href} href={link.href} className="navbar-link">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Dual CTA Actions */}
        <div className="navbar-actions">
          <Link
            href={navigation.ctaWhatsApp.href}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-cta-btn whatsapp-cta"
            title="Chat directly on WhatsApp"
          >
            <MessageCircle size={15} />
            <span>WhatsApp</span>
          </Link>

          <Link
            href={navigation.ctaContact.href}
            className="navbar-cta-btn"
          >
            <span>{navigation.ctaContact.label}</span>
            <ArrowUpRight size={15} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="navbar-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-drawer">
          {navigation.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="navbar-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="navbar-mobile-drawer-actions">
            <Link
              href={navigation.ctaWhatsApp.href}
              target="_blank"
              rel="noopener noreferrer"
              className="navbar-cta-btn whatsapp-cta navbar-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <MessageCircle size={16} />
              <span>WhatsApp Chat</span>
            </Link>
            <Link
              href={navigation.ctaContact.href}
              className="navbar-cta-btn navbar-drawer-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>{navigation.ctaContact.label}</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
