'use client';

import React from 'react';
import { landingData } from '@/data/landingData';

export const StatsFold: React.FC = () => {
  const { fold2Stats } = landingData;

  const stats = [
    {
      id: 'stat-1',
      number: '80%',
      label: 'REDUCTION IN LOBBY WAIT TIME',
      subnote: null,
    },
    {
      id: 'stat-2',
      number: '30s',
      label: 'AVERAGE VISITOR CHECK-IN TIME',
      subnote: null,
    },
    {
      id: 'stat-3',
      number: '100%',
      label: 'DIGITAL AUDIT',
      subnote: '',
    },
    {
      id: 'stat-4',
      number: '50 Mins',
      label: 'SETUP AND TRAINING TIME',
      subnote: null,
    },
  ];

  const partners = [
    { name: 'Calm Tech Weekly', style: '' },
    { name: 'product lane', style: 'mono' },
    { name: 'Nightly', style: 'serif' },
    { name: 'WORKPLACE TODAY', style: 'mono' },
    { name: 'Morning Signal', style: '' },
    { name: 'The Daily Loop', style: 'serif' },
    { name: 'GATESECURE', style: 'mono' },
  ];

  return (
    <section className="stats-section" id="stats">
      <div className="stats-container">
        {/* Pill Badge matching SS: ● 07:30 · Loved by early risers */}
        <div className="light-pill-badge">
          <span className="dot" />
          <span>09:30 · {fold2Stats.heading}</span>
        </div>

        {/* 4-Column Stats Grid with Vertical Dividers */}
        <div className="stats-grid">
          {stats.map((item) => (
            <div key={item.id} className="stat-item">
              <div className="stat-number-row">
                <span className="stat-number">{item.number}</span>
              </div>
              <span className="stat-label">{item.label}</span>
              {item.subnote && <span className="stat-subnote">{item.subnote}</span>}
            </div>
          ))}
        </div>

        {/* As Seen In / Trust Bar matching SS */}
        <div className="trust-bar">
          <span className="trust-title">AS SEEN IN</span>
          <div className="trust-logos">
            {partners.map((p, idx) => (
              <span key={idx} className={`trust-logo-item ${p.style}`}>
                {p.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
