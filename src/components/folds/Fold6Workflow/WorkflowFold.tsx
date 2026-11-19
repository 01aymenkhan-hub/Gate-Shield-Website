'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  ScanLine,
  UserCheck,
  ShieldCheck,
  QrCode,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

/* ─── Step Data ─────────────────────────────────────────────────────────────── */

interface WorkflowStep {
  num: string;
  time: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  image: string;
}

const STEPS: WorkflowStep[] = [
  {
    num: '01',
    time: '09:00',
    title: 'Scan the ID',
    desc: "The visitor presents their CNIC or Driving Licence at the kiosk. Gate Shield's scanner reads it in under 3 seconds — no manual typing needed.",
    icon: <ScanLine size={20} />,
    image: '/images/Scan the ID.webp?v=transparent',
  },
  {
    num: '02',
    time: '09:01',
    title: 'Fetch Visitor Details',
    desc: 'Visitor data auto-fills in real time. Name, photo, and CNIC number are extracted instantly — then cross-checked against the watchlist database.',
    icon: <UserCheck size={20} />,
    image: '/images/Fetch Visitor Details.webp?v=transparent',
  },
  {
    num: '03',
    time: '09:02',
    title: 'Verify the Details',
    desc: 'The guard reviews the pre-filled form and the host receives a 1-tap approval notification on their phone. No calls, no waiting — done in seconds.',
    icon: <ShieldCheck size={20} />,
    image: '/images/Verify the Details.webp?v=transparent',
  },
  {
    num: '04',
    time: '09:03',
    title: 'Generate QR Pass',
    desc: 'Once approved, a timestamped digital QR pass is issued instantly. It grants zone-specific access and auto-expires at the end of the visit.',
    icon: <QrCode size={20} />,
    image: '/images/Generate QR Pass.webp?v=transparent',
  },
];

/* ─── Component ─────────────────────────────────────────────────────────────── */

export const WorkflowFold: React.FC = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const advance = useCallback(() => {
    setActiveIdx((i) => (i + 1) % STEPS.length);
  }, []);

  /* Keep auto-play always enabled on mobile/tablet viewports */
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 900px)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        setIsAutoPlaying(true);
      }
    };
    handleChange(mq);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  /* Auto-advance every 3.5 s while auto-play is on */
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setTimeout(advance, 3500);
    return () => clearTimeout(timer);
  }, [isAutoPlaying, activeIdx, advance]);

  const handleStepClick = (idx: number) => {
    setActiveIdx(idx);
    const isMobileViewport =
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 900px)').matches;
    if (!isMobileViewport) {
      setIsAutoPlaying(false);
    }
  };

  const active = STEPS[activeIdx];

  return (
    <section className="workflow-section" id="how-it-works">
      <div className="workflow-container">

        {/* ── 3-Column Layout ── */}
        <div className="workflow-grid">

          {/* ── LEFT: Heading + Active Step Detail ── */}
          <div className="workflow-left">
            <div className="light-pill-badge" style={{ marginBottom: '28px' }}>
              <span className="dot" />
              <span>11:30 · How to Use</span>
            </div>

            <h2 className="workflow-h2">
              From <span className="workflow-h2-accent">ID Scan</span>
              <br />to Entry Pass.
            </h2>

            {/* Active Step Detail */}
            <div className="workflow-step-detail" key={activeIdx}>
              <div className="workflow-step-numrow">
                <span className="workflow-step-num">{active.num}</span>
                <span className="workflow-step-divider">/</span>
                <span className="workflow-step-total">04</span>
              </div>

              <div className="workflow-step-icon-title">
                <div className="workflow-step-icon">{active.icon}</div>
                <h3 className="workflow-step-title">{active.title}</h3>
              </div>

              <p className="workflow-step-desc">{active.desc}</p>

              {/* Progress bar */}
              <div className="workflow-progress-track">
                <div
                  className="workflow-progress-fill"
                  style={{ width: `${((activeIdx + 1) / STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* ── CENTER: Phone Mockup ── */}
          <div className="workflow-center">
            <div className="workflow-phone-shell">
              <img
                key={active.image}
                src={active.image}
                alt={active.title}
                width={300}
                height={560}
                className="workflow-phone-img"
              />
            </div>
          </div>

          {/* ── RIGHT: Vertical Timeline Steps ── */}
          <div className="workflow-right">
            <div className="wf-timeline-label">YOUR CHECK-IN JOURNEY</div>
            <div className="wf-timeline">
              {STEPS.map((step, idx) => {
                const isActive = idx === activeIdx;
                const isDone = idx < activeIdx;
                return (
                  <button
                    key={step.num}
                    type="button"
                    className={`wf-timeline-step ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    onClick={() => handleStepClick(idx)}
                    aria-current={isActive ? 'step' : undefined}
                  >
                    {/* Connector line above (not for first) */}
                    {idx > 0 && (
                      <span
                        className={`wf-timeline-connector ${isDone || isActive ? 'filled' : ''}`}
                      />
                    )}

                    {/* Dot */}
                    <span className="wf-timeline-dot">
                      {isDone ? <CheckCircle2 size={14} /> : null}
                    </span>

                    {/* Text */}
                    <div className="wf-timeline-text">
                      <span className="wf-timeline-time">
                        STEP {step.num} · {step.time} AM
                      </span>
                      <span className="wf-timeline-name">{step.title}</span>
                    </div>

                    {isActive && <ChevronRight size={15} className="wf-timeline-arrow" />}
                  </button>
                );
              })}
            </div>

            {/* Auto-play toggle */}
            <button
              type="button"
              className={`wf-autoplay-btn ${isAutoPlaying ? 'on' : 'off'}`}
              onClick={() => setIsAutoPlaying((v) => !v)}
              aria-label="Toggle auto-play"
            >
              <span className={`wf-autoplay-dot ${isAutoPlaying ? 'on' : ''}`} />
              {isAutoPlaying ? 'Auto-advancing' : 'Resume auto-play'}
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
