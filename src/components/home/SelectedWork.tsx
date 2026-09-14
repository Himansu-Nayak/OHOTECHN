'use client';

import React from 'react';
import Link from 'next/link';
import { FolderGit2, ArrowRight, Sparkles } from 'lucide-react';
import { ProjectShowcase, ProjectData } from '@/components/home/ProjectShowcase';

const REAL_PROJECTS: ProjectData[] = [
  {
    id: 'healthcare-emr',
    number: '01',
    category: 'HEALTHCARE & CLINICAL INFORMATICS',
    title: 'Hospital EMR & Multi-Department Clinical Platform',
    subtitle: 'ELECTRONIC MEDICAL RECORDS & WORKFLOW ENGINE',
    description: 'An integrated clinical operating system unifying electronic medical records, real-time bed management, diagnostic pathology automation, and pharmacy billing.',
    keyDeliverables: [
      'Role-Based Doctor Consoles',
      'Sub-Second Pharmacy Barcode Billing',
      'IPD / OPD Ward Bed Grid',
      'Automated Diagnostic Lab Dispatch'
    ],
    technologies: ['Next.js App Router', 'Go Microservices', 'PostgreSQL Core', 'HL7 / FHIR Adapters', 'Redis'],
    image: '/ecosystem_healthcare.png',
    href: '/solutions/healthcare',
    accent: '#10b981',
  },
  {
    id: 'education-erp',
    number: '02',
    category: 'EDUCATION & ACADEMIC CONTINUUM',
    title: 'Multi-Campus University Management & Examination Platform',
    subtitle: 'DISTRIBUTED MULTI-CAMPUS ERP & STUDENT PORTAL',
    description: 'An end-to-end institutional platform supporting multi-branch campus operations, automated fee reconciliation, proctored digital assessments, and student portals.',
    keyDeliverables: [
      'Multi-Branch Tenant Isolation',
      'Automated Bank Webhook Fees',
      'Biometric Attendance Sync',
      'Digital Transcript Generator'
    ],
    technologies: ['React PWA', 'Node.js Microservices', 'PostgreSQL', 'Redis Cache', 'Edge CDN'],
    image: '/ecosystem_education.png',
    href: '/solutions/education',
    accent: '#06b6d4',
  },
  {
    id: 'retail-pos',
    number: '03',
    category: 'RETAIL & E-COMMERCE',
    title: 'High-Throughput Retail POS & Inventory Sync Engine',
    subtitle: 'OMNICHANNEL STORE & DEPOT BILLING SUITE',
    description: 'An offline-first retail counter billing engine with real-time depot synchronization, GST-compliant invoicing, and multi-store warehouse inventory coordination.',
    keyDeliverables: [
      'Offline-First Terminal Billing',
      'Depot Reorder Triggers',
      'Consolidated GST Ledger',
      'Barcode Scanning Engine'
    ],
    technologies: ['TypeScript', 'SQLite Edge Cache', 'Central PostgreSQL', 'WebSockets', 'Docker'],
    image: '/images/3d-software-dev.jpg',
    href: '/solutions/retail-ecommerce',
    accent: '#3b82f6',
  },
  {
    id: 'hospitality-erp',
    number: '04',
    category: 'HOTEL & HOSPITALITY',
    title: 'Hotel ERP, Kitchen Display & Multi-Channel Booking System',
    subtitle: 'UNIFIED PROPERTY & RESTAURANT POS PLATFORM',
    description: 'A unified property management platform integrating front-desk room reservations, contactless dining POS, kitchen display workflows, and housekeeping operations.',
    keyDeliverables: [
      'Real-Time Room Reservation Grid',
      'Kitchen Display Touch Terminal',
      'Multi-Channel OTA Sync',
      'Housekeeping Dispatch'
    ],
    technologies: ['Next.js 16', 'Serverless Edge', 'Event Queues', 'Real-Time WebSockets', 'KMS Auth'],
    image: '/images/3d-digital-growth.jpg',
    href: '/solutions/hotel-hospitality',
    accent: '#f59e0b',
  },
];

export function SelectedWork() {
  return (
    <section 
      id="selected-work" 
      aria-label="OHO TECH Selected Work and Case Studies"
      className="w-full bg-[#0a0a0b] text-white py-20 sm:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-cyan-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 sm:mb-20 pb-8 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-4">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>CASE STUDY ARCHIVE // 05</span>
            </div>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight uppercase">
              Selected Work
            </h2>
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

        {/* Cinematic Case Studies Sequence using Reusable ProjectShowcase */}
        <div className="space-y-12 sm:space-y-16 lg:space-y-20 mb-16 sm:mb-20">
          {REAL_PROJECTS.map((project, idx) => (
            <ProjectShowcase
              key={project.id}
              project={project}
              index={idx}
              priorityImage={idx === 0}
            />
          ))}
        </div>

        {/* Technical Architecture Consultation Strip */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#14151a] border border-white/15 p-6 sm:p-10 shadow-2xl backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-lg sm:text-xl font-bold text-white mb-2">
              Require a custom architectural assessment for your organization?
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Our technical leadership directly evaluates system requirements, scale constraints, and deployment topologies.
            </p>
          </div>

          <Link
            href="/contact"
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-mono text-xs font-bold uppercase tracking-wider transition-all duration-200 shadow-lg shrink-0 flex items-center justify-center gap-2"
          >
            <span>CONSULT ON ARCHITECTURE</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
