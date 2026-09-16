'use client';

import React from 'react';
import Link from 'next/link';
import { FolderGit2, ArrowRight, Sparkles } from 'lucide-react';
import { ProjectShowcase, ProjectData } from '@/components/home/ProjectShowcase';
import { TextReveal } from '@/components/ui/TextReveal';

const REAL_PROJECTS: ProjectData[] = [
  {
    id: 'healthcare-emr',
    number: '01',
    category: 'HEALTHCARE & CLINICAL INFORMATICS',
    title: 'Hospital EMR & Multi-Department Clinical Platform',
    subtitle: 'ELECTRONIC MEDICAL RECORDS & WORKFLOW ENGINE',
    pitch: 'Integrated clinical operating system unifying patient records, real-time ward beds, and pharmacy workflows.',
    description: 'An integrated clinical operating system unifying electronic medical records, real-time bed management, diagnostic pathology automation, and pharmacy billing.',
    keyDeliverables: [
      'Role-Based Doctor Consoles',
      'Sub-Second Pharmacy Barcode Billing',
      'IPD / OPD Ward Bed Grid',
      'Automated Diagnostic Lab Dispatch'
    ],
    technologies: ['Next.js App Router', 'Go Microservices', 'PostgreSQL Core', 'HL7 / FHIR Adapters', 'Redis'],
    image: '/images/work/3d-healthcare-emr.jpg',
    href: '/work/healthcare-emr',
    accent: '#10b981',
    isPlaceholder: false,
  },
  {
    id: 'education-erp',
    number: '02',
    category: 'EDUCATION & ACADEMIC CONTINUUM',
    title: 'Multi-Campus University Management & Examination Platform',
    subtitle: 'DISTRIBUTED MULTI-CAMPUS ERP & STUDENT PORTAL',
    pitch: 'Multi-campus institutional system unifying student records, proctored digital testing, and automated fee reconciliation.',
    description: 'An end-to-end institutional platform supporting multi-branch campus operations, automated fee reconciliation, proctored digital assessments, and student portals.',
    keyDeliverables: [
      'Multi-Branch Tenant Isolation',
      'Automated Bank Webhook Fees',
      'Biometric Attendance Sync',
      'Digital Transcript Generator'
    ],
    technologies: ['React PWA', 'Node.js Microservices', 'PostgreSQL', 'Redis Cache', 'Edge CDN'],
    image: '/images/work/3d-education-erp.jpg',
    href: '/work/education-erp',
    accent: '#06b6d4',
    isPlaceholder: false,
  },
  {
    id: 'retail-pos',
    number: '03',
    category: 'RETAIL & E-COMMERCE',
    title: 'High-Throughput Retail POS & Inventory Sync Engine',
    subtitle: 'OMNICHANNEL STORE & DEPOT BILLING SUITE',
    pitch: 'Offline-first counter billing engine with real-time depot synchronization and automated GST ledgers.',
    description: 'An offline-first retail counter billing engine with real-time depot synchronization, GST-compliant invoicing, and multi-store warehouse inventory coordination.',
    keyDeliverables: [
      'Offline-First Terminal Billing',
      'Depot Reorder Triggers',
      'Consolidated GST Ledger',
      'Barcode Scanning Engine'
    ],
    technologies: ['TypeScript', 'SQLite Edge Cache', 'Central PostgreSQL', 'WebSockets', 'Docker'],
    image: '/images/work/3d-retail-pos.jpg',
    href: '/work/retail-pos',
    accent: '#3b82f6',
    isPlaceholder: false,
  },
  {
    id: 'hospitality-erp',
    number: '04',
    category: 'HOTEL & HOSPITALITY',
    title: 'Hotel ERP, Kitchen Display & Multi-Channel Booking System',
    subtitle: 'UNIFIED PROPERTY & RESTAURANT POS PLATFORM',
    pitch: 'Unified property management platform linking front-desk room reservations to kitchen display POS terminals.',
    description: 'A unified property management platform integrating front-desk room reservations, contactless dining POS, kitchen display workflows, and housekeeping operations.',
    keyDeliverables: [
      'Real-Time Room Reservation Grid',
      'Kitchen Display Touch Terminal',
      'Multi-Channel OTA Sync',
      'Housekeeping Dispatch'
    ],
    technologies: ['Next.js 16', 'Serverless Edge', 'Event Queues', 'Real-Time WebSockets', 'KMS Auth'],
    image: '/images/work/3d-hospitality-erp.jpg',
    href: '/work/hospitality-erp',
    accent: '#f59e0b',
    isPlaceholder: false,
  },
  {
    id: 'fintech-ledger',
    number: '05',
    category: 'FINANCIAL TECHNOLOGY & NBFC',
    title: 'Double-Entry Accounting Ledger & Loan Disbursal Engine',
    subtitle: 'FINANCIAL TRANSACTION CORE & KYC PIPELINE',
    pitch: 'Immutable double-entry ledger architecture with automated KYC verification webhooks and installment schedules.',
    description: 'An immutable double-entry ledger architecture with automated KYC verification webhooks, installment schedules, and dynamic delinquency alerts.',
    keyDeliverables: [
      'Strict Double-Entry Ledger Core',
      'Automated KYC OCR Verification',
      'EMI Amortization Schedules',
      'Field Loan Officer Companion'
    ],
    technologies: ['Go Microservices', 'PostgreSQL Vault', 'Distributed Lock Manager', 'Redis Streams', 'Docker'],
    image: '/images/work/3d-fintech-ledger.jpg',
    href: '/work/fintech-ledger',
    accent: '#8b5cf6',
    isPlaceholder: false,
  },
];

export function SelectedWork() {
  return (
    <section 
      id="selected-work" 
      aria-label="OHO TECH Selected Work and Case Studies"
      className="w-full bg-[#0a0a0b] text-white py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-t border-white/5"
    >
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>CASE STUDY ARCHIVE // 05</span>
            </div>
            <TextReveal as="h2" splitType="words" className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Selected Work
            </TextReveal>
          </div>
          
          <div className="max-w-md text-left md:text-right">
            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed mb-4">
              Representative software deployments and custom enterprise platforms engineered by OHO TECH.
            </p>
            <span className="font-mono text-xs text-emerald-400 font-bold uppercase tracking-wider">
              {REAL_PROJECTS.length} VERIFIED ARCHITECTURE PREVIEWS
            </span>
          </div>
        </div>

        {/* Flat Editorial Case Studies Sequence */}
        <div className="space-y-0 mb-16 sm:mb-20">
          {REAL_PROJECTS.map((project, idx) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              index={idx}
              priorityImage={idx === 0}
            />
          ))}
        </div>

        {/* Technical Architecture Consultation Strip (Flat 1px Border) */}
        <div className="bg-[#121316] border border-white/10 p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2 uppercase tracking-tight">
              Require a custom architectural assessment for your organization?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Our technical leadership directly evaluates system requirements, scale constraints, and deployment topologies.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shrink-0 flex items-center justify-center gap-2"
          >
            <span>CONSULT ON ARCHITECTURE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
