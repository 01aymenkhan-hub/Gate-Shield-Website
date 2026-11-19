'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface TextSegment {
  type: 'text';
  text: string;
  colorType: 'contrast' | 'accent' | 'normal';
}

interface PillSegment {
  type: 'pill';
  pillId: string;
}

type TokenSegment = TextSegment | PillSegment;

const SEGMENTS: TokenSegment[] = [
  { type: 'text', text: 'Less paperwork, ', colorType: 'contrast' },
  { type: 'text', text: 'faster check-ins: ', colorType: 'accent' },
  { type: 'pill', pillId: '09:00' },
  { type: 'text', text: ' instant visitor records, and a simple system ', colorType: 'normal' },
  { type: 'pill', pillId: '09:15' },
  { type: 'text', text: ' your team can start using ', colorType: 'normal' },
  { type: 'pill', pillId: '09:30' },
  { type: 'text', text: ' without the hassle.', colorType: 'normal' },
];

export const WhyGateShieldFold: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLHeadingElement>(null);
  const actionRowRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [activePills, setActivePills] = useState<Record<string, boolean>>({
    '09:00': true,
    '09:15': true,
    '09:30': false,
  });

  const togglePill = (time: string) => {
    setActivePills((prev) => ({
      ...prev,
      [time]: !prev[time],
    }));
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 961px)', () => {
      if (!sectionRef.current || !statementRef.current) return;

      const chars = statementRef.current.querySelectorAll('.why-char');
      if (!chars || chars.length === 0) return;

      // Desktop pinned scrub timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=1800',
          pin: true,
          pinSpacing: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      tl.to(chars, {
        opacity: 1,
        color: (i, el: HTMLElement) => el.dataset.activeColor || '#111513',
        scale: 1,
        stagger: 0.02,
        ease: 'none',
      });

      if (actionRowRef.current) {
        tl.fromTo(
          actionRowRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
          '-=0.2'
        );
      }
    });

    mm.add('(max-width: 960px)', () => {
      if (!sectionRef.current || !statementRef.current) return;

      const chars = statementRef.current.querySelectorAll('.why-char');
      if (!chars || chars.length === 0) return;

      // Tablet & Mobile: smooth scroll-linked reveal without blocking touch scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'center 42%',
          scrub: 0.5,
        },
      });

      tl.to(chars, {
        opacity: 1,
        color: (i, el: HTMLElement) => el.dataset.activeColor || '#111513',
        scale: 1,
        stagger: 0.015,
        ease: 'none',
      });

      if (actionRowRef.current) {
        tl.fromTo(
          actionRowRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' },
          '-=0.15'
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section className="why-section" id="why" ref={sectionRef}>
      <div className="why-container" ref={containerRef}>
        {/* Pill Badge */}
        <div className="light-pill-badge" ref={badgeRef}>
          <span className="dot" />
          <span>08:00 · Why GateShield</span>
        </div>

        {/* Giant Typographic Statement with Character-by-Character Pinned Scrub */}
        <h2 className="why-statement" ref={statementRef}>
          {SEGMENTS.map((seg, sIdx) => {
            if (seg.type === 'pill') {
              const pId = seg.pillId;
              const isActive = !!activePills[pId];
              return (
                <span
                  key={`pill-${pId}-${sIdx}`}
                  className="why-char why-pill-char"
                  data-active-color="#111513"
                >
                  <button
                    type="button"
                    className={`inline-time-pill ${isActive ? 'active' : ''}`}
                    onClick={() => togglePill(pId)}
                    title={`Click to toggle ${pId} check-in milestone`}
                  >
                    <span className="pill-radio-icon">
                      {isActive && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span className="pill-time-text">{pId}</span>
                  </button>
                </span>
              );
            }

            // Word-wrapped text segments to prevent awkward mid-word breaks
            const words = seg.text.split(' ');
            const activeColor = seg.colorType === 'accent' ? '#3a57a1' : '#111513';

            return (
              <React.Fragment key={`text-seg-${sIdx}`}>
                {words.map((word, wIdx) => {
                  const isLastWord = wIdx === words.length - 1;
                  return (
                    <span
                      key={`word-${sIdx}-${wIdx}`}
                      className="why-word"
                      style={{ display: 'inline-block', whiteSpace: 'nowrap' }}
                    >
                      {word.split('').map((char, cIdx) => (
                        <span
                          key={`char-${sIdx}-${wIdx}-${cIdx}`}
                          className={`why-char ${seg.colorType}`}
                          data-active-color={activeColor}
                        >
                          {char}
                        </span>
                      ))}
                      {!isLastWord && <span className="why-char-space">&nbsp;</span>}
                    </span>
                  );
                })}
              </React.Fragment>
            );
          })}
        </h2>

        {/* Bottom Subtitle & How It Works Button */}
        <div className="why-action-row" ref={actionRowRef}>
          <span className="why-author-note">
            — Built for modern facility and workplace security.
          </span>

          <Link href="#how-it-works" className="why-cta-btn">
            <ArrowRight size={15} />
            <span>How it works</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
};
