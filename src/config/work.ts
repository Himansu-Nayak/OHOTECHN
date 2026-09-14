export interface WorkProject {
  slug: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  clientArchetype: string;
  industry: string;
  accent: string;
  heroImage: string;
  challenge: {
    title: string;
    description: string;
    frictionPoints: string[];
  };
  solution: {
    title: string;
    description: string;
    coreCapabilities: string[];
  };
  architecture: {
    frontend: string;
    services: string;
    database: string;
    infrastructure: string;
    security: string;
  };
  topologySteps: {
    step: string;
    title: string;
    detail: string;
  }[];
  metrics: {
    label: string;
    value: string;
    detail: string;
  }[];
  deliverables: string[];
  technologies: string[];
  verdict: string;
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: 'healthcare-emr',
    number: '01',
    category: 'Healthcare & Clinical Informatics',
    title: 'Hospital EMR & Multi-Department Clinical Platform',
    subtitle: 'ELECTRONIC MEDICAL RECORDS & WORKFLOW ENGINE',
    summary: 'An integrated clinical operating system unifying electronic medical records, real-time bed management, diagnostic pathology automation, and pharmacy billing.',
    clientArchetype: 'Super-Specialty Hospital & Multi-Branch Clinic Network',
    industry: 'Healthcare',
    accent: '#10b981',
    heroImage: '/ecosystem_healthcare.png',
    challenge: {
      title: 'Fragmented Clinical Workflows & Manual Triage Bottlenecks',
      description: 'The hospital faced severe data fragmentation between OPD triage, inpatient ward admissions, diagnostic laboratory dispatch, and pharmacy inventory. Paper-based chart routing introduced medication reconciliation delays and slowed billing during peak patient discharges.',
      frictionPoints: [
        'Paper-based patient intake causing 35+ minute OPD wait times',
        'Disconnected pharmacy billing leading to inventory shrinkage and stockout surprises',
        'Diagnostic laboratory report latency impeding critical emergency decisions',
        'Non-compliant patient data access logs risking regulatory penalties'
      ]
    },
    solution: {
      title: 'Unified Event-Driven HealthOS Clinical Platform',
      description: 'OHO TECH engineered a distributed HealthOS clinical console with zero-latency record synchronization. Built on Next.js 16 and Go microservices, the system automates role-based doctor charts, sub-second pharmacy barcode dispensing, and automated HL7/FHIR diagnostic laboratory pipelines.',
      coreCapabilities: [
        'Role-Based Doctor & Clinician Prescription Consoles',
        'Sub-Second Thermal Barcode Pharmacy Billing & Inventory Deduction',
        'Live Real-Time Bed Grid with Inpatient Admission & Discharge Coordination',
        'Automated Laboratory Machine Specimen Tracking & PDF Dispatch'
      ]
    },
    architecture: {
      frontend: 'Next.js 16 App Router // High-Concurrency Clinical Consoles // Tailwind CSS',
      services: 'Go (Golang) Microservices // Asynchronous HL7/FHIR Ingestion Queue // gRPC',
      database: 'PostgreSQL Relational Core // Redis In-Memory Session Cache',
      infrastructure: 'Isolated Private VPC // Kubernetes Pod Isolation // Encrypted S3 Storage',
      security: 'HIPAA & NABH Ready // Mutual mTLS // AES-256 Encryption at Rest & In-Transit'
    },
    topologySteps: [
      { step: '01', title: 'Triage & Ingress', detail: 'Patient scans digital QR or presents ID at reception; triage record creates atomic database lock.' },
      { step: '02', title: 'Clinical Charting', detail: 'Doctor prescribes ICD-10 diagnostics and medications; event propagates immediately via WebSocket.' },
      { step: '03', title: 'Pharmacy & Lab Sync', detail: 'Dispensary and pathology nodes receive instantaneous push alerts for medication packaging and specimen draw.' },
      { step: '04', title: 'Discharge & Audit', detail: 'Ledger reconciles all line items into a unified GST invoice with immutable cryptographic audit append.' }
    ],
    metrics: [
      { label: 'Triage Latency', value: '< 3.5 Min', detail: 'Intake-to-consultation workflow benchmark' },
      { label: 'Pharmacy Speed', value: '< 800ms', detail: 'Barcode scan to billing ledger dispatch' },
      { label: 'Audit Trail', value: '100% ACID', detail: 'Immutable digital clinical record append' }
    ],
    deliverables: [
      'Role-Based Doctor, Nurse & Reception Consoles',
      'Sub-Second Pharmacy Barcode POS & Low-Stock Alerts',
      'IPD / OPD Ward Bed Management Visual Grid',
      'Automated Diagnostic Pathology Dispatch Gateway',
      'Encrypted Patient Health Records Portal (PWA)'
    ],
    technologies: ['Next.js 16', 'React 19', 'Go (Golang)', 'PostgreSQL', 'Redis Cache', 'HL7 / FHIR', 'Docker', 'Kubernetes'],
    verdict: 'Designed to eliminate prescription paper trail lag, establish zero-latency pharmacy ledger updates, and optimize clinical patient flow across departments.'
  },
  {
    slug: 'education-erp',
    number: '02',
    category: 'University & Higher Education Systems',
    title: 'Multi-Campus University Management & Examination Platform',
    subtitle: 'DISTRIBUTED MULTI-CAMPUS ERP & STUDENT PORTAL',
    summary: 'An end-to-end institutional platform supporting multi-branch campus operations, automated fee reconciliation, proctored digital assessments, and student portals.',
    clientArchetype: 'Multi-Campus Collegiate Network & State University Archetype',
    industry: 'Education',
    accent: '#06b6d4',
    heroImage: '/ecosystem_education.png',
    challenge: {
      title: 'Desynchronized Branch Databases & Manual Fee Reconciliation Lag',
      description: 'Managing 12 interconnected campus branches with isolated spreadsheets resulted in reconciliation backlogs, delayed examination grade publishing, and fragmented student fee records.',
      frictionPoints: [
        'Multi-week lag in reconciling offline bank challans and online payments',
        'Disparate biometric hardware unable to feed central attendance metrics',
        'High server load spikes during semester grade sheet publishing causing timeouts',
        'Complex syllabus and timetable conflicts across multi-department faculties'
      ]
    },
    solution: {
      title: 'Decoupled Multi-Branch Campus ERP & Edge Portal',
      description: 'Engineered an event-driven institutional ERP featuring multi-tenant database partitioning, automated payment gateway webhooks, biometric sync daemons, and an edge-cached student grade portal.',
      coreCapabilities: [
        'Multi-Branch Tenant Isolation with Role-Based Dean/HOD Controls',
        'Automated Bank Webhook Fee Reconciliation & Digital Receipting',
        'Biometric & RFID Edge Attendance Synchronization',
        'Self-Service Student Portal for Grade Sheets, Timetables & Certificates'
      ]
    },
    architecture: {
      frontend: 'React 19 Progressive Web App // Mobile Companion Apps // Next.js Admin',
      services: 'Node.js Microservices // AMQP Task Queue // Dynamic PDF Compiler',
      database: 'PostgreSQL with Dedicated Read Replicas // Redis Distributed Cache',
      infrastructure: 'Containerized Cloud Mesh // Global Edge CDN // Automated Autoscaler',
      security: 'Role-Based RBAC // Student Data Privacy // SSL Pinning on Mobile Apps'
    },
    topologySteps: [
      { step: '01', title: 'Student Enrollment', detail: 'Online admission generates encrypted student UID and provisions multi-year ledger account.' },
      { step: '02', title: 'Attendance Telemetry', detail: 'Edge biometric gates push attendance payloads to central message queue every 10 seconds.' },
      { step: '03', title: 'Payment Webhook Sync', detail: 'Bank payment gateways invoke idempotent webhooks that immediately balance fee accounts.' },
      { step: '04', title: 'Grade Compilation', detail: 'Faculty marksheets compile via distributed background workers with sub-second grade publication.' }
    ],
    metrics: [
      { label: 'Fee Sync Rate', value: 'Real-Time', detail: 'Instantaneous ledger update upon webhook ack' },
      { label: 'Grade Compile', value: '< 2.4s', detail: 'Batch compilation across 15,000 students' },
      { label: 'Availability', value: '99.98%', detail: 'Continuous uptime during exam publication' }
    ],
    deliverables: [
      'Multi-Branch Academic Governance Console',
      'Automated Bank Gateway Fee Ledger Engine',
      'Biometric Edge Attendance Ingestion Service',
      'High-Throughput Digital Grade Sheet & Certificate Generator',
      'Native Student & Parent Companion Mobile Applications'
    ],
    technologies: ['React 19', 'Next.js 16', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Cloudflare CDN', 'TypeScript'],
    verdict: 'Unified multi-campus academic operations into a resilient control center with automated financial governance and zero examination publication downtime.'
  },
  {
    slug: 'retail-pos',
    number: '03',
    category: 'Commercial Retail & Supply Chain',
    title: 'High-Throughput Retail POS & Inventory Sync Engine',
    subtitle: 'OMNICHANNEL STORE & DEPOT BILLING SUITE',
    summary: 'An offline-first retail counter billing engine with real-time depot synchronization, GST-compliant invoicing, and multi-store warehouse inventory coordination.',
    clientArchetype: 'Multi-Location Retail Superstore Chain & Regional Warehouse Network',
    industry: 'Retail',
    accent: '#3b82f6',
    heroImage: '/images/3d-software-dev.jpg',
    challenge: {
      title: 'Counter Checkout Bottlenecks & Depot Inventory Drift',
      description: 'High-volume checkout counters experienced network dropouts during peak retail hours. Central inventory was desynchronized from physical store shelves, causing phantom stock and lost sales.',
      frictionPoints: [
        'Counter POS crashes during internet outages halting physical checkouts',
        'Inventory drift between regional depots and outlet store shelves',
        'Complex tax calculations and slow multi-item barcode lookups',
        'Delayed replenishment triggers resulting in stockouts of top-selling SKUs'
      ]
    },
    solution: {
      title: 'Offline-First RetailPOS with Edge Sync Daemon',
      description: 'OHO TECH architected RetailPOS with an embedded SQLite edge cache, thermal printing optimizations, and an asynchronous WebSocket synchronization engine that guarantees zero checkout delays even when offline.',
      coreCapabilities: [
        'Offline-First Local Terminal Billing with Sub-Second Checkout',
        'Automatic Background Sync to Central PostgreSQL Cluster upon Reconnection',
        'Consolidated Multi-Store GST & VAT Tax Reporting Engine',
        'Dynamic Low-Stock Reorder Triggers & Supplier PO Dispatch'
      ]
    },
    architecture: {
      frontend: 'High-Speed Desktop Counter Interface // Web Master Admin Console',
      services: 'High-Throughput REST APIs // WebSocket Sync Daemon // Go Print Spooler',
      database: 'Central PostgreSQL Master // Local SQLite Edge Cache',
      infrastructure: 'Dockerized Microservices // Encrypted Local Vault // Private Cloud',
      security: 'Cryptographic Batch Hashes // Hardware MAC Whitelisting // Zero Data Loss'
    },
    topologySteps: [
      { step: '01', title: 'Barcode Ingestion', detail: 'Hardware scanner inputs barcode; local SQLite database matches SKU in under 12 milliseconds.' },
      { step: '02', title: 'Tax & Discount Engine', detail: 'GST rules and promo codes calculate instantly without requiring network roundtrips.' },
      { step: '03', title: 'Offline Transaction Queue', detail: 'Receipt prints immediately while transaction payload is appended to encrypted local sync spool.' },
      { step: '04', title: 'Depot Stock Sync', detail: 'Sync daemon streams sold SKUs to regional depot database via WebSocket to update reorder thresholds.' }
    ],
    metrics: [
      { label: 'Barcode Lookup', value: '< 12ms', detail: 'Local edge database match speed' },
      { label: 'Counter Latency', value: '< 180ms', detail: 'Full checkout cycle per customer' },
      { label: 'Offline Resilience', value: '100% Fail-Safe', detail: 'Zero transactions lost during outages' }
    ],
    deliverables: [
      'Offline-First Desktop Terminal Counter Application',
      'Central Depot & Multi-Store Inventory Management Portal',
      'Automated Low-Stock Trigger & Supplier Purchase Order Engine',
      'Comprehensive GST-Compliant Financial Ledger & Analytics',
      'Barcode Label Generation & Thermal Hardware Drivers'
    ],
    technologies: ['TypeScript', 'SQLite Edge', 'PostgreSQL', 'WebSockets', 'Go (Golang)', 'Docker', 'Tailwind CSS'],
    verdict: 'Engineered to guarantee uninterrupted checkout counters, eliminate multi-store inventory drift, and automate regional warehouse replenishment.'
  },
  {
    slug: 'hospitality-erp',
    number: '04',
    category: 'Hotel & Hospitality Management',
    title: 'Hotel ERP, Kitchen Display & Multi-Channel Booking System',
    subtitle: 'UNIFIED PROPERTY & RESTAURANT POS PLATFORM',
    summary: 'A unified property management platform integrating front-desk room reservations, contactless dining POS, kitchen display workflows, and housekeeping operations.',
    clientArchetype: 'Boutique Resort Chain & Luxury Hotel Group',
    industry: 'Hospitality',
    accent: '#f59e0b',
    heroImage: '/images/3d-digital-growth.jpg',
    challenge: {
      title: 'Disconnected Front-Desk, Dining Orders & Room Service',
      description: 'Front-desk room bookings operated separately from the restaurant POS and housekeeping rosters. Guests suffered delayed check-ins, dining bills failed to post to room accounts, and OTA inventory required manual updates.',
      frictionPoints: [
        'Manual room rate adjustments across OTAs causing overbooking and rate parity issues',
        'Kitchen order tickets (KOT) lost between dining tables and the kitchen line',
        'Housekeeping status lag leaving clean rooms marked as occupied',
        'Fragmented guest billing at checkout causing disputes and slow departures'
      ]
    },
    solution: {
      title: 'Unified PropertyOS & Kitchen Display Workflow',
      description: 'Delivered an integrated PropertyOS combining real-time room availability grids, digital kitchen display systems (KDS), automated OTA channel managers, and mobile guest check-in.',
      coreCapabilities: [
        'Real-Time Room Availability Matrix with 2-Way OTA Channel Synchronization',
        'Interactive Kitchen Display Screen (KDS) with Course Timing Controls',
        'Instantaneous Room-Charge Dining Bill Routing & Payment Gateways',
        'Housekeeping Task Dispatch with Live Room Cleanliness Telemetry'
      ]
    },
    architecture: {
      frontend: 'Next.js 16 Touch-Optimized KDS // Front-Desk Web Portal // Guest Mobile App',
      services: 'Event-Driven Node.js Microservices // Redis Pub/Sub // WebSocket Event Bus',
      database: 'PostgreSQL Relational Core // Multi-Tenant Room Ledger',
      infrastructure: 'Edge Serverless Functions // Containerized Cloud VPC',
      security: 'PCI-DSS Compliant Payment Routing // Tokenized Room Access Keys'
    },
    topologySteps: [
      { step: '01', title: 'Reservation Booking', detail: 'Direct booking or OTA API updates room grid instantly, adjusting inventory across all channels.' },
      { step: '02', title: 'Guest Check-In', detail: 'Front desk generates digital room key and allocates housekeeping inspect flag.' },
      { step: '03', title: 'Dining & Service KOT', detail: 'Waiter inputs food order; kitchen display updates in real-time with color-coded preparation timer.' },
      { step: '04', title: 'Consolidated Folio', detail: 'All dining, spa, and room charges aggregate into an itemized checkout statement.' }
    ],
    metrics: [
      { label: 'Channel Sync', value: '< 1.8s', detail: 'OTA rate and inventory update speed' },
      { label: 'KDS Order Delay', value: '< 150ms', detail: 'Table order to kitchen display push' },
      { label: 'Checkout Speed', value: '< 1.5 Min', detail: 'Complete guest folio reconciliation' }
    ],
    deliverables: [
      'Front-Desk Real-Time Room Grid & Guest Folio System',
      'Touch-Optimized Kitchen Display System (KDS) & Waiter App',
      'Multi-Channel OTA Availability & Rate Synchronization Engine',
      'Housekeeping Dispatch & Room Inspection Mobile Portal',
      'Contactless Guest QR Dining & Digital Billing Service'
    ],
    technologies: ['Next.js 16', 'React 19', 'Node.js', 'PostgreSQL', 'Redis Pub/Sub', 'WebSockets', 'Tailwind CSS'],
    verdict: 'Designed to unify property management, eliminate dining billing discrepancies, and provide a seamless 5-star digital guest experience.'
  },
  {
    slug: 'fintech-ledger',
    number: '05',
    category: 'Financial Technology & Microfinance',
    title: 'Double-Entry Accounting Ledger & Loan Disbursal Engine',
    subtitle: 'FINANCIAL TRANSACTION CORE & KYC PIPELINE',
    summary: 'An immutable double-entry ledger architecture with automated KYC verification webhooks, installment schedules, and dynamic delinquency alerts.',
    clientArchetype: 'Non-Banking Financial Company (NBFC) & Fintech Platform Archetype',
    industry: 'Fintech',
    accent: '#8b5cf6',
    heroImage: '/images/3d-software-dev.jpg',
    challenge: {
      title: 'Manual Underwriting Latency & Error-Prone Installment Tracking',
      description: 'Financial institutions handling high-frequency loan origination struggled with manual document audits, reconciliation discrepancies across payment gateways, and delayed default detection.',
      frictionPoints: [
        'Manual credit verification slowing loan approval from days to weeks',
        'Fragmented bank statements causing missed payment allocations and reconciliation errors',
        'Non-immutable financial records failing regulatory auditing standards',
        'Lack of real-time SMS/WhatsApp automated payment reminders'
      ]
    },
    solution: {
      title: 'Cryptographically Balanced FinCore Ledger Engine',
      description: 'Engineered FinCore, a strict double-entry transaction engine with automated KYC document parsing, automated NACH/e-Mandate collections, and real-time delinquency telemetry.',
      coreCapabilities: [
        'Immutable Cryptographic Double-Entry Ledger with Strict ACID Guarantees',
        'Automated KYC OCR Parsing & Instant Credit Underwriting Pipelines',
        'Automated EMI Schedule Generation & Payment Gateway Webhook Reconciliation',
        'Field Collection Officer Mobile App with Real-Time Thermal Receipting'
      ]
    },
    architecture: {
      frontend: 'Next.js Financial Dashboard // Field Agent Mobile PWA // Executive Analytics',
      services: 'Go (Golang) High-Throughput Transaction Engine // Kafka Message Bus',
      database: 'PostgreSQL with Row-Level Security // Redis Distributed Lock Manager',
      infrastructure: 'Private Cloud VPC // KMS Encrypted Key Storage // Air-Gapped Snapshots',
      security: 'Strict Financial Compliance // Zero-Knowledge Auditing // AES-256 GCM'
    },
    topologySteps: [
      { step: '01', title: 'KYC Document Ingestion', detail: 'Aadhaar/PAN/Bank statements parse through OCR and run automated fraud checks.' },
      { step: '02', title: 'Credit Score Calculation', detail: 'Rule engine calculates maximum loan eligibility and generates repayment amortization schedule.' },
      { step: '03', title: 'Atomic Disbursal', detail: 'Transaction engine verifies ledger balance and dispatches IMPS/NEFT transfer via banking API.' },
      { step: '04', title: 'Automated Reconciliation', detail: 'Daily collection webhooks credit double-entry accounts with zero rounding errors.' }
    ],
    metrics: [
      { label: 'Underwriting Time', value: '< 45s', detail: 'Automated algorithmic document parsing' },
      { label: 'Ledger Balancing', value: 'Strict ACID', detail: 'Zero debit/credit transaction imbalance' },
      { label: 'Reconciliation', value: '< 30s', detail: 'End-of-day bank statement matching' }
    ],
    deliverables: [
      'Double-Entry Accounting Core Engine & General Ledger',
      'Automated KYC Document Verification & Credit Engine',
      'Loan Origination System (LOS) & Loan Management System (LMS)',
      'Field Collection Officer Android / PWA Mobile App',
      'Automated SMS & WhatsApp Payment Reminder Daemon'
    ],
    technologies: ['Go (Golang)', 'Next.js 16', 'PostgreSQL', 'Apache Kafka', 'Redis', 'Docker', 'KMS Encryption'],
    verdict: 'Engineered to accelerate loan origination cycles, eliminate accounting reconciliation lag, and provide bank-grade regulatory audit integrity.'
  }
];

export function getWorkProject(slug: string): WorkProject | undefined {
  return WORK_PROJECTS.find((p) => p.slug === slug);
}
