export interface QuickSpec {
  domain: string;
  deploymentTopology: string;
  securityStandard: string;
  targetThroughput: string;
}

export interface ProjectIntroduction {
  overview: string;
  context: string;
  scope: string[];
}

export interface ProjectObjective {
  primaryGoal: string;
  coreObjectives: string[];
  regulatoryCompliance: string[];
  targetSla: string;
}

export interface ProjectFeature {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  capabilities: string[];
  badge?: string;
}

export interface TechStackDetail {
  category: string;
  stack: string;
  role: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  tag: string;
}

export interface WorkProject {
  slug: string;
  aliases?: string[];
  number: string;
  category: string;
  title: string;
  subtitle: string;
  summary: string;
  clientArchetype: string;
  industry: string;
  accent: string;
  heroImage: string;
  quickSpecs: QuickSpec;
  introduction: ProjectIntroduction;
  challenge: {
    title: string;
    description: string;
    frictionPoints: string[];
    rootCauses?: string[];
  };
  objective: ProjectObjective;
  solution: {
    title: string;
    description: string;
    coreCapabilities: string[];
    systemDesignStrategy: string;
  };
  architecture: {
    frontend: string;
    services: string;
    database: string;
    infrastructure: string;
    security: string;
  };
  features: ProjectFeature[];
  technologies: string[];
  techStackDetails: TechStackDetail[];
  topologySteps: {
    step: string;
    title: string;
    detail: string;
    status?: string;
  }[];
  visualizerType: 'healthcare' | 'education' | 'retail' | 'hospitality' | 'fintech';
  metrics: {
    label: string;
    value: string;
    detail: string;
  }[];
  verifiedOutcomes: string[];
  dataDisclosureNotice: string;
  deliverables: string[];
  gallery: GalleryItem[];
  verdict: string;
  nextSlug: string;
}

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: 'healthcare-emr',
    aliases: ['hospital-emr', 'hospital-management-software', 'healthos'],
    number: '01',
    category: 'Healthcare & Clinical Informatics',
    title: 'Hospital EMR & Multi-Department Clinical Platform',
    subtitle: 'ELECTRONIC MEDICAL RECORDS & WORKFLOW ENGINE',
    summary: 'An integrated clinical operating system unifying electronic medical records, real-time bed management, diagnostic pathology automation, and pharmacy billing.',
    clientArchetype: 'Super-Specialty Hospital & Multi-Branch Clinic Network',
    industry: 'Healthcare',
    accent: '#10b981',
    heroImage: '/images/work/3d-healthcare-emr.jpg',
    quickSpecs: {
      domain: 'Multi-Department Clinical EMR & Ward Grid',
      deploymentTopology: 'Isolated On-Premise & Hybrid Cloud Sync',
      securityStandard: 'HIPAA & NABH Ready • AES-256 GCM',
      targetThroughput: 'Sub-second prescription dispatch & 100% ACID billing'
    },
    introduction: {
      overview: 'Modern healthcare delivery requires tight coordination between rapid triage, outpatient clinics, inpatient wards, specialized diagnostic laboratories, and pharmacy dispensaries.',
      context: 'Tertiary hospitals and multi-branch clinic networks frequently suffer from departmental isolation. Doctors write paper prescriptions, nurses manually verify ward admissions, and pharmacy staff re-enter medication lists manually into disconnected POS terminals.',
      scope: [
        'Outpatient (OPD) & Inpatient (IPD) clinical workflows',
        'Electronic Health Record (EHR/EMR) with ICD-10 coding',
        'Real-time bed management & ward admission matrix',
        'Automated pathology lab analyzer interfacing & dispatch',
        'Sub-second thermal barcode pharmacy point of sale'
      ]
    },
    challenge: {
      title: 'Fragmented Clinical Workflows & Manual Triage Bottlenecks',
      description: 'The hospital faced severe data fragmentation between OPD triage, inpatient ward admissions, diagnostic laboratory dispatch, and pharmacy inventory. Paper-based chart routing introduced medication reconciliation delays and slowed billing during peak patient discharges.',
      frictionPoints: [
        'Paper-based patient intake causing 35+ minute OPD wait times during peak morning hours',
        'Disconnected pharmacy billing leading to inventory shrinkage and stockout surprises',
        'Diagnostic laboratory report latency impeding critical emergency decisions',
        'Non-compliant patient data access logs risking regulatory penalties'
      ],
      rootCauses: [
        'Siloed database instances with no asynchronous message bus',
        'Lack of real-time WebSocket state synchronization across nurse consoles',
        'Unstandardized data interchange lacking HL7/FHIR compatibility'
      ]
    },
    objective: {
      primaryGoal: 'Engineer a zero-latency, HIPAA/NABH compliant clinical operating system that unifies triage, doctor consoles, bed availability, pharmacy billing, and diagnostic labs into a single deterministic event loop.',
      coreObjectives: [
        'Eliminate paper prescription transit lag via instantaneous WebSocket push to pharmacy and lab nodes',
        'Provide real-time visual telemetry of hospital bed occupancy across ICU, General, and Private wards',
        'Ensure 100% ACID compliance and audit logging across all medication dispensing and financial billing records',
        'Support offline-resilient local cache fallback during network fluctuations'
      ],
      regulatoryCompliance: [
        'HIPAA Security Rule (45 CFR Part 160 & Part 164)',
        'NABH Digital Health Record Documentation Standards',
        'HL7 v2.x & FHIR R4 Ingestion Profiles',
        'Immutable Cryptographic Access Audit Trails'
      ],
      targetSla: '99.99% clinical console availability with <800ms prescription delivery'
    },
    solution: {
      title: 'Unified Event-Driven HealthOS Clinical Platform',
      description: 'OHO TECH engineered a distributed HealthOS clinical console with zero-latency record synchronization. Built on Next.js 16 and Go microservices, the system automates role-based doctor charts, sub-second pharmacy barcode dispensing, and automated HL7/FHIR diagnostic laboratory pipelines.',
      coreCapabilities: [
        'Role-Based Doctor & Clinician Prescription Consoles with ICD-10 Search',
        'Sub-Second Thermal Barcode Pharmacy Billing & Dynamic Stock Deduction',
        'Live Real-Time Bed Grid with Inpatient Admission & Discharge Coordination',
        'Automated Laboratory Machine Specimen Tracking & PDF Dispatch'
      ],
      systemDesignStrategy: 'Event-driven pub/sub architecture using Go microservices and Redis in-memory channels to propagate patient state instantly across outpatient, inpatient, pharmacy, and diagnostic nodes.'
    },
    architecture: {
      frontend: 'Next.js 16 App Router • High-Concurrency Clinical Consoles • Tailwind CSS',
      services: 'Go (Golang) Microservices • Asynchronous HL7/FHIR Ingestion Queue • gRPC',
      database: 'PostgreSQL Relational Core • Redis In-Memory Session Cache',
      infrastructure: 'Isolated Private VPC • Kubernetes Pod Isolation • Encrypted S3 Storage',
      security: 'HIPAA & NABH Ready • Mutual mTLS • AES-256 Encryption at Rest & In-Transit'
    },
    features: [
      {
        id: 'clinical-charting',
        title: 'Doctor EHR & Prescription Console',
        subtitle: 'RAPID DIAGNOSTIC ENTRY',
        description: 'Optimized touch and keyboard workflow for clinicians to record vital signs, diagnosis (ICD-10), medication dosages, and lab requests in under 60 seconds.',
        capabilities: [
          'Pre-configured prescription templates by specialty',
          'Drug allergy and cross-interaction warnings',
          'Instant digital signature and thermal/PDF dispatch',
          'Historical encounter timeline with trend graphs'
        ],
        badge: 'Zero Latency'
      },
      {
        id: 'bed-grid',
        title: 'Real-Time Inpatient Bed Grid',
        subtitle: 'WARD & OCCUPANCY TELEMETRY',
        description: 'Visual matrix displaying real-time status (Occupied, Reserved, Cleaning, Available) across ICU, CCU, General Ward, and Private Suites.',
        capabilities: [
          'Drag-and-drop patient bed transfers with automated nurse handover alerts',
          'Housekeeping sanitization status tracking',
          'Per-bed daily billing accrual telemetry',
          'Emergency isolation ward locking'
        ],
        badge: 'Live Telemetry'
      },
      {
        id: 'pharmacy-pos',
        title: 'Sub-Second Pharmacy Barcode POS',
        subtitle: 'DISPENSARY & INVENTORY ENGINE',
        description: 'High-speed counter checkout interfacing with barcode scanners, automated batch expiry enforcement, and instant stock deduction.',
        capabilities: [
          'Auto-populates doctor digital prescriptions without re-typing',
          'Batch & expiry FIFO/FEFO auto-allocation',
          'GST compliant thermal invoice generation in <800ms',
          'Automated reorder triggers for life-saving drugs'
        ],
        badge: 'Sub-800ms'
      },
      {
        id: 'diagnostic-lab',
        title: 'Automated Pathology & Radiology Gateway',
        subtitle: 'HL7/FHIR SPECIMEN PIPELINE',
        description: 'Bidirectional analyzer machine interfacing that tracks blood/tissue samples from barcode collection to calibrated test result dispatch.',
        capabilities: [
          'Unique barcoded vial and slide tracking',
          'Automated analyzer result ingestion via serial/TCP',
          'Pathologist digital signature workflow',
          'WhatsApp & SMS automated patient PDF report delivery'
        ],
        badge: 'Automated HL7'
      }
    ],
    technologies: ['Next.js 16', 'React 19', 'Go (Golang)', 'PostgreSQL', 'Redis Cache', 'HL7 / FHIR', 'Docker', 'Kubernetes'],
    techStackDetails: [
      { category: 'Frontend Layer', stack: 'Next.js 16 + React 19 + Tailwind CSS', role: 'Sub-second UI hydration, keyboard shortcuts, and real-time WebSocket state listeners.' },
      { category: 'Service Core', stack: 'Go (Golang) Microservices + gRPC', role: 'High-concurrency HL7 packet parsing, prescription routing, and background print spoolers.' },
      { category: 'Database & Cache', stack: 'PostgreSQL 16 + Redis Enterprise', role: 'ACID transaction boundary for billing ledgers and low-latency bed state caching.' },
      { category: 'Security & Mesh', stack: 'mTLS + AES-256 + OAuth2/OIDC RBAC', role: 'End-to-end cryptographic isolation complying with HIPAA and NABH audits.' }
    ],
    topologySteps: [
      { step: '01', title: 'Triage & Ingress', detail: 'Patient presents ID or scans QR code at reception; triage record creates atomic database lock with provisional vitals.', status: 'COMPLETED' },
      { step: '02', title: 'Clinical Charting', detail: 'Doctor prescribes ICD-10 diagnostics and medications; event propagates immediately via WebSocket bus to nodes.', status: 'COMPLETED' },
      { step: '03', title: 'Pharmacy & Lab Sync', detail: 'Dispensary and pathology nodes receive instantaneous push alerts for medication packaging and specimen draw.', status: 'COMPLETED' },
      { step: '04', title: 'Discharge & Audit', detail: 'Ledger reconciles all line items into a unified GST invoice with immutable cryptographic audit append.', status: 'COMPLETED' }
    ],
    visualizerType: 'healthcare',
    metrics: [
      { label: 'Triage Latency', value: '< 3.5 Min', detail: 'Intake-to-consultation workflow benchmark target' },
      { label: 'Pharmacy Speed', value: '< 800ms', detail: 'Barcode scan to billing ledger dispatch' },
      { label: 'Audit Trail', value: '100% ACID', detail: 'Immutable digital clinical record append' }
    ],
    verifiedOutcomes: [
      'Eliminated prescription transcription errors between consultation rooms and pharmacy dispensaries',
      'Real-time bed occupancy telemetry reduced emergency admission turnaround delays',
      'Automated laboratory analyzer interfacing eliminated manual test data entry backlogs',
      'Achieved strict regulatory audit compliance with immutable clinician modification logs'
    ],
    dataDisclosureNotice: 'All operational benchmarks are architectural design targets and verified platform performance specifications measured under simulated multi-department load testing.',
    deliverables: [
      'Role-Based Doctor, Nurse & Reception Consoles',
      'Sub-Second Pharmacy Barcode POS & Low-Stock Alerts',
      'IPD / OPD Ward Bed Management Visual Grid',
      'Automated Diagnostic Pathology Dispatch Gateway',
      'Encrypted Patient Health Records Portal (PWA)'
    ],
    gallery: [
      { id: 'g1', title: 'HealthOS Clinical Bed Management Console', subtitle: 'Real-time ward occupancy & patient telemetry grid', image: '/images/work/3d-healthcare-emr.jpg', tag: 'Clinical Grid' },
      { id: 'g2', title: 'Doctor EHR & Diagnostic Workflow Interface', subtitle: 'ICD-10 prescription and pathology dispatch portal', image: '/images/work/3d-education-erp.jpg', tag: 'Doctor Console' },
      { id: 'g3', title: 'Pharmacy Sub-Second Thermal POS Terminal', subtitle: 'Barcode scanning, FIFO batch selection & GST billing', image: '/images/work/3d-retail-pos.jpg', tag: 'Dispensary POS' }
    ],
    verdict: 'Designed to eliminate prescription paper trail lag, establish zero-latency pharmacy ledger updates, and optimize clinical patient flow across departments.',
    nextSlug: 'education-erp'
  },
  {
    slug: 'education-erp',
    aliases: ['university-erp', 'campus-erp', 'schoolcloud-erp'],
    number: '02',
    category: 'University & Higher Education Systems',
    title: 'Multi-Campus University Management & Examination Platform',
    subtitle: 'DISTRIBUTED MULTI-CAMPUS ERP & STUDENT PORTAL',
    summary: 'An end-to-end institutional platform supporting multi-branch campus operations, automated fee reconciliation, proctored digital assessments, and student portals.',
    clientArchetype: 'Multi-Campus Collegiate Network & State University Archetype',
    industry: 'Education',
    accent: '#06b6d4',
    heroImage: '/images/work/3d-education-erp.jpg',
    quickSpecs: {
      domain: 'Multi-Campus Academic Governance & Examination Core',
      deploymentTopology: 'Multi-Tenant Partitioning with Global Edge CDN',
      securityStandard: 'FERPA & Data Privacy Compliant • SSL Pinning',
      targetThroughput: '15,000+ Concurrent Students during Exam Publishing'
    },
    introduction: {
      overview: 'Collegiate networks and universities operating across multiple regional campuses require centralized governance combined with decentralized operational autonomy for individual departments and branch colleges.',
      context: 'Colleges managing branches with isolated spreadsheets and legacy desktop software struggle with fee reconciliation delays, student attendance tracking across biometric gates, and severe server crashes during semester mark publication.',
      scope: [
        'Multi-branch institutional hierarchy & dean/HOD governance',
        'Automated bank gateway fee ledger & challan reconciliation',
        'Biometric & RFID edge attendance telemetry daemons',
        'High-throughput examination marksheet compilation & PDF transcript generator',
        'Mobile student companion PWA for timetables and fees'
      ]
    },
    challenge: {
      title: 'Desynchronized Branch Databases & Manual Fee Reconciliation Lag',
      description: 'Managing interconnected campus branches with isolated spreadsheets resulted in reconciliation backlogs, delayed examination grade publishing, and fragmented student fee records.',
      frictionPoints: [
        'Multi-week lag in reconciling offline bank challans and online payment gateway webhooks',
        'Disparate biometric hardware unable to stream into centralized student attendance records',
        'High server load spikes during semester grade sheet publishing causing timeouts and downtime',
        'Complex syllabus and timetable scheduling conflicts across multi-department faculties'
      ],
      rootCauses: [
        'Lack of event-driven webhook processing for bank transaction reconciliation',
        'Monolithic database without read replicas unable to handle examination result query traffic',
        'Unstandardized biometric terminal protocols without background sync daemons'
      ]
    },
    objective: {
      primaryGoal: 'Build a distributed, multi-tenant university ERP that consolidates fee reconciliations, edge attendance telemetry, and high-concurrency examination publishing into a resilient cloud architecture.',
      coreObjectives: [
        'Automate 100% of online and challan fee reconciliations via idempotent bank webhooks',
        'Stream biometric clock-in logs from campus gates to central student profiles in real-time',
        'Enable batch generation and edge-cached distribution of 15,000+ examination transcripts in under 3 seconds',
        'Provide isolated tenant schemas ensuring complete branch data privacy and role-based permissions'
      ],
      regulatoryCompliance: [
        'National Academic Depository (NAD) Integration Standards',
        'FERPA & Student Privacy Protections',
        'Idempotent Payment Settlement Banking Protocols',
        'Role-Based RBAC Governance for Academic Audits'
      ],
      targetSla: '99.98% uptime during semester result publication peaks'
    },
    solution: {
      title: 'Decoupled Multi-Branch Campus ERP & Edge Portal',
      description: 'Engineered an event-driven institutional ERP featuring multi-tenant database partitioning, automated payment gateway webhooks, biometric sync daemons, and an edge-cached student grade portal.',
      coreCapabilities: [
        'Multi-Branch Tenant Isolation with Role-Based Dean/HOD Controls',
        'Automated Bank Webhook Fee Reconciliation & Digital Receipting',
        'Biometric & RFID Edge Attendance Synchronization',
        'Self-Service Student Portal for Grade Sheets, Timetables & Certificates'
      ],
      systemDesignStrategy: 'Separation of transactional administrative workloads from public student reading traffic via PostgreSQL read replicas and edge CDN caching for static grade transcripts.'
    },
    architecture: {
      frontend: 'React 19 Progressive Web App • Mobile Companion Apps • Next.js Admin',
      services: 'Node.js Microservices • AMQP Task Queue • Dynamic PDF Compiler',
      database: 'PostgreSQL with Dedicated Read Replicas • Redis Distributed Cache',
      infrastructure: 'Containerized Cloud Mesh • Global Edge CDN • Automated Autoscaler',
      security: 'Role-Based RBAC • Student Data Privacy • SSL Pinning on Mobile Apps'
    },
    features: [
      {
        id: 'academic-governance',
        title: 'Multi-Branch Academic Governance',
        subtitle: 'CENTRALIZED HIERARCHY',
        description: 'Hierarchical control panel allowing university chancellors and deans to configure course curricula, grading schemes, and faculty rosters across campuses.',
        capabilities: [
          'Branch-isolated student databases with centralized roll numbers',
          'Dynamic credit system and prerequisite course validators',
          'Faculty workload and timetable conflict detection engine',
          'Automated accreditation and compliance metric reporting'
        ],
        badge: 'Multi-Tenant'
      },
      {
        id: 'fee-ledger',
        title: 'Automated Fee Ledger & Bank Webhooks',
        subtitle: 'FINANCIAL RECONCILIATION',
        description: 'Idempotent payment pipeline reconciling online UPI/card payments and offline bank counter challans into student balance ledgers.',
        capabilities: [
          'Real-time webhook signature verification and ledger credit',
          'Automated installment schedules with late fee calculations',
          'Instant digital receipt generation with cryptographic verification QR',
          'Scholarship and financial aid quota allocation'
        ],
        badge: 'Real-Time Sync'
      },
      {
        id: 'exam-compiler',
        title: 'High-Throughput Exam & Marksheet Engine',
        subtitle: 'SUB-3S BATCH PUBLICATION',
        description: 'Distributed PDF compiler and calculation engine that evaluates CGPA/SGPA formulas and publishes student grade cards without server strain.',
        capabilities: [
          'Moderation and grace mark calculation pipelines',
          'Static PDF transcript compilation cached on Edge CDN nodes',
          'Digital certificate generation with tamper-proof watermarking',
          'Direct integration with National Academic Depository APIs'
        ],
        badge: 'Sub-3s Scale'
      },
      {
        id: 'attendance-edge',
        title: 'Edge Biometric & RFID Telemetry',
        subtitle: 'CAMPUS ACCESS DAEMON',
        description: 'Lightweight local sync services installed on campus hardware gates pushing clock-in payloads to central AMQP message queues.',
        capabilities: [
          'Offline buffering during temporary broadband interruptions',
          'Automated daily attendance threshold alerts to parents via SMS/WhatsApp',
          'Hostel in/out curfew tracking and visitor logs',
          'Faculty classroom biometric validation'
        ],
        badge: 'Edge Daemon'
      }
    ],
    technologies: ['React 19', 'Next.js 16', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'Cloudflare CDN', 'TypeScript'],
    techStackDetails: [
      { category: 'Frontend Portal', stack: 'Next.js 16 + React 19 + Tailwind CSS', role: 'Accessible student PWA, administrative governance consoles, and responsive faculty mark entry.' },
      { category: 'Background Tasks', stack: 'Node.js Workers + RabbitMQ AMQP', role: 'Asynchronous bank webhook processing, attendance log ingestion, and marksheet PDF rendering.' },
      { category: 'Database Tier', stack: 'PostgreSQL 16 with Read Replicas', role: 'Strict relational data model with read replicas isolating public grade traffic.' },
      { category: 'Edge Delivery', stack: 'Cloudflare CDN + Redis Cluster', role: 'Edge caching of static examination results and student syllabus assets.' }
    ],
    topologySteps: [
      { step: '01', title: 'Student Enrollment', detail: 'Online admission generates encrypted student UID and provisions multi-year ledger account with fee structures.', status: 'COMPLETED' },
      { step: '02', title: 'Attendance Telemetry', detail: 'Edge biometric gates push attendance payloads to central message queue every 10 seconds.', status: 'COMPLETED' },
      { step: '03', title: 'Payment Webhook Sync', detail: 'Bank payment gateways invoke idempotent webhooks that immediately balance fee accounts and release exam admit cards.', status: 'COMPLETED' },
      { step: '04', title: 'Grade Compilation', detail: 'Faculty marksheets compile via distributed background workers with sub-second grade publication.', status: 'COMPLETED' }
    ],
    visualizerType: 'education',
    metrics: [
      { label: 'Fee Sync Rate', value: 'Real-Time', detail: 'Instantaneous ledger update upon webhook ack' },
      { label: 'Grade Compile', value: '< 2.4s', detail: 'Batch compilation across 15,000 students' },
      { label: 'Availability', value: '99.98%', detail: 'Continuous uptime during exam publication' }
    ],
    verifiedOutcomes: [
      'Automated bank webhook reconciliation eliminated manual challan matching delays',
      'Read replica architecture handled massive examination publication traffic with zero downtime',
      'Centralized multi-campus governance eliminated duplicate student enrollment records',
      'Edge biometric attendance telemetry provided instant absent alerts to guardians'
    ],
    dataDisclosureNotice: 'Performance figures are verified design benchmarks tested against simulated 15,000+ concurrent student grade requests and high-volume payment gateway webhooks.',
    deliverables: [
      'Multi-Branch Academic Governance Console',
      'Automated Bank Gateway Fee Ledger Engine',
      'Biometric Edge Attendance Ingestion Service',
      'High-Throughput Digital Grade Sheet & Certificate Generator',
      'Native Student & Parent Companion Mobile Applications'
    ],
    gallery: [
      { id: 'g1', title: 'Multi-Campus Institutional Overview Dashboard', subtitle: 'Central governance metrics, fee intake, and enrollment statistics', image: '/ecosystem_education.png', tag: 'University Admin' },
      { id: 'g2', title: 'High-Concurrency Examination Publishing Console', subtitle: 'Grade moderation, CGPA calculations, and transcript distribution', image: '/hero_workspace_editorial.jpg', tag: 'Exam Engine' },
      { id: 'g3', title: 'Student & Guardian Mobile Companion App', subtitle: 'Real-time timetable, fee payment receipts, and attendance tracking', image: '/images/3d-enterprise-node.jpg', tag: 'Student PWA' }
    ],
    verdict: 'Unified multi-campus academic operations into a resilient control center with automated financial governance and zero examination publication downtime.',
    nextSlug: 'retail-pos'
  },
  {
    slug: 'retail-pos',
    aliases: ['retail-omnichannel', 'retailpos-billing', 'depot-pos'],
    number: '03',
    category: 'Commercial Retail & Supply Chain',
    title: 'High-Throughput Retail POS & Inventory Sync Engine',
    subtitle: 'OMNICHANNEL STORE & DEPOT BILLING SUITE',
    summary: 'An offline-first retail counter billing engine with real-time depot synchronization, GST-compliant invoicing, and multi-store warehouse inventory coordination.',
    clientArchetype: 'Multi-Location Retail Superstore Chain & Regional Warehouse Network',
    industry: 'Retail',
    accent: '#3b82f6',
    heroImage: '/images/work/3d-retail-pos.jpg',
    quickSpecs: {
      domain: 'Offline-First Counter Billing & Warehouse Sync',
      deploymentTopology: 'Local SQLite Edge Nodes + Cloud Master Hub',
      securityStandard: 'Encrypted Local Spool • Hardware MAC Whitelisting',
      targetThroughput: '<180ms Counter Checkout • 10,000+ Daily SKUs'
    },
    introduction: {
      overview: 'High-density retail stores, supermarkets, and multi-outlet brand chains cannot afford point-of-sale slowdowns or transaction failures during broadband connectivity dropouts.',
      context: 'Traditional cloud-only POS systems crash when store internet fails, causing long customer queues and lost sales. Meanwhile, disconnected offline systems result in warehouse inventory drift and phantom stock.',
      scope: [
        'Offline-first counter billing application with embedded SQLite cache',
        'Sub-second thermal barcode scanning and multi-item calculation',
        'Asynchronous WebSocket synchronization daemon to central depot database',
        'Consolidated multi-store GST invoicing and tax ledger compilation',
        'Dynamic low-stock threshold triggers and supplier purchase order automation'
      ]
    },
    challenge: {
      title: 'Counter Checkout Bottlenecks & Depot Inventory Drift',
      description: 'High-volume checkout counters experienced network dropouts during peak retail hours. Central inventory was desynchronized from physical store shelves, causing phantom stock and lost sales.',
      frictionPoints: [
        'Counter POS crashes during internet outages halting physical checkouts and frustrating shoppers',
        'Inventory drift between regional depots and outlet store shelves creating inaccurate reorders',
        'Complex tax calculations and slow multi-item barcode lookups degrading checkout throughput',
        'Delayed replenishment triggers resulting in stockouts of top-selling retail SKUs'
      ],
      rootCauses: [
        'Synchronous HTTP network calls required for barcode lookups during counter billing',
        'Lack of local embedded storage ensuring offline operational continuity',
        'Batch reconciliation scripts running only at end-of-day causing intra-day stock drift'
      ]
    },
    objective: {
      primaryGoal: 'Engineer an offline-first retail checkout engine with an embedded edge cache that executes sales in under 180ms and streams inventory updates asynchronously upon network availability.',
      coreObjectives: [
        'Guarantee 100% uninterrupted checkout operations regardless of broadband status via local SQLite cache',
        'Achieve sub-12ms barcode lookup speeds across catalogs containing 50,000+ SKUs',
        'Stream sold inventory logs to regional depot servers via WebSocket daemons within 500ms of reconnection',
        'Generate GST-compliant itemized thermal receipts with zero rounding discrepancies'
      ],
      regulatoryCompliance: [
        'GST Electronic Way Bill (E-Way Bill) Protocols',
        'Fiscal Printer & Thermal Hardware Driver Standards',
        'Hardware MAC Whitelisting & Cash Drawer Security',
        'ACID Local-to-Cloud Ledger Reconciliation'
      ],
      targetSla: '100% offline checkout availability with sub-180ms transaction cycles'
    },
    solution: {
      title: 'Offline-First RetailPOS with Edge Sync Daemon',
      description: 'OHO TECH architected RetailPOS with an embedded SQLite edge cache, thermal printing optimizations, and an asynchronous WebSocket synchronization engine that guarantees zero checkout delays even when offline.',
      coreCapabilities: [
        'Offline-First Local Terminal Billing with Sub-Second Checkout',
        'Automatic Background Sync to Central PostgreSQL Cluster upon Reconnection',
        'Consolidated Multi-Store GST & VAT Tax Reporting Engine',
        'Dynamic Low-Stock Reorder Triggers & Supplier PO Dispatch'
      ],
      systemDesignStrategy: 'Decoupled edge architecture running a local lightweight daemon that writes transactions immediately to encrypted SQLite storage, followed by opportunistic streaming to the cloud.'
    },
    architecture: {
      frontend: 'High-Speed Desktop Counter Interface • Web Master Admin Console',
      services: 'High-Throughput REST APIs • WebSocket Sync Daemon • Go Print Spooler',
      database: 'Central PostgreSQL Master • Local SQLite Edge Cache',
      infrastructure: 'Dockerized Microservices • Encrypted Local Vault • Private Cloud',
      security: 'Cryptographic Batch Hashes • Hardware MAC Whitelisting • Zero Data Loss'
    },
    features: [
      {
        id: 'offline-billing',
        title: 'Offline-First Edge Terminal',
        subtitle: 'UNINTERRUPTED COUNTERS',
        description: 'Desktop counter runtime operating seamlessly with or without an active internet connection, storing all transactions in an encrypted local SQLite ledger.',
        capabilities: [
          'Instant barcode decoding and instant price lookups (<12ms)',
          'Multi-payment tender (Cash, Card, QR, Store Credit)',
          'Automatic thermal receipt spooling via local ESC/POS drivers',
          'Cashier shift opening, drawer balancing, and closing audits'
        ],
        badge: '100% Offline'
      },
      {
        id: 'sync-daemon',
        title: 'WebSocket Depot Sync Daemon',
        subtitle: 'ASYNC RECONCILIATION',
        description: 'Background daemon that detects internet reconnection, validates cryptographic transaction hashes, and synchronizes sales payloads to the cloud master database.',
        capabilities: [
          'Automatic backoff and retry mechanisms with zero duplicate entries',
          'Delta synchronization minimizing broadband bandwidth usage',
          'Conflict resolution for concurrent price or stock modifications',
          'Bi-directional catalog updates pushed down from central HQ'
        ],
        badge: 'WebSocket Bus'
      },
      {
        id: 'inventory-reorder',
        title: 'Multi-Store Depot & Stock Matrix',
        subtitle: 'SUPPLY CHAIN REORDERING',
        description: 'Centralized warehouse dashboard providing live stock visibility across physical store shelves, transit shipments, and regional depots.',
        capabilities: [
          'Automated reorder point (ROP) calculation based on sales velocity',
          'Inter-store stock transfer requests and bill-of-lading generation',
          'Batch barcode label printing and RFID tag integration',
          'Supplier purchase order generation and email/WhatsApp dispatch'
        ],
        badge: 'Depot Matrix'
      },
      {
        id: 'gst-compliance',
        title: 'GST & Fiscal Tax Compliance Engine',
        subtitle: 'TAX AUDIT ACCURACY',
        description: 'Built-in tax engine that calculates CGST, SGST, IGST, and cess accurately per SKU category with automated GSTR-1 export capability.',
        capabilities: [
          'HSN/SAC code search and automatic rate classification',
          'E-Invoicing and B2B QR code generation on invoices',
          'Consolidated end-of-day sales summary for accounting packages',
          'Credit note, return, and replacement ledger adjustments'
        ],
        badge: 'GST Invoicing'
      }
    ],
    technologies: ['TypeScript', 'SQLite Edge', 'PostgreSQL', 'WebSockets', 'Go (Golang)', 'Docker', 'Tailwind CSS'],
    techStackDetails: [
      { category: 'Edge Terminal', stack: 'TypeScript + SQLite + ESC/POS Driver', role: 'Local desktop counter app with zero network latency dependency.' },
      { category: 'Sync Pipeline', stack: 'Go Sync Daemon + WebSockets', role: 'Asynchronous streaming of sales batches to central headquarters.' },
      { category: 'Central Hub', stack: 'PostgreSQL 16 + Next.js Admin', role: 'Consolidated master inventory, pricing tables, and multi-store analytics.' },
      { category: 'Security Layer', stack: 'SHA-256 Batch Hashing + AES-256 Vault', role: 'Ensures local offline transactions cannot be altered before cloud sync.' }
    ],
    topologySteps: [
      { step: '01', title: 'Barcode Ingestion', detail: 'Hardware scanner inputs barcode; local SQLite database matches SKU in under 12 milliseconds.', status: 'COMPLETED' },
      { step: '02', title: 'Tax & Discount Engine', detail: 'GST rules and promo codes calculate instantly without requiring network roundtrips.', status: 'COMPLETED' },
      { step: '03', title: 'Offline Transaction Queue', detail: 'Receipt prints immediately while transaction payload is appended to encrypted local sync spool.', status: 'COMPLETED' },
      { step: '04', title: 'Depot Stock Sync', detail: 'Sync daemon streams sold SKUs to regional depot database via WebSocket to update reorder thresholds.', status: 'COMPLETED' }
    ],
    visualizerType: 'retail',
    metrics: [
      { label: 'Barcode Lookup', value: '< 12ms', detail: 'Local edge database match speed' },
      { label: 'Counter Latency', value: '< 180ms', detail: 'Full checkout cycle per customer' },
      { label: 'Offline Resilience', value: '100% Fail-Safe', detail: 'Zero transactions lost during outages' }
    ],
    verifiedOutcomes: [
      'Eliminated checkout line stalls during broadband network interruptions',
      'Unified warehouse stock levels with physical store counters in real-time',
      'Automated purchase order triggers prevented top-selling SKU stockouts',
      'Accelerated cashier transaction throughput to under 180ms per customer'
    ],
    dataDisclosureNotice: 'Speed metrics represent benchmark measurements conducted on edge hardware terminals running local SQLite caches under high-frequency barcode scan loads.',
    deliverables: [
      'Offline-First Desktop Terminal Counter Application',
      'Central Depot & Multi-Store Inventory Management Portal',
      'Automated Low-Stock Trigger & Supplier Purchase Order Engine',
      'Comprehensive GST-Compliant Financial Ledger & Analytics',
      'Barcode Label Generation & Thermal Hardware Drivers'
    ],
    gallery: [
      { id: 'g1', title: 'RetailPOS Offline-First Terminal Counter UI', subtitle: 'Fast checkout, thermal printing, and barcode scanner integration', image: '/images/3d-software-dev.jpg', tag: 'Counter POS' },
      { id: 'g2', title: 'Central Multi-Store Depot & Stock Matrix', subtitle: 'Regional warehouse inventory allocation and supplier purchase orders', image: '/hero_launch_artwork.png', tag: 'Depot Sync' },
      { id: 'g3', title: 'GST Compliance & Sales Analytics Engine', subtitle: 'Automated tax ledgers, E-Way bills, and multi-outlet financial reports', image: '/hero_workspace_editorial.jpg', tag: 'Tax Engine' }
    ],
    verdict: 'Engineered to guarantee uninterrupted checkout counters, eliminate multi-store inventory drift, and automate regional warehouse replenishment.',
    nextSlug: 'hospitality-erp'
  },
  {
    slug: 'hospitality-erp',
    aliases: ['hotel-management', 'hotel-hospitality', 'propertyos-pos'],
    number: '04',
    category: 'Hotel & Hospitality Management',
    title: 'Hotel ERP, Kitchen Display & Multi-Channel Booking System',
    subtitle: 'UNIFIED PROPERTY & RESTAURANT POS PLATFORM',
    summary: 'A unified property management platform integrating front-desk room reservations, contactless dining POS, kitchen display workflows, and housekeeping operations.',
    clientArchetype: 'Boutique Resort Chain & Luxury Hotel Group',
    industry: 'Hospitality',
    accent: '#f59e0b',
    heroImage: '/images/work/3d-hospitality-erp.jpg',
    quickSpecs: {
      domain: 'Property Management & Restaurant Kitchen Display',
      deploymentTopology: 'Edge Serverless Functions + Real-Time WebSocket Bus',
      securityStandard: 'PCI-DSS Compliant • Tokenized Room Access Keys',
      targetThroughput: '<150ms Kitchen Display Push • 2-Way OTA Channel Sync'
    },
    introduction: {
      overview: 'Modern resorts and luxury hotels manage complex interlinked guest touchpoints: online room reservations across OTAs, front-desk check-in, restaurant dining, 24/7 room service, and housekeeping turnover.',
      context: 'When front-desk software is disconnected from restaurant POS and housekeeping rosters, guests face delayed room check-ins, dining bills are lost or misallocated to wrong guest folios, and hotels risk expensive overbooking across booking channels.',
      scope: [
        'Front-desk room availability matrix & guest folio ledger',
        '2-Way OTA channel manager synchronization (Booking.com, Agoda, MakeMyTrip)',
        'Touch-optimized digital Kitchen Display System (KDS) for restaurant chefs',
        'Housekeeping room inspection and maintenance dispatch app',
        'Contactless QR code room-service ordering and guest bill consolidation'
      ]
    },
    challenge: {
      title: 'Disconnected Front-Desk, Dining Orders & Room Service',
      description: 'Front-desk room bookings operated separately from the restaurant POS and housekeeping rosters. Guests suffered delayed check-ins, dining bills failed to post to room accounts, and OTA inventory required manual updates.',
      frictionPoints: [
        'Manual room rate adjustments across OTAs causing overbooking and rate parity issues',
        'Kitchen order tickets (KOT) lost between dining tables and the kitchen line',
        'Housekeeping status lag leaving clean rooms marked as occupied in the system',
        'Fragmented guest billing at checkout causing invoice disputes and slow departures'
      ],
      rootCauses: [
        'Lack of an integrated room folio routing engine for restaurant POS orders',
        'One-way channel updates requiring staff to manually adjust room inventory',
        'Paper KOT slips prone to physical loss and timing miscommunications in the kitchen'
      ]
    },
    objective: {
      primaryGoal: 'Engineer a unified hospitality platform connecting front-desk room inventories, restaurant kitchen displays, housekeeping telemetry, and OTA channels into an instantaneous event bus.',
      coreObjectives: [
        'Sync room availability and tariff rates across OTAs within 1.8 seconds of booking confirmation',
        'Stream dining and room-service food orders to kitchen display terminals in under 150 milliseconds',
        'Post all restaurant, bar, and spa expenses directly to the guest room folio with instant cashier signature',
        'Equip housekeeping teams with real-time room readiness telemetry to accelerate guest check-ins'
      ],
      regulatoryCompliance: [
        'PCI-DSS Payment Card Data Security Standards',
        'Hotel Guest Identity Verification & C-Form Regulations',
        'GST & Luxury Hospitality Tax Invoicing Norms',
        'Secure Tokenized Digital Key Protocols'
      ],
      targetSla: '99.99% availability with zero double-booking incidents across OTA channels'
    },
    solution: {
      title: 'Unified PropertyOS & Kitchen Display Workflow',
      description: 'Delivered an integrated PropertyOS combining real-time room availability grids, digital kitchen display systems (KDS), automated OTA channel managers, and mobile guest check-in.',
      coreCapabilities: [
        'Real-Time Room Availability Matrix with 2-Way OTA Channel Synchronization',
        'Interactive Kitchen Display Screen (KDS) with Course Timing Controls',
        'Instantaneous Room-Charge Dining Bill Routing & Payment Gateways',
        'Housekeeping Task Dispatch with Live Room Cleanliness Telemetry'
      ],
      systemDesignStrategy: 'Event-driven architecture where every reservation or dining event generates a typed state change that cascades instantly to the front-desk room matrix, kitchen screens, and financial ledger.'
    },
    architecture: {
      frontend: 'Next.js 16 Touch-Optimized KDS • Front-Desk Web Portal • Guest Mobile App',
      services: 'Event-Driven Node.js Microservices • Redis Pub/Sub • WebSocket Event Bus',
      database: 'PostgreSQL Relational Core • Multi-Tenant Room Ledger',
      infrastructure: 'Edge Serverless Functions • Containerized Cloud VPC',
      security: 'PCI-DSS Compliant Payment Routing • Tokenized Room Access Keys'
    },
    features: [
      {
        id: 'room-matrix',
        title: 'Front-Desk Room Availability Grid',
        subtitle: 'VISUAL CALENDAR & FOLIO',
        description: 'Interactive timeline matrix showing real-time occupancy across room categories, guest check-ins, early departures, and housekeeping flags.',
        capabilities: [
          'One-click room allocation, guest ID scanning, and key generation',
          'Consolidated guest folio aggregating room rates, mini-bar, and spa charges',
          'Early check-in / late check-out fee calculation engine',
          'Corporate booking and group tariff contract management'
        ],
        badge: 'Live Matrix'
      },
      {
        id: 'kds-screen',
        title: 'Kitchen Display System (KDS)',
        subtitle: 'COLOR-CODED ORDER LINE',
        description: 'Large-screen touch interface for kitchen chefs that organizes orders by table, course sequence, preparation timer, and dietary tags.',
        capabilities: [
          'Eliminates lost paper KOT tickets with audio-visual order alerts',
          'Course sequencing (Appetizers → Mains → Desserts)',
          'Average preparation time telemetry and kitchen bottleneck analytics',
          'Direct waiter mobile notification when food is plated and ready'
        ],
        badge: 'Sub-150ms KDS'
      },
      {
        id: 'ota-sync',
        title: '2-Way OTA Channel Manager',
        subtitle: 'RATE & INVENTORY SYNC',
        description: 'Automated bidirectional channel connector updating room allocations and dynamic pricing across Booking.com, Agoda, Expedia, and direct web portals.',
        capabilities: [
          'Real-time inventory updates preventing overbooking across all channels',
          'Dynamic rate rule engine adjusting tariffs based on seasonal occupancy',
          'Automatic reservation ingestion and guest profile creation',
          'Rate parity enforcement ensuring brand compliance'
        ],
        badge: '2-Way OTA'
      },
      {
        id: 'housekeeping-app',
        title: 'Housekeeping & Maintenance Dispatch',
        subtitle: 'ROOM TURNOVER TELEMETRY',
        description: 'Mobile web portal for cleaning supervisors to inspect vacant rooms, log maintenance issues, and mark rooms clean for front-desk check-in.',
        capabilities: [
          'Automatic cleaning task assignment upon guest checkout',
          'Photo upload for damaged amenities or lost-and-found items',
          'Linen and mini-bar consumption logging',
          'Real-time status sync directly into front-desk room matrix'
        ],
        badge: 'Turnover Telemetry'
      }
    ],
    technologies: ['Next.js 16', 'React 19', 'Node.js', 'PostgreSQL', 'Redis Pub/Sub', 'WebSockets', 'Tailwind CSS'],
    techStackDetails: [
      { category: 'Kitchen & Desk UI', stack: 'Next.js 16 + React 19 + Tailwind CSS', role: 'Touch-optimized kitchen display screens and responsive front-desk reservation grids.' },
      { category: 'Real-Time Channel Bus', stack: 'Node.js Microservices + Redis Pub/Sub', role: 'Sub-second distribution of KOT orders and OTA reservation state.' },
      { category: 'Data Core', stack: 'PostgreSQL 16 Multi-Tenant Schema', role: 'ACID transaction management for guest folios, dining bills, and night audits.' },
      { category: 'Payment & API', stack: 'PCI-DSS Tokenization Gateway', role: 'Secure card authorization and contactless room-charge validation.' }
    ],
    topologySteps: [
      { step: '01', title: 'Reservation Booking', detail: 'Direct booking or OTA API updates room grid instantly, adjusting inventory across all channels in <1.8s.', status: 'COMPLETED' },
      { step: '02', title: 'Guest Check-In', detail: 'Front desk generates digital room key and allocates housekeeping inspect flag.', status: 'COMPLETED' },
      { step: '03', title: 'Dining & Service KOT', detail: 'Waiter inputs food order; kitchen display updates in real-time with color-coded preparation timer.', status: 'COMPLETED' },
      { step: '04', title: 'Consolidated Folio', detail: 'All dining, spa, and room charges aggregate into an itemized checkout statement with zero manual billing transfers.', status: 'COMPLETED' }
    ],
    visualizerType: 'hospitality',
    metrics: [
      { label: 'Channel Sync', value: '< 1.8s', detail: 'OTA rate and inventory update speed' },
      { label: 'KDS Order Delay', value: '< 150ms', detail: 'Table order to kitchen display push' },
      { label: 'Checkout Speed', value: '< 1.5 Min', detail: 'Complete guest folio reconciliation' }
    ],
    verifiedOutcomes: [
      'Eliminated overbooking incidents through automated two-way OTA channel synchronization',
      'Cut kitchen order transit time to zero, improving table turn rates and meal freshness',
      'Eliminated missing dining charges by routing restaurant bills directly to room folios',
      'Accelerated guest room turnover via live housekeeping inspection telemetry'
    ],
    dataDisclosureNotice: 'Metrics represent architectural design benchmarks verified in simulated multi-channel OTA booking loads and high-volume restaurant kitchen order tests.',
    deliverables: [
      'Front-Desk Real-Time Room Grid & Guest Folio System',
      'Touch-Optimized Kitchen Display System (KDS) & Waiter App',
      'Multi-Channel OTA Availability & Rate Synchronization Engine',
      'Housekeeping Dispatch & Room Inspection Mobile Portal',
      'Contactless Guest QR Dining & Digital Billing Service'
    ],
    gallery: [
      { id: 'g1', title: 'PropertyOS Interactive Front-Desk Room Calendar', subtitle: 'Live room availability matrix, guest check-in, and folio management', image: '/images/3d-digital-growth.jpg', tag: 'Room Matrix' },
      { id: 'g2', title: 'Touch-Optimized Restaurant Kitchen Display (KDS)', subtitle: 'Color-coded order tickets, preparation timers, and waiter alerts', image: '/hero_ecosystem_illustration.jpg', tag: 'Kitchen KDS' },
      { id: 'g3', title: 'Multi-Channel OTA Availability & Pricing Engine', subtitle: 'Two-way rate parity synchronization with leading travel agencies', image: '/hero_launch_artwork.png', tag: 'Channel Sync' }
    ],
    verdict: 'Designed to unify property management, eliminate dining billing discrepancies, and provide a seamless 5-star digital guest experience.',
    nextSlug: 'fintech-ledger'
  },
  {
    slug: 'fintech-ledger',
    aliases: ['fincore-ledger', 'finance-nbfc', 'microfinance-core'],
    number: '05',
    category: 'Financial Technology & Microfinance',
    title: 'Double-Entry Accounting Ledger & Loan Disbursal Engine',
    subtitle: 'FINANCIAL TRANSACTION CORE & KYC PIPELINE',
    summary: 'An immutable double-entry ledger architecture with automated KYC verification webhooks, installment schedules, and dynamic delinquency alerts.',
    clientArchetype: 'Non-Banking Financial Company (NBFC) & Fintech Platform Archetype',
    industry: 'Fintech',
    accent: '#8b5cf6',
    heroImage: '/images/work/3d-fintech-ledger.jpg',
    quickSpecs: {
      domain: 'Immutable Double-Entry Ledger & Loan Disbursal',
      deploymentTopology: 'Private Cloud VPC with Distributed Lock Manager',
      securityStandard: 'Bank-Grade Compliance • AES-256 GCM Encrypted Vault',
      targetThroughput: '<45s KYC Verification • Zero Transaction Imbalance'
    },
    introduction: {
      overview: 'Digital lending institutions, microfinance companies, and non-banking financial corporations (NBFCs) require bulletproof transaction integrity, automated credit underwriting, and automated EMI collection reconciliation.',
      context: 'Manual underwriting workflows taking days, spreadsheet-managed loan balances, and delayed bank payment matching cause severe credit default risks, balance sheet discrepancies, and regulatory audit penalties.',
      scope: [
        'Strict double-entry transaction engine with immutable debit/credit balancing',
        'Automated KYC OCR document parsing & credit underwriting pipeline',
        'Automated EMI installment amortization schedules & e-Mandate collection triggers',
        'Field loan officer mobile application with thermal receipt printing',
        'Real-time regulatory compliance reporting and delinquency aging analysis'
      ]
    },
    challenge: {
      title: 'Manual Underwriting Latency & Error-Prone Installment Tracking',
      description: 'Financial institutions handling high-frequency loan origination struggled with manual document audits, reconciliation discrepancies across payment gateways, and delayed default detection.',
      frictionPoints: [
        'Manual credit verification slowing loan approval from days to weeks and increasing drop-offs',
        'Fragmented bank statements causing missed payment allocations and reconciliation errors',
        'Non-immutable financial records failing strict banking regulatory auditing standards',
        'Lack of real-time SMS/WhatsApp automated payment reminders leading to higher delinquency'
      ],
      rootCauses: [
        'Single-entry accounting systems vulnerable to rounding errors and ledger imbalances',
        'Manual PDF and identity document verification without automated OCR pipelines',
        'Lack of automated webhook reconciliation for daily bank collection feeds'
      ]
    },
    objective: {
      primaryGoal: 'Engineer a cryptographically balanced, double-entry financial core that guarantees zero transaction ledger imbalance and accelerates loan origination to under 45 seconds.',
      coreObjectives: [
        'Enforce strict mathematical balance (Debit = Credit) on every single transaction with row-level locks',
        'Automate KYC verification and credit underwriting via algorithmic OCR pipelines within 45 seconds',
        'Reconcile end-of-day banking collection statement batches in under 30 seconds',
        'Provide immutable cryptographic audit trails ensuring compliance with banking regulatory reviews'
      ],
      regulatoryCompliance: [
        'RBI Digital Lending Regulatory Guidelines',
        'Strict Double-Entry ACID Ledger Principles',
        'Aadhaar / PAN Verification Data Privacy Norms',
        'Zero-Knowledge Proof Audit Logging Architecture'
      ],
      targetSla: '100% mathematical ledger balance with sub-45s automated underwriting'
    },
    solution: {
      title: 'Cryptographically Balanced FinCore Ledger Engine',
      description: 'Engineered FinCore, a strict double-entry transaction engine with automated KYC document parsing, automated NACH/e-Mandate collections, and real-time delinquency telemetry.',
      coreCapabilities: [
        'Immutable Cryptographic Double-Entry Ledger with Strict ACID Guarantees',
        'Automated KYC OCR Parsing & Instant Credit Underwriting Pipelines',
        'Automated EMI Schedule Generation & Payment Gateway Webhook Reconciliation',
        'Field Collection Officer Mobile App with Real-Time Thermal Receipting'
      ],
      systemDesignStrategy: 'Strict transactional core where account mutations are executed exclusively through balanced journal entries protected by distributed lock managers and immutable append-only logs.'
    },
    architecture: {
      frontend: 'Next.js Financial Dashboard • Field Agent Mobile PWA • Executive Analytics',
      services: 'Go (Golang) High-Throughput Transaction Engine • Kafka Message Bus',
      database: 'PostgreSQL with Row-Level Security • Redis Distributed Lock Manager',
      infrastructure: 'Private Cloud VPC • KMS Encrypted Key Storage • Air-Gapped Snapshots',
      security: 'Strict Financial Compliance • Zero-Knowledge Auditing • AES-256 GCM'
    },
    features: [
      {
        id: 'double-entry-core',
        title: 'Immutable Double-Entry Ledger Core',
        subtitle: 'STRICT ACID INTEGRITY',
        description: 'Core journal engine that enforces equal debit and credit balancing for every transaction, preventing rounding anomalies and ledger tampering.',
        capabilities: [
          'Row-level locking ensuring concurrent transaction safety',
          'Cryptographic SHA-256 batch seals on closed daily financial books',
          'Dynamic multi-currency and multi-branch ledger hierarchy',
          'Instant trial balance and balance sheet generation'
        ],
        badge: '100% ACID'
      },
      {
        id: 'kyc-pipeline',
        title: 'Automated KYC & Underwriting Pipeline',
        subtitle: 'SUB-45S ORIGINATION',
        description: 'Automated document ingestion pipeline that extracts customer identity data from identity documents and calculates credit risk scores in seconds.',
        capabilities: [
          'Optical Character Recognition (OCR) for Aadhaar, PAN, and Bank Statements',
          'Automated fraud detection and duplicate applicant identification',
          'Customizable risk-scoring rule engine and loan limit allocator',
          'Instant digital loan agreement signing and biometric consent'
        ],
        badge: 'Sub-45s KYC'
      },
      {
        id: 'emi-amortization',
        title: 'EMI Amortization & Webhook Reconciliation',
        subtitle: 'COLLECTION AUTOMATION',
        description: 'Automated installment scheduler calculating principal and interest breakdowns with automated NACH/e-Mandate collection processing.',
        capabilities: [
          'Dynamic installment schedule generation with custom moratoriums',
          'Instantaneous bank collection webhook reconciliation',
          'Automated SMS & WhatsApp payment reminders with payment links',
          'Real-time overdue classification and penalty interest calculation'
        ],
        badge: 'Auto EMI Sync'
      },
      {
        id: 'field-officer-app',
        title: 'Field Collection Officer Mobile Portal',
        subtitle: 'OFFLINE-CAPABLE PWA',
        description: 'Mobile application for field agents to collect loan installments in rural or semi-urban areas, issue thermal receipts, and sync upon connectivity.',
        capabilities: [
          'GPS-stamped collection confirmation and route optimization',
          'Bluetooth thermal receipt printing on field handhelds',
          'Offline collection queueing with cryptographic verification',
          'Daily cash collection drawer handover and reconciliation'
        ],
        badge: 'Field PWA'
      }
    ],
    technologies: ['Go (Golang)', 'Next.js 16', 'PostgreSQL', 'Apache Kafka', 'Redis', 'Docker', 'KMS Encryption'],
    techStackDetails: [
      { category: 'Ledger Runtime', stack: 'Go (Golang) + PostgreSQL 16', role: 'High-throughput ACID transaction processing with row-level locks and zero imbalance.' },
      { category: 'Event Bus', stack: 'Apache Kafka + Redis Lock Manager', role: 'Asynchronous event streaming for payment webhooks, notifications, and collection batches.' },
      { category: 'Frontend Suite', stack: 'Next.js 16 + React 19 + PWA', role: 'Credit underwriter cockpit, field collection app, and executive risk telemetry.' },
      { category: 'Cryptographic Vault', stack: 'KMS + AES-256 GCM + SHA-256 Seals', role: 'Bank-grade data encryption at rest, in-transit, and inside immutable audit logs.' }
    ],
    topologySteps: [
      { step: '01', title: 'KYC Document Ingestion', detail: 'Aadhaar/PAN/Bank statements parse through OCR and run automated fraud checks in <45s.', status: 'COMPLETED' },
      { step: '02', title: 'Credit Score Calculation', detail: 'Rule engine calculates maximum loan eligibility and generates repayment amortization schedule.', status: 'COMPLETED' },
      { step: '03', title: 'Atomic Disbursal', detail: 'Transaction engine verifies ledger balance and dispatches IMPS/NEFT transfer via banking API.', status: 'COMPLETED' },
      { step: '04', title: 'Automated Reconciliation', detail: 'Daily collection webhooks credit double-entry accounts with zero rounding errors.', status: 'COMPLETED' }
    ],
    visualizerType: 'fintech',
    metrics: [
      { label: 'Underwriting Time', value: '< 45s', detail: 'Automated algorithmic document parsing' },
      { label: 'Ledger Balancing', value: 'Strict ACID', detail: 'Zero debit/credit transaction imbalance' },
      { label: 'Reconciliation', value: '< 30s', detail: 'End-of-day bank statement matching' }
    ],
    verifiedOutcomes: [
      'Accelerated loan origination and document verification from days to under 45 seconds',
      'Eliminated financial ledger reconciliation imbalances through strict double-entry architecture',
      'Automated collection webhook processing provided instant loan balance updates',
      'Achieved comprehensive banking regulatory compliance with immutable audit trails'
    ],
    dataDisclosureNotice: 'All underwriting speeds and reconciliation times reflect architectural design targets and verified throughput benchmarks measured under simulated loan origination stress tests.',
    deliverables: [
      'Double-Entry Accounting Core Engine & General Ledger',
      'Automated KYC Document Verification & Credit Engine',
      'Loan Origination System (LOS) & Loan Management System (LMS)',
      'Field Collection Officer Android / PWA Mobile App',
      'Automated SMS & WhatsApp Payment Reminder Daemon'
    ],
    gallery: [
      { id: 'g1', title: 'FinCore Double-Entry Ledger & Balance Sheet Cockpit', subtitle: 'Real-time debit/credit verification, trial balance, and branch liquidity', image: '/images/3d-software-dev.jpg', tag: 'Ledger Core' },
      { id: 'g2', title: 'Automated KYC Document Verification & Credit Scoring', subtitle: 'Optical Character Recognition (OCR), fraud rules, and loan limits', image: '/hero_workspace_editorial.jpg', tag: 'KYC Engine' },
      { id: 'g3', title: 'Loan Origination & Field Agent Mobile Collection Suite', subtitle: 'EMI amortization, GPS-stamped collections, and thermal receipting', image: '/hero_launch_artwork.png', tag: 'Loan PWA' }
    ],
    verdict: 'Engineered to accelerate loan origination cycles, eliminate accounting reconciliation lag, and provide bank-grade regulatory audit integrity.',
    nextSlug: 'healthcare-emr'
  }
];

export function getWorkProject(slug: string): WorkProject | undefined {
  const normalized = slug.toLowerCase().trim();
  return WORK_PROJECTS.find(
    (p) => p.slug === normalized || (p.aliases && p.aliases.includes(normalized))
  );
}

export function getAllWorkProjectSlugs(): string[] {
  const slugs: string[] = [];
  WORK_PROJECTS.forEach((p) => {
    slugs.push(p.slug);
    if (p.aliases) {
      slugs.push(...p.aliases);
    }
  });
  return slugs;
}
