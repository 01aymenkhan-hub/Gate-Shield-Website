'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  ArrowUpRight,
  MessageCircle,
  Globe,
  ChevronDown,
  Check,
} from 'lucide-react';
import { landingData } from '@/data/landingData';
import { useCurrency } from '@/components/common/CurrencyProvider';
import { useContactModal } from '@/components/common/ContactModal';
import { SUPPORTED_CURRENCIES, type CurrencyCode } from '@/lib/currency';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const { navigation } = landingData;
  const { currency, setCurrency } = useCurrency();
  const { openModal } = useContactModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!currencyOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        currencyDropdownRef.current &&
        !currencyDropdownRef.current.contains(event.target as Node)
      ) {
        setCurrencyOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setCurrencyOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [currencyOpen]);

  const handleSelectCurrency = (code: CurrencyCode) => {
    setCurrency(code);
    setCurrencyOpen(false);
  };

  return (
    <header className={`navbar-container ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Left: Brand Logo */}
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

        {/* Right: Currency Selector & CTA Actions */}
        <div className="navbar-actions">
          {/* Currency Dropdown */}
          <div className="navbar-currency-wrap" ref={currencyDropdownRef}>
            <button
              type="button"
              className={`navbar-currency-btn ${currencyOpen ? 'open' : ''}`}
              onClick={() => setCurrencyOpen((prev) => !prev)}
              aria-haspopup="listbox"
              aria-expanded={currencyOpen}
              aria-label="Select currency"
              title="Change pricing currency"
            >
              <Globe size={14} />
              <span className="navbar-currency-code">{currency}</span>
              <ChevronDown
                size={13}
                className={`navbar-currency-chevron ${currencyOpen ? 'rotated' : ''}`}
              />
            </button>

            {currencyOpen && (
              <div
                className="navbar-currency-menu"
                role="listbox"
                aria-label="Available currencies"
              >
                {SUPPORTED_CURRENCIES.map((item) => {
                  const isSelected = item.code === currency;
                  return (
                    <button
                      key={item.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={`navbar-currency-option ${isSelected ? 'active' : ''}`}
                      onClick={() => handleSelectCurrency(item.code)}
                    >
                      <span className="currency-option-left">
                        <span className="currency-option-code">{item.code}</span>
                        <span className="currency-option-label">{item.label}</span>
                      </span>
                      <span className="currency-option-right">
                        <span className="currency-option-symbol">{item.symbol}</span>
                        {isSelected && <Check size={13} className="currency-option-check" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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

          <button
            type="button"
            onClick={openModal}
            className="navbar-cta-btn"
          >
            <span>{navigation.ctaContact.label}</span>
            <ArrowUpRight size={15} />
          </button>

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

          {/* Mobile Currency Picker */}
          <div className="navbar-drawer-currency">
            <div className="navbar-drawer-currency-label">
              <Globe size={13} />
              <span>Currency</span>
            </div>
            <div className="navbar-drawer-currency-grid">
              {SUPPORTED_CURRENCIES.map((item) => {
                const isSelected = item.code === currency;
                return (
                  <button
                    key={item.code}
                    type="button"
                    className={`navbar-drawer-currency-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelectCurrency(item.code)}
                  >
                    <span>{item.code}</span>
                  </button>
                );
              })}
            </div>
          </div>

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
            <button
              type="button"
              className="navbar-cta-btn navbar-drawer-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                openModal();
              }}
            >
              <span>{navigation.ctaContact.label}</span>
              <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
