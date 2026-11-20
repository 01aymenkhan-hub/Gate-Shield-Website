'use client';

import React, { useState } from 'react';
import { useContactModal } from '@/components/common/ContactModal';
import {
  Users,
  Calendar,
  Package,
  Clock,
  Layers,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  Printer,
  Bell,
  Building,
  QrCode,
  AlertCircle,
  Crown,
} from 'lucide-react';
import { landingData } from '@/data/landingData';

interface ModuleConfig {
  id: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  badge: string;
  icon: React.ReactNode;
  dashboardImage?: string;
  pillTop: { title: string; sub: string };
  pillBottom: { title: string; sub: string };
  screenTitle: string;
  screenTag: string;
  rows: {
    avatar: string;
    primary: string;
    secondary: string;
    status: string;
    statusColor: 'green' | 'blue' | 'amber';
  }[];
  stats: { val: string; lbl: string }[];
}

export const ModulesFold: React.FC = () => {
  const [activeId, setActiveId] = useState('visitor');
  const { fold4Modules } = landingData;
  const { openModal } = useContactModal();

  const modulesList: ModuleConfig[] = [
    {
      id: 'visitor',
      title: 'Visitor Management',
      shortDesc: 'CNIC scanning, visitor photos & QR badges',
      fullDesc:
        'Scan a CNIC or Driving Licence, capture a photo and print a QR badge. Visitors, vendors, interview candidates and guests each get their own register.',
      badge: 'VISITOR CHECK-IN SUITE',
      icon: <Users size={20} />,
      dashboardImage: '/images/Visitor Management.webp',
      pillTop: {
        title: 'ID Scanned',
        sub: 'Details filled in automatically',
      },
      pillBottom: {
        title: 'Badge Printed',
        sub: 'QR code ready for checkout',
      },
      screenTitle: 'Active Visitors Lobby Live',
      screenTag: 'Real-time Sync',
      rows: [
        {
          avatar: 'GS',
          primary: 'Gurwinder Singh',
          secondary: 'Conference Room A · 10:30 AM',
          status: 'Checked In',
          statusColor: 'green',
        },
        {
          avatar: 'RS',
          primary: 'Rohan Sharma',
          secondary: 'Reception Area · 10:45 AM',
          status: 'Meeting',
          statusColor: 'blue',
        },
        {
          avatar: 'TG',
          primary: 'Taniya Gupta',
          secondary: 'Cabin 102 · 10:00 AM',
          status: 'Checked Out',
          statusColor: 'amber',
        },
      ],
      stats: [
        { val: '24', lbl: 'Total Today' },
        { val: '19', lbl: 'Inside Facility' },
        { val: '0', lbl: 'Overstay / Alerts' },
      ],
    },
    {
      id: 'meeting',
      title: 'Meeting Room Management',
      shortDesc: 'Rooms and Catering Booking',
      fullDesc:
        'Book meeting rooms, request catering, and cancel unused bookings automatically to free up space.',
      badge: 'MEETING ROOMS',
      icon: <Calendar size={20} />,
      dashboardImage: '/images/Meeting Room Management.webp',
      pillTop: {
        title: 'Room Booked',
        sub: 'Room booking for hosts',
      },
      pillBottom: {
        title: 'Catering Confirmed',
        sub: 'Coffee & refreshments',
      },
      screenTitle: 'Room Scheduling & Occupancy',
      screenTag: 'Smart Sensors',
      rows: [
        {
          avatar: 'R1',
          primary: 'Boardroom Alpha (14 Seats)',
          secondary: 'Host: Maya Lin · 11:00 AM - 12:30 PM',
          status: 'In Session',
          statusColor: 'green',
        },
        {
          avatar: 'R2',
          primary: 'Executive Suite B (8 Seats)',
          secondary: 'Free until 2:00 PM · Quick Reserve',
          status: 'Available',
          statusColor: 'blue',
        },
        {
          avatar: 'R3',
          primary: 'Huddle Pod 04 (4 Seats)',
          secondary: 'Auto-released (No-show detected)',
          status: 'Released',
          statusColor: 'amber',
        },
      ],
      stats: [
        { val: '12', lbl: 'Total Rooms' },
        { val: '8', lbl: 'Active Sessions' },
        { val: '4', lbl: 'Available Now' },
      ],
    },
    {
      id: 'mailroom',
      title: 'Mail Management System',
      shortDesc: 'Parcels logged, photographed & delivered',
      fullDesc:
        'Log expected and unexpected parcels at the gate, photograph them on arrival, and mark them delivered to the right person.',
      badge: 'PARCEL MANAGEMENT',
      icon: <Package size={20} />,
      dashboardImage: '/images/Mailroom Management.webp',
      pillTop: {
        title: 'Parcel Received',
        sub: 'Photo taken at the gate',
      },
      pillBottom: {
        title: 'Parcel Delivered',
        sub: 'Handed to the owner',
      },
      screenTitle: 'Deliveries Inbound & Locker Log',
      screenTag: 'Optical Scan',
      rows: [
        {
          avatar: 'FX',
          primary: 'FedEx Express (Box 03)',
          secondary: 'Recipient: Sarah Jenkins · Design Dept',
          status: 'Ready in Locker',
          statusColor: 'green',
        },
        {
          avatar: 'DH',
          primary: 'DHL Priority Docs',
          secondary: 'Recipient: Irfan Khan · Executive Office',
          status: 'Notified Host',
          statusColor: 'blue',
        },
        {
          avatar: 'AM',
          primary: 'Amazon Supply Cart',
          secondary: 'Collected · 10:15 AM by Facilities',
          status: 'Collected',
          statusColor: 'amber',
        },
      ],
      stats: [
        { val: '38', lbl: 'Deliveries Today' },
        { val: '29', lbl: 'Collected' },
        { val: '9', lbl: 'Awaiting Pickup' },
      ],
    },
    {
      id: 'attendance',
      title: 'Employee Management System',
      shortDesc: 'Employee Portal, guest invites & approvals',
      fullDesc:
        'Employees request an account, admins approve it, and staff can then invite their own guests and see when they arrive.',
      badge: 'EMPLOYEE PORTAL',
      icon: <Clock size={20} />,
      dashboardImage: '/images/Employee Management.webp',
      pillTop: {
        title: 'Account Approved',
        sub: 'Ready to invite guests',
      },
      pillBottom: {
        title: 'Guest Arrived',
        sub: 'Host notified',
      },
      screenTitle: 'Workforce Attendance & Safety Roll-Call',
      screenTag: 'Geo-Verification',
      rows: [
        {
          avatar: 'HR',
          primary: 'Engineering & Product (Floor 3)',
          secondary: '42 Checked In · 6 WFH',
          status: '100% Accounted',
          statusColor: 'green',
        },
        {
          avatar: 'OP',
          primary: 'Operations & Support (Floor 1)',
          secondary: '28 Checked In · Shift Active',
          status: 'On Site',
          statusColor: 'blue',
        },
        {
          avatar: 'SA',
          primary: 'Enterprise Sales Team',
          secondary: 'Client Site Visits · Authorized',
          status: 'Field Visit',
          statusColor: 'amber',
        },
      ],
      stats: [
        { val: '240', lbl: 'Employees' },
        { val: '188', lbl: 'In Office' },
        { val: '52', lbl: 'Remote / WFH' },
      ],
    },
    {
      id: 'queue',
      title: 'Warehouse Gate Management',
      shortDesc: 'Vehicles, cargo & delivery documents',
      fullDesc:
        'Record each delivery vehicle and the company it came from, with photos of the incoming and outgoing documents.',
      badge: 'CARGO & LOGISTICS',
      icon: <Layers size={20} />,
      dashboardImage: '/images/Warehouse Management.webp',
      pillTop: {
        title: 'Truck at Gate',
        sub: 'Vehicle number logged',
      },
      pillBottom: {
        title: 'Documents Captured',
        sub: 'Incoming and outgoing slips',
      },
      screenTitle: 'Digital Counters & Turnstile Tokens',
      screenTag: 'Smart Routing',
      rows: [
        {
          avatar: '01',
          primary: 'Counter 01 · ID & Biometric Verification',
          secondary: 'Serving Token #A-39 · 3m duration',
          status: 'Serving Now',
          statusColor: 'green',
        },
        {
          avatar: '02',
          primary: 'Counter 02 · Contractor Work Permits',
          secondary: 'Serving Token #B-12 · 5m duration',
          status: 'Processing',
          statusColor: 'blue',
        },
        {
          avatar: '03',
          primary: 'Counter 03 · VIP & Scheduled Meetings',
          secondary: 'Ready for next token in queue',
          status: 'Available',
          statusColor: 'amber',
        },
      ],
      stats: [
        { val: '64', lbl: 'Tokens Served' },
        { val: '4', lbl: 'In Queue' },
        { val: '3.2m', lbl: 'Avg Wait' },
      ],
    },
    {
      id: 'contractor',
      title: 'Contractor Management System',
      shortDesc: 'Crews and temporary workers, in and out',
      fullDesc:
        'Log maintenance crews, construction teams and temporary workers in and out, with photo ID on record.',
      badge: 'CONTRACTOR LOG',
      icon: <ShieldCheck size={20} />,
      dashboardImage: '/images/Contrators & Labor.webp',
      pillTop: {
        title: 'Crew Checked In',
        sub: 'Every worker on record',
      },
      pillBottom: {
        title: 'Still Inside',
        sub: 'Live headcount at the gate',
      },
      screenTitle: 'Vendor Credentials & Zone Permits',
      screenTag: 'Audit-Proof',
      rows: [
        {
          avatar: 'HV',
          primary: 'Apex HVAC Engineering',
          secondary: 'Rooftop & Plant Room Access · Expires 5:00 PM',
          status: 'Safety Cleared',
          statusColor: 'green',
        },
        {
          avatar: 'NT',
          primary: 'NetCore Infrastructure',
          secondary: 'Server Hall 01 Permit · Escort verified',
          status: 'Active Pass',
          statusColor: 'blue',
        },
        {
          avatar: 'CL',
          primary: 'Facility Cleaning Services',
          secondary: 'All Zones · Daily Induction Logged',
          status: 'Compliant',
          statusColor: 'amber',
        },
      ],
      stats: [
        { val: '14', lbl: 'Contractors' },
        { val: '100%', lbl: 'Compliance' },
        { val: '0', lbl: 'Permit Breaches' },
      ],
    },
    {
      id: 'vip',
      title: 'VIP Guest Management',
      shortDesc: 'Pre-registered VIPs & vehicle fast check-in',
      fullDesc:
        'Pre-register VIPs with their arrival time and vehicle number, and let them through without a visitor card.',
      badge: 'VIP FAST CHECK-IN',
      icon: <Crown size={20} />,
      dashboardImage: '/images/VIP Guest Management.webp',
      pillTop: {
        title: 'VIP Expected',
        sub: 'Arrival time and vehicle saved',
      },
      pillBottom: {
        title: 'Fast Check-In',
        sub: 'No visitor card needed',
      },
      screenTitle: 'VIP Arrivals & Priority Guest List',
      screenTag: 'Pre-Cleared',
      rows: [
        {
          avatar: 'AK',
          primary: 'Ahsan Kamran · Board Advisor',
          secondary: 'Executive Gate · 11:00 AM · Escort Assigned',
          status: 'Arrived',
          statusColor: 'green',
        },
        {
          avatar: 'ZA',
          primary: 'Zara Ahmed · Key Partner',
          secondary: 'VIP Lounge · QR Pass Active',
          status: 'Pre-Cleared',
          statusColor: 'blue',
        },
        {
          avatar: 'MF',
          primary: 'Malik Farooq · Investor Meet',
          secondary: 'Main Reception · Expected 02:30 PM',
          status: 'Scheduled',
          statusColor: 'amber',
        },
      ],
      stats: [
        { val: '8', lbl: 'VIPs Today' },
        { val: '100%', lbl: 'Pre-Cleared' },
        { val: '<10s', lbl: 'Gate Entry' },
      ],
    },
  ];

  const currentModule =
    modulesList.find((m) => m.id === activeId) || modulesList[0];

  return (
    <section className="modules-section" id="modules">
      <div className="modules-container">
        {/* Header */}
        <div className="modules-header">
          <div className="light-pill-badge">
            <span className="dot" />
            <span>10:30 · Complete Workplace Suite</span>
          </div>

          <h2 className="modules-h2">{fold4Modules.heading}</h2>

          <p className="modules-subheadline">{fold4Modules.subheading}</p>
        </div>

        {/* 2-Column Layout */}
        <div className="modules-interactive-grid">
          {/* Left Column: 6 Module Tabs */}
          <div className="modules-tabs-list" role="tablist">
            {modulesList.map((mod) => {
              const isActive = mod.id === activeId;
              return (
                <button
                  key={mod.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`module-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveId(mod.id)}
                >
                  <div className="module-tab-left">
                    <div className="module-tab-icon">{mod.icon}</div>
                    <div className="module-tab-text">
                      <span className="module-tab-title">{mod.title}</span>
                      <span className="module-tab-desc">{mod.shortDesc}</span>
                    </div>
                  </div>
                  <ChevronRight size={17} className="module-tab-arrow" />
                </button>
              );
            })}
          </div>

          {/* Right Column: Interactive Showcase Panel */}
          <div className="module-preview-panel">
            {/* Top-Left Floating Status Pill */}
            <div className="preview-floating-pill top-left">
              <span className="preview-pill-dot" />
              <div>
                <div className="preview-pill-title">
                  {currentModule.pillTop.title}
                </div>
                <div className="preview-pill-sub">
                  {currentModule.pillTop.sub}
                </div>
              </div>
            </div>

            {/* Bottom-Right Floating Status Pill */}
            <div className="preview-floating-pill bottom-right">
              <span className="preview-pill-dot primary" />
              <div>
                <div className="preview-pill-title">
                  {currentModule.pillBottom.title}
                </div>
                <div className="preview-pill-sub">
                  {currentModule.pillBottom.sub}
                </div>
              </div>
            </div>

            {/* Central Mock Screen */}
            <div
              className={`preview-mock-screen ${currentModule.dashboardImage ? 'has-image' : ''
                }`}
            >
              {currentModule.dashboardImage ? (
                <img
                  key={currentModule.dashboardImage}
                  src={currentModule.dashboardImage}
                  alt={`${currentModule.title} Dashboard`}
                  width={665}
                  height={375}
                  className="preview-dashboard-img"
                />
              ) : (
                <>
                  <div className="screen-mock-header">
                    <div className="screen-mock-title">
                      <Building size={16} color="#3a57a1" />
                      <span>{currentModule.screenTitle}</span>
                    </div>
                    <span className="screen-mock-tag">
                      {currentModule.screenTag}
                    </span>
                  </div>

                  {/* Mock Rows */}
                  <div className="mock-table">
                    {currentModule.rows.map((row, idx) => (
                      <div key={idx} className="mock-row">
                        <div className="mock-user-info">
                          <div className="mock-avatar">{row.avatar}</div>
                          <div>
                            <div className="mock-user-name">{row.primary}</div>
                            <div className="mock-user-meta">{row.secondary}</div>
                          </div>
                        </div>
                        <span className={`mock-status-chip ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Mock Footer Stats */}
                  <div className="mock-screen-footer">
                    {currentModule.stats.map((s, idx) => (
                      <div key={idx} className="mock-stat-box">
                        <span className="mock-stat-val">{s.val}</span>
                        <span className="mock-stat-lbl">{s.lbl}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Bottom Information & CTA Row */}
            <div className="module-bottom-cta-row">
              <div className="module-info-left">
                <span className="module-badge-tag">{currentModule.badge}</span>
                <p className="module-full-desc">{currentModule.fullDesc}</p>
              </div>

              <button
                type="button"
                onClick={openModal}
                className="module-action-link"
              >
                <span>Request Module Demo</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
