export type ServiceCategory = 'technology' | 'marketing';

export interface ServiceWhatWeBuild {
  title: string;
  description: string;
  items: string[];
}

export interface ServiceCapability {
  title: string;
  description: string;
}

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface Service {
  slug: string;
  aliases?: string[];
  name: string;
  category: ServiceCategory;
  headline: string;
  description: string;
  iconName: string;
  emoji: string;
  image?: string;
  accent: string;
  badge: string;
  specs: ServiceSpec[];
  features: string[];
  whatWeBuild: ServiceWhatWeBuild[];
  capabilities: ServiceCapability[];
  approach: { step: string; title: string; description: string }[];
  technologies: string[];
  relatedWorkSlugs: string[];
  faqs: ServiceFAQ[];
}

// ── 7 CORE TECHNOLOGY & ENGINEERING SERVICES ──────────────────────
export const coreServices: Service[] = [
  {
    slug: 'custom-software-development',
    aliases: ['software-development', 'erp-solutions', 'erp-systems'],
    name: 'Custom Software Development',
    category: 'technology',
    headline: 'Bespoke Enterprise Systems, Admin Platforms & Workflow Engines',
    description:
      'Full-cycle custom software engineering designed to solve exact operational workflows, eliminate manual friction, and scale reliably with zero vendor lock-in.',
    iconName: 'Code2',
    emoji: '⚡',
    image: '/images/3d-software-dev.jpg',
    accent: '#10b981',
    badge: 'CORE VERTICAL 01',
    specs: [
      { label: 'CODE OWNERSHIP', value: '100% IP Transfer' },
      { label: 'ARCHITECTURE', value: 'Microservices & Modular' },
      { label: 'SLA STANDARD', value: '99.99% Enterprise' },
    ],
    features: [
      'Bespoke Business Applications & Portals',
      'High-Density Admin Dashboards & RBAC',
      'Custom Workflow Automation & State Machines',
      'Secure RESTful & gRPC API Backends',
      'Double-Entry Financial Ledgers & Audit Trails',
      'Scalable PostgreSQL & Redis Data Topology',
    ],
    whatWeBuild: [
      {
        title: 'Business Applications & ERP Platforms',
        description: 'Centralized operational suites tailored to your organizational workflows, multi-branch structures, and staff roles.',
        items: ['Multi-Branch Operations Hubs', 'Supply Chain & Inventory Management', 'Employee Attendance & Payroll Engines', 'Custom Approval Workflows'],
      },
      {
        title: 'Admin Systems & Operational Dashboards',
        description: 'High-density operational dashboards offering live telemetry, granular access governance, and actionable metrics.',
        items: ['Cryptographic RBAC Governance', 'Live Operational Telemetry', 'Comprehensive Audit Logs', 'Automated Export & Reporting'],
      },
      {
        title: 'Customer & Partner Portals',
        description: 'Secure, modern self-service web portals empowering clients, vendors, and partners to collaborate effortlessly.',
        items: ['Self-Service Client Accounts', 'Document Management & E-Signatures', 'Automated Invoicing & Payments', 'Role-Based Collaboration Workspaces'],
      },
      {
        title: 'Custom APIs & SaaS Engines',
        description: 'Robust, documented API backends and multi-tenant architectures engineered for high concurrency and integration.',
        items: ['High-Throughput REST & gRPC APIs', 'Multi-Tenant Database Partitioning', 'Webhook Event Broadcasting', 'Third-Party Software Connectors'],
      },
    ],
    capabilities: [
      {
        title: 'High-Concurrency Backends',
        description: 'Engineered with Java 21, Spring Boot, and Node.js for high throughput and predictable execution under heavy concurrent load.',
      },
      {
        title: 'Strict Data Isolation & Security',
        description: 'Row-level database security, mutual TLS encryption, AES-256 data at rest, and automated audit logging.',
      },
      {
        title: 'Event-Driven Systems',
        description: 'Asynchronous task workers, resilient message queuing, and real-time WebSocket state synchronization.',
      },
      {
        title: 'Zero Vendor Lock-In',
        description: 'Full code ownership, transparent Git history, Docker containerization, and standard open-source foundations.',
      },
    ],
    approach: [
      { step: '01', title: 'System Discovery & Domain Modeling', description: 'Deep audit of existing workflows, data schemas, compliance requirements, and latency budgets.' },
      { step: '02', title: 'Architecture Blueprint & Schema Design', description: 'Formalizing entity-relationship models, API boundaries, security roles, and user journeys.' },
      { step: '03', title: 'Deterministic Agile Execution', description: 'Iterative two-week sprints with automated test pipelines, code reviews, and staging demonstrations.' },
      { step: '04', title: 'Deployment, Hardening & IP Transfer', description: 'Production rollout with zero downtime, telemetry alarms, full documentation, and code transfer.' },
    ],
    technologies: ['Java 21', 'Spring Boot 4', 'Next.js 16', 'React 19', 'PostgreSQL', 'Redis', 'Docker', 'REST / gRPC'],
    relatedWorkSlugs: ['healthcare-emr', 'education-erp', 'retail-pos', 'fintech-ledger'],
    faqs: [
      {
        question: 'Does our company own the source code after development?',
        answer: 'Yes. 100% full intellectual property and source code ownership is transferred to your organization upon project completion with zero recurring licensing royalties.',
      },
      {
        question: 'Can you integrate custom software with our existing legacy systems?',
        answer: 'Yes. We frequently build secure API bridges, custom ETL pipelines, and database synchronizers to interface with legacy ERPs, accounting software, and banking systems.',
      },
      {
        question: 'What is your typical development timeline for enterprise platforms?',
        answer: 'Core production MVPs are typically delivered within 6 to 10 weeks via transparent, milestone-driven sprints with weekly working demos.',
      },
    ],
  },
  {
    slug: 'web-development',
    aliases: ['website-development'],
    name: 'Web Development',
    category: 'technology',
    headline: 'High-Performance Web Platforms, Portals & Web Applications',
    description:
      'Next-generation high-concurrency web engines built with React 19, Next.js 16 App Router, TypeScript, and edge functions for global low-latency performance.',
    iconName: 'Globe',
    emoji: '🌐',
    image: '/hero_workspace_editorial.jpg',
    accent: '#06b6d4',
    badge: 'CORE VERTICAL 02',
    specs: [
      { label: 'PERFORMANCE', value: '100 / 100 Lighthouse' },
      { label: 'FIRST PAINT', value: '< 0.4s FCP' },
      { label: 'CDN CACHING', value: 'Edge Multi-Region' },
    ],
    features: [
      'Next.js 16 App Router & React 19 Architecture',
      'TypeScript & Tailwind CSS Design Systems',
      'Sub-Second First Contentful Paint (FCP)',
      'Server-Side Rendering (SSR) & Edge Functions',
      'Full-Funnel SEO & Core Web Vitals Optimization',
      'Secure Authentication & Payment Gateways',
    ],
    whatWeBuild: [
      {
        title: 'Enterprise Corporate Web Platforms',
        description: 'Flagship digital representations built for enterprise authority, dynamic localization, and rapid lead capture.',
        items: ['Multi-Language Localization', 'Headless CMS Integration', 'High-Converting Landing Pages', 'Granular Event Tracking'],
      },
      {
        title: 'Customer Portals & Client Dashboards',
        description: 'Secure client-facing web applications with authentication, live status feeds, and transaction history.',
        items: ['OAuth & Session Security', 'Real-Time Data Visualization', 'Self-Service Document Downloads', 'In-App Notifications'],
      },
      {
        title: 'E-Commerce & Digital Storefronts',
        description: 'Fast, frictionless commerce engines engineered for high conversion rates and instant checkout experiences.',
        items: ['Dynamic Product Catalogs', 'Instant Cart & Checkout', 'Direct Gateway Sync (Razorpay, UPI, Stripe)', 'Automated Invoicing'],
      },
      {
        title: 'Progressive Web Apps (PWAs)',
        description: 'Web applications that install directly to desktop and mobile devices with offline caching and background sync.',
        items: ['Service Worker Offline Cache', 'App-Like Mobile Navigation', 'Push Notification Support', 'Low-Bandwidth Optimization'],
      },
    ],
    capabilities: [
      {
        title: 'Turbopack & Edge Rendering',
        description: 'Leveraging Next.js App Router streaming and edge workers to eliminate load latency across all geographies.',
      },
      {
        title: 'Type-Safe Full-Stack Design',
        description: 'End-to-end TypeScript interfaces linking client UI components directly with backend API data contracts.',
      },
      {
        title: 'Accessible & Responsive Systems',
        description: 'Fluid layouts engineered from 320px mobile viewports to ultra-wide displays with strict WCAG AAA contrast.',
      },
      {
        title: 'Search & Social Optimization',
        description: 'Dynamic Open Graph metadata, structured JSON-LD schemas, and pre-rendered sitemaps for maximum search visibility.',
      },
    ],
    approach: [
      { step: '01', title: 'Content & Information Architecture', description: 'Structuring page hierarchies, conversion paths, and technical SEO schema.' },
      { step: '02', title: 'Component Library & Design Tokens', description: 'Building atomic Tailwind CSS primitives and responsive layout skeletons.' },
      { step: '03', title: 'Full-Stack Implementation', description: 'Developing server-rendered pages, edge API routes, and client interactivity.' },
      { step: '04', title: 'Core Web Vitals Audit & Launch', description: 'Validating 100/100 Lighthouse performance, security headers, and CDN cache rules.' },
    ],
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Node.js', 'Vercel / Cloudflare Edge'],
    relatedWorkSlugs: ['retail-pos', 'hospitality-erp', 'healthcare-emr'],
    faqs: [
      {
        question: 'Why does OHO TECH prioritize Next.js and React 19 for web platforms?',
        answer: 'Next.js provides the optimal balance of enterprise SEO (via Server-Side Rendering), lightning-fast edge caching, and scalable React 19 architecture without bloated dependencies.',
      },
      {
        question: 'How do you guarantee top Core Web Vitals and SEO rankings?',
        answer: 'We engineer our code with zero unnecessary client JavaScript, optimize image delivery with modern WebP/AVIF formats, enforce zero layout shifts, and inject structured JSON-LD metadata.',
      },
      {
        question: 'Will the website be easy for our internal team to update?',
        answer: 'Yes. We architect intuitive content management workflows and clear documentation, enabling your team to update text, media, and products without writing code.',
      },
    ],
  },
  {
    slug: 'mobile-app-development',
    aliases: ['mobile-apps', 'android-app-development', 'ios-app-development', 'mobile-business-apps'],
    name: 'Mobile App Development',
    category: 'technology',
    headline: 'Native iOS & Android Applications, Offline Sync & Store Deployment',
    description:
      'Fluid 120 FPS native and cross-platform mobile engineering for iOS and Android, featuring offline-first SQLite sync, peripheral hardware drivers, and full App Store / Play Store lifecycle management.',
    iconName: 'Smartphone',
    emoji: '📱',
    image: '/hero_ipad_mockup_ohotech.jpg',
    accent: '#8b5cf6',
    badge: 'CORE VERTICAL 03',
    specs: [
      { label: 'FRAME RATE', value: '120 FPS Fluid' },
      { label: 'OFFLINE SYNC', value: 'SQLite / Room' },
      { label: 'STORE DEPLOYMENT', value: 'App Store & Play Store' },
    ],
    features: [
      'Native Android Development (Kotlin)',
      'Native iOS Development (Swift & SwiftUI)',
      'Offline-First Local SQLite Sync Engine',
      'Hardware Peripherals (Bluetooth Printers & Scanners)',
      'Biometric Authentication & Token Security',
      'Push Notifications & Live Telemetry',
      'Google Play Store & Apple App Store Deployment',
      'Long-Term OS Maintenance & Support',
    ],
    whatWeBuild: [
      {
        title: 'Native Android Applications',
        description: 'Robust, battery-optimized Android applications built with Kotlin and Jetpack Compose for enterprise handhelds and consumer devices.',
        items: ['Kotlin Native Architecture', 'Jetpack Compose Fluid UI', 'Background Sync WorkManager', 'Android Keystore Security'],
      },
      {
        title: 'Native iOS Applications',
        description: 'Refined, fluid iOS apps engineered in Swift and SwiftUI respecting Apple Human Interface Guidelines and hardware capabilities.',
        items: ['Swift & SwiftUI Implementation', 'CoreData & CloudKit Sync', 'Secure Enclave Biometrics', 'Apple In-App Purchases (StoreKit)'],
      },
      {
        title: 'Field Operations & Dispatch Apps',
        description: 'Dedicated mobile tools for field sales representatives, warehouse pickers, and delivery drivers working on the go.',
        items: ['GPS Route & Dispatch Tracking', 'Offline Order Taking & Receipts', 'Barcode & QR Scanning Cameras', 'Bluetooth Thermal Printer Drivers'],
      },
      {
        title: 'Consumer Products & Customer Apps',
        description: 'High-engagement mobile apps for booking, commerce, loyalty programs, and automated real-time alerts.',
        items: ['Instant Payment Integrations (UPI, Apple Pay, Google Pay)', 'FCM & APNs Push Alerts', 'Rich Media & Interactive Feeds', 'In-App Live Chat & Support'],
      },
    ],
    capabilities: [
      {
        title: 'Offline-First SQLite Sync Engine',
        description: 'Ensuring zero operational downtime by caching transactions locally in SQLite/Room and automatically syncing with the cloud when connectivity returns.',
      },
      {
        title: 'Hardware & Peripheral Integration',
        description: 'Direct low-level Bluetooth and USB drivers for wireless thermal receipt printers, 2D barcode scanners, cash drawers, and NFC tags.',
      },
      {
        title: 'Google Play & Apple App Store Deployment',
        description: 'Complete release management: code signing, privacy declarations, App Store review compliance, Google Play policy adherence, and staging track rollout.',
      },
      {
        title: 'Ongoing OS Maintenance & Upgrades',
        description: 'Proactive updates ensuring your apps comply with annual Android Target SDK requirements, iOS major updates, and modern security standards.',
      },
    ],
    approach: [
      { step: '01', title: 'Mobile Architecture & User Flows', description: 'Mapping native navigation, offline caching rules, and hardware device requirements.' },
      { step: '02', title: 'Native UI Prototyping & Design Systems', description: 'Designing platform-specific HIG and Material Design components with 120 FPS targets.' },
      { step: '03', title: 'Engine Development & Offline Sync', description: 'Implementing Kotlin/Swift native code, database migrations, and background sync queues.' },
      { step: '04', title: 'Store Certification & Staging Release', description: 'Rigorous physical device testing, Play Console & App Store Connect submission and launch.' },
    ],
    technologies: ['Kotlin', 'Swift & SwiftUI', 'SQLite / Room', 'Firebase FCM', 'Apple APNs', 'Google Play Console', 'App Store Connect'],
    relatedWorkSlugs: ['retail-pos', 'healthcare-emr', 'hospitality-erp'],
    faqs: [
      {
        question: 'Do you develop natively or use cross-platform frameworks?',
        answer: 'We develop native Android (Kotlin) and native iOS (Swift/SwiftUI) for enterprise performance and hardware driver integration, and cross-platform solutions when rapid unified deployment is requested.',
      },
      {
        question: 'How does offline data synchronization work?',
        answer: 'Transactions, orders, and record edits are saved immediately to an encrypted local SQLite/Room database with WAL (Write-Ahead Logging). When network connectivity is restored, our background sync engine pushes pending queues to the cloud with conflict resolution.',
      },
      {
        question: 'Do you handle the entire Google Play Store and Apple App Store publishing process?',
        answer: 'Yes. Our team prepares all necessary developer certificates, privacy manifests, screenshots, store listings, and navigates the formal app store review processes to achieve approval.',
      },
      {
        question: 'What happens after the app is published?',
        answer: 'We provide ongoing maintenance contracts covering annual iOS/Android OS updates, security patches, crash monitoring, and feature enhancements.',
      },
    ],
  },
  {
    slug: 'ui-ux-design',
    aliases: [],
    name: 'UI/UX Design',
    category: 'technology',
    headline: 'Human-Centered Design Systems, Spatial Interfaces & Interactive Prototypes',
    description:
      'Precision user experience design, comprehensive multi-device design systems, interactive prototypes, and high-density dashboards architected for clarity and WCAG AAA accessibility.',
    iconName: 'Palette',
    emoji: '🎨',
    image: '/hero_launch_artwork.png',
    accent: '#ec4899',
    badge: 'CORE VERTICAL 04',
    specs: [
      { label: 'ACCESSIBILITY', value: 'WCAG AAA Standard' },
      { label: 'DESIGN TOKENS', value: '800+ Semantic System' },
      { label: 'USABILITY TARGET', value: 'Zero Cognitive Friction' },
    ],
    features: [
      'User Research & Operational Journey Mapping',
      'Multi-Device Design Systems & Semantic Tokens',
      'High-Density Telemetry & Analytics Dashboards',
      'Interactive Figma Prototypes & Validation',
      'Mobile-First Responsive Wireframes',
      'WCAG AAA Accessibility & Usability Audits',
    ],
    whatWeBuild: [
      {
        title: 'Enterprise Design Systems',
        description: 'Unified visual languages containing tokenized color hierarchies, typography scales, spacing units, and reusable UI components.',
        items: ['Semantic Color Tokens', 'Accessible Typography Hierarchies', 'Reusable UI Component Kits', 'Cross-Platform Design Handoff'],
      },
      {
        title: 'High-Density Operational Interfaces',
        description: 'Clean, legible data tables, filtering panels, and status monitors designed for high-stress business environments.',
        items: ['Data Grid Architecture', 'Rapid Search & Filter Controls', 'Visual Telemetry Status Cards', 'Real-Time Alert Badges'],
      },
      {
        title: 'Consumer Product & App Flows',
        description: 'Friction-free onboarding journeys, conversion funnels, checkout experiences, and account management portals.',
        items: ['Streamlined Registration & Onboarding', 'Single-Page Checkout Flows', 'Intuitive Search & Exploration', 'Visual Profile & Settings'],
      },
      {
        title: 'Interactive Clickable Prototypes',
        description: 'Realistic, high-fidelity prototypes that mirror production interaction, used to validate ideas with users before coding.',
        items: ['High-Fidelity User Testing', 'Micro-Interaction Demonstrations', 'Stakeholder Alignment Previews', 'Developer Spec Handoff'],
      },
    ],
    capabilities: [
      {
        title: 'Cognitive Friction Reduction',
        description: 'Analyzing user behavior to eliminate unnecessary clicks, optimize visual hierarchy, and streamline critical workflows.',
      },
      {
        title: 'Strict Accessibility Compliance',
        description: 'Meeting rigorous WCAG AAA standards for color contrast, readable text scaling, keyboard navigation, and focus indicators.',
      },
      {
        title: 'Seamless Developer Handoff',
        description: 'Exporting design specifications directly into clean Tailwind CSS classes, CSS variables, and modular component structures.',
      },
      {
        title: 'Design Audits & Modernization',
        description: 'Evaluating existing software interfaces to identify UX bottlenecks, inconsistent patterns, and visual debt.',
      },
    ],
    approach: [
      { step: '01', title: 'User Research & Workflow Audit', description: 'Interviewing stakeholders, reviewing user behavior, and diagramming ideal flows.' },
      { step: '02', title: 'Wireframes & Information Architecture', description: 'Creating low-fidelity wireframes to establish layout, hierarchy, and information density.' },
      { step: '03', title: 'Design System & Interactive Prototyping', description: 'Applying design tokens, creating pixel-perfect components, and linking clickable prototypes.' },
      { step: '04', title: 'Validation & Engineering Handoff', description: 'Usability testing with real users and providing developer-ready component assets.' },
    ],
    technologies: ['Figma', 'Design Tokens', 'Tailwind CSS', 'WCAG AAA Standards', 'Motion Design'],
    relatedWorkSlugs: ['healthcare-emr', 'education-erp', 'retail-pos', 'hospitality-erp', 'fintech-ledger'],
    faqs: [
      {
        question: 'What deliverables are included with a UI/UX design project?',
        answer: 'Deliverables include editable Figma files, a complete design system with semantic tokens, interactive clickable prototypes, export-ready SVG assets, and developer implementation guides.',
      },
      {
        question: 'How do you test and validate designs before development starts?',
        answer: 'We conduct guided walkthroughs using interactive Figma prototypes with key stakeholders and end users to validate usability, identify friction, and refine workflows before engineering begins.',
      },
      {
        question: 'Can you redesign our existing application without breaking how users work?',
        answer: 'Yes. We specialize in incremental modernization, retaining familiar operational shortcuts while upgrading visual clarity, responsiveness, and performance.',
      },
    ],
  },
  {
    slug: 'ai-automation',
    aliases: ['ai-ml-solutions'],
    name: 'AI & Automation',
    category: 'technology',
    headline: 'Practical Enterprise AI, Vector Search & Intelligent Workflow Automation',
    description:
      'Domain-specific AI solutions, enterprise pgvector semantic search databases, automated document parsing, and background workflow pipelines engineered for measurable operational efficiency.',
    iconName: 'Cpu',
    emoji: '🧠',
    image: '/images/3d-software-dev.jpg',
    accent: '#06b6d4',
    badge: 'CORE VERTICAL 05',
    specs: [
      { label: 'DATA PRIVACY', value: 'Zero Public Training' },
      { label: 'VECTOR RETRIEVAL', value: 'Sub-50ms HNSW' },
      { label: 'AUTOMATION PIPELINE', value: 'Deterministic' },
    ],
    features: [
      'Enterprise Knowledge Retrieval (RAG)',
      'pgvector & HNSW High-Speed Vector Databases',
      'Automated Document OCR & Invoice Extraction',
      'WhatsApp & Email Automated Workflow Bots',
      'Predictive Telemetry & Real-Time Analytics',
      'Private Model Proxies & Data Boundary Shields',
    ],
    whatWeBuild: [
      {
        title: 'Enterprise Knowledge Assistants (RAG)',
        description: 'Internal search and assistant engines that accurately answer staff queries using your internal policies, manuals, and databases.',
        items: ['Internal Document Question-Answering', 'Semantic Codebase & Wiki Search', 'Context-Aware Customer Support Copilots', 'Hallucination Prevention Guardrails'],
      },
      {
        title: 'Automated Document & Invoice Extraction',
        description: 'High-accuracy OCR pipelines that automatically parse physical bills, invoices, and IDs into structured database records.',
        items: ['Purchase Invoice Item Extraction', 'Government ID & Document OCR', 'Automated GST & Tax Verification', 'Direct Ledger Integration'],
      },
      {
        title: 'Intelligent Workflow Bots & Triggers',
        description: 'Automated bots that capture leads, answer common customer questions, schedule appointments, and dispatch alerts.',
        items: ['WhatsApp Business Lead Routing', 'Automated Ticket Triage & Categorization', 'Inventory Reorder Recommendation Bots', 'Multi-System Webhook Sync'],
      },
      {
        title: 'Predictive Analytics & Anomaly Detection',
        description: 'Algorithms that detect irregular financial transactions, predict inventory runouts, and identify customer churn patterns.',
        items: ['Financial Anomaly Detection', 'Inventory Stockout Prediction', 'Churn Risk Scoring', 'Operational Trend Visualization'],
      },
    ],
    capabilities: [
      {
        title: 'Strict Data Privacy & Sovereign Isolation',
        description: 'Your proprietary company data is kept strictly private and is never submitted to public LLM training datasets.',
      },
      {
        title: 'Deterministic Logic Combined with AI',
        description: 'We blend reliable business rules and database constraints with probabilistic AI models to prevent costly hallucinations.',
      },
      {
        title: 'High-Speed Vector Search',
        description: 'Deploying pgvector and HNSW indexing within PostgreSQL for fast, scalable semantic similarity lookups.',
      },
      {
        title: 'Seamless ERP & API Connectivity',
        description: 'Connecting AI pipelines directly into existing backend databases, accounting ledgers, and communication channels.',
      },
    ],
    approach: [
      { step: '01', title: 'Data Audit & Feasibility Assessment', description: 'Evaluating internal data quality, document formats, and identifying high-ROI automation targets.' },
      { step: '02', title: 'Pipeline Architecture & Prompt Engineering', description: 'Designing embeddings schemas, vector indexing, validation guardrails, and fallback logic.' },
      { step: '03', title: 'Integration & Accuracy Benchmarking', description: 'Connecting models with real data sources and running evaluation benchmarks against ground truth.' },
      { step: '04', title: 'Production Rollout & Telemetry Monitoring', description: 'Deploying secure model proxies, real-time logging, and feedback loops for continuous improvement.' },
    ],
    technologies: ['Python', 'pgvector', 'PostgreSQL', 'FastAPI', 'LangChain', 'Redis', 'Docker'],
    relatedWorkSlugs: ['fintech-ledger', 'healthcare-emr', 'retail-pos'],
    faqs: [
      {
        question: 'Is our corporate data safe and protected from public model training?',
        answer: 'Yes. We utilize enterprise API agreements, private vector databases, and localized models ensuring your data remains 100% confidential and is never used to train public AI models.',
      },
      {
        question: 'How do you prevent AI models from generating inaccurate information (hallucinations)?',
        answer: 'We employ Retrieval-Augmented Generation (RAG) with strict context boundaries, confidence score thresholds, and deterministic validation rules that reject unverifiable answers.',
      },
      {
        question: 'Can AI automations integrate directly with our existing databases?',
        answer: 'Yes. Our AI pipelines output strictly typed JSON that writes directly to your PostgreSQL, MySQL, or ERP databases via verified APIs.',
      },
    ],
  },
  {
    slug: 'cloud-devops',
    aliases: ['cloud-infrastructure'],
    name: 'Cloud & DevOps',
    category: 'technology',
    headline: 'Multi-Region Cloud Topology, Docker Containers & Automated CI/CD',
    description:
      'Enterprise AWS and VPS cloud engineering, Docker containerization, automated CI/CD pipelines, and 24/7 telemetry monitoring with high availability and zero single points of failure.',
    iconName: 'Server',
    emoji: '☁️',
    image: '/images/3d-enterprise-node.jpg',
    accent: '#3b82f6',
    badge: 'CORE VERTICAL 06',
    specs: [
      { label: 'UPTIME SLA', value: '99.999% Target' },
      { label: 'FAILOVER SPEED', value: 'Sub-Minute Recovery' },
      { label: 'DEPLOYMENT RISK', value: 'Zero-Downtime Rolling' },
    ],
    features: [
      'Multi-Region Cloud Topologies & Auto-Failover',
      'Docker & Container Orchestration Clustering',
      'Automated CI/CD Pipelines (GitHub Actions)',
      'Infrastructure as Code (IaC) with Terraform',
      '24/7 Health Telemetry & Prometheus Monitoring',
      'DDoS Protection & Cloudflare Edge Hardening',
    ],
    whatWeBuild: [
      {
        title: 'Scalable Cloud Hosting Topologies',
        description: 'Reliable, cost-effective infrastructure setups across AWS, DigitalOcean, and dedicated high-performance Linux VPS instances.',
        items: ['VPC Subnet & Security Group Architecture', 'Multi-Zone Database Replication', 'High-Availability Nginx Reverse Proxies', 'Load Balancing & Traffic Distribution'],
      },
      {
        title: 'Automated CI/CD Deployment Pipelines',
        description: 'Automated continuous integration and deployment pipelines that build, test, and deploy software updates without manual steps.',
        items: ['GitHub Actions Workflows', 'Automated Unit & Integration Test Runners', 'Zero-Downtime Blue/Green Rollouts', 'Instant One-Click Rollback Triggers'],
      },
      {
        title: 'Security Hardening & Edge Protection',
        description: 'Comprehensive edge defense and server hardening protecting your applications against unauthorized access and DDoS attacks.',
        items: ['Cloudflare Enterprise Edge & WAF', 'Mutual TLS & Automatic SSL/TLS Renewals', 'Fail2ban & Linux Kernel Hardening', 'Granular SSH Key Access Controls'],
      },
      {
        title: 'Telemetry, Logging & Disaster Recovery',
        description: 'Centralized log aggregation, real-time metric dashboards, and automated offsite backup routines.',
        items: ['System Health & Uptime Monitors', 'Automated Daily Database Backups', 'Point-In-Time Disaster Recovery Drills', 'Automated SMS/Email Incident Alerts'],
      },
    ],
    capabilities: [
      {
        title: 'Zero-Downtime Rolling Deployments',
        description: 'Deploying updates seamlessly using health-check verification and graceful socket handoffs so your users experience zero disruption.',
      },
      {
        title: 'Cost-Optimized Architecture',
        description: 'Designing right-sized architectures that avoid cloud bill shock while delivering enterprise speed and reliable capacity.',
      },
      {
        title: 'Immutable Infrastructure as Code',
        description: 'Managing cloud resources declaratively using Terraform and container configurations for reproducible and auditable environments.',
      },
      {
        title: 'Comprehensive Disaster Recovery',
        description: 'Continuous WAL database archiving and automated off-site backups providing rapid recovery in the event of hardware failure.',
      },
    ],
    approach: [
      { step: '01', title: 'Infrastructure Audit & Capacity Planning', description: 'Analyzing existing server utilization, bottlenecks, and security vulnerabilities.' },
      { step: '02', title: 'Containerization & Environment Setup', description: 'Standardizing applications in Docker containers and establishing isolated staging and production environments.' },
      { step: '03', title: 'CI/CD Automation & Test Hardening', description: 'Configuring automated pipelines that run test suites and execute verified deployments.' },
      { step: '04', title: 'Telemetry, Backup Drills & Handover', description: 'Setting up monitoring dashboards, executing backup recovery drills, and transferring all infrastructure keys.' },
    ],
    technologies: ['Docker', 'GitHub Actions', 'AWS / Ubuntu VPS', 'Nginx', 'PostgreSQL', 'Terraform', 'Prometheus & Grafana'],
    relatedWorkSlugs: ['fintech-ledger', 'education-erp', 'healthcare-emr'],
    faqs: [
      {
        question: 'Can you deploy and configure infrastructure on our company cloud account?',
        answer: 'Yes. We configure infrastructure directly within your AWS, DigitalOcean, or private VPS account so your organization retains full billing control and ownership.',
      },
      {
        question: 'How do you prevent downtime when deploying software updates?',
        answer: 'We utilize containerized zero-downtime rolling deployments where new application instances are verified healthy before previous instances are gracefully terminated.',
      },
      {
        question: 'How often are backups taken, and how are they verified?',
        answer: 'We configure automated daily encrypted database snapshots and continuous Write-Ahead Log (WAL) archiving, backed by scheduled restoration drills to verify data integrity.',
      },
    ],
  },
  {
    slug: 'maintenance-support',
    aliases: ['support-maintenance'],
    name: 'Maintenance & Support',
    category: 'technology',
    headline: 'SLA-Backed Systems Support, Security Patching & 24/7 Performance Monitoring',
    description:
      'Dedicated enterprise maintenance agreements, continuous uptime monitoring, security patching, dependency upgrades, and rapid incident response by senior OHO TECH engineers.',
    iconName: 'ShieldCheck',
    emoji: '🛡️',
    image: '/images/3d-enterprise-node.jpg',
    accent: '#10b981',
    badge: 'CORE VERTICAL 07',
    specs: [
      { label: 'SLA RESPONSE', value: 'Priority Sub-Hour' },
      { label: 'SECURITY SCANNING', value: 'Continuous OWASP' },
      { label: 'SUPPORT ACCESS', value: 'Dedicated Help Desk' },
    ],
    features: [
      'Guaranteed Response & Resolution Times (SLA)',
      '24/7 Server & Application Health Monitoring',
      'Proactive Security Vulnerability & OS Patching',
      'Database Performance Tuning & Index Maintenance',
      'Framework & Dependency Upgrades (Java, Node, Next.js)',
      'Dedicated Support Portal & Incident Ticketing',
    ],
    whatWeBuild: [
      {
        title: 'Enterprise SLA Support Contracts',
        description: 'Clear, guaranteed service level agreements defining rapid response and resolution times for mission-critical platforms.',
        items: ['Priority Severity-1 Incident Response', 'Dedicated Senior Engineer Assignment', 'Direct Support Portal Ticketing', 'Monthly Health & SLA Reports'],
      },
      {
        title: 'Proactive Security & Vulnerability Management',
        description: 'Regular security audits, CVE vulnerability scans, security patch rollouts, and SSL/TLS certificate renewals.',
        items: ['Continuous Dependency Auditing', 'Automated Security Patch Application', 'OWASP Top 10 Compliance Checks', 'Firewall Rule & Access Audits'],
      },
      {
        title: 'Database & System Performance Optimization',
        description: 'Continuous monitoring of query latency, database indexing, memory consumption, and disk capacity.',
        items: ['Slow Query Identification & Indexing', 'Database Vacuuming & Table Reindexing', 'Cache Hit Ratio Optimization', 'Disk Space & Resource Scalability'],
      },
      {
        title: 'Technology Upgrades & Modernization',
        description: 'Smooth, planned version upgrades across operating systems, runtime environments, and application libraries.',
        items: ['Java & Spring Boot Version Upgrades', 'Node.js & Next.js Release Upgrades', 'Database Engine Patching', 'Regression Testing & Verification'],
      },
    ],
    capabilities: [
      {
        title: 'Rapid Incident Resolution',
        description: 'When production issues occur, our engineering team diagnoses root causes and deploys verified hotfixes swiftly.',
      },
      {
        title: 'Real-Time Telemetry & Alerting',
        description: 'Automated monitoring bots trigger immediate engineer alerts when error rates, latency spikes, or hardware thresholds are breached.',
      },
      {
        title: 'Preventative Maintenance',
        description: 'Addressing technical debt and minor anomalies before they escalate into costly user-facing downtime.',
      },
      {
        title: 'Transparent Help Desk Communication',
        description: 'Submit, track, and review support tickets directly through the OHO TECH authenticated customer support portal.',
      },
    ],
    approach: [
      { step: '01', title: 'System Onboarding & Health Audit', description: 'Reviewing codebase, server topology, configuration files, and establishing baseline health metrics.' },
      { step: '02', title: 'Monitoring & Alert Setup', description: 'Installing telemetry agents, configuring uptime monitors, and setting threshold alert routes.' },
      { step: '03', title: 'Routine Maintenance & Security Hardening', description: 'Executing scheduled database optimizations, library updates, and security patch testing.' },
      { step: '04', title: 'Incident Response & Continuous Reporting', description: 'Providing 24/7 on-call triage for critical issues and monthly service health summaries.' },
    ],
    technologies: ['Systemd', 'PostgreSQL', 'Docker', 'OWASP Scanners', 'Grafana', 'OHO Help Desk'],
    relatedWorkSlugs: ['healthcare-emr', 'retail-pos', 'education-erp', 'hospitality-erp'],
    faqs: [
      {
        question: 'What response times are guaranteed under your support SLA?',
        answer: 'Our SLA agreements specify response times as fast as 30 minutes for critical (Severity 1) production incidents affecting core operations.',
      },
      {
        question: 'Can OHO TECH maintain software built by a third-party developer?',
        answer: 'Yes. We conduct an initial Codebase & Architecture Health Audit to understand system design, document dependencies, and address any urgent security or stability issues before assuming ongoing support.',
      },
      {
        question: 'How do our staff report bugs or request changes?',
        answer: 'Your team can open and track tickets directly in the OHO TECH Help Desk portal at /support or contact our on-call engineering team directly.',
      },
    ],
  },
];

// ── COMPLEMENTARY DIGITAL GROWTH & MARKETING SERVICES ─────────────
export const marketingServices: Service[] = [
  {
    slug: 'seo',
    aliases: ['search-engine-optimization'],
    name: 'Search Engine Optimization (SEO)',
    category: 'marketing',
    headline: 'Data-Driven Search Engine Rankings & Organic Lead Generation',
    description: 'Technical SEO, Core Web Vitals optimization, and authority link architecture engineered to rank your digital products on Google.',
    iconName: 'Search',
    emoji: '🔍',
    image: '/images/3d-digital-growth.jpg',
    accent: '#10b981',
    badge: 'GROWTH VERTICAL 01',
    specs: [
      { label: 'CORE WEB VITALS', value: '100% Pass' },
      { label: 'INDEXING SPEED', value: 'Real-Time' },
      { label: 'FOCUS', value: 'High-Intent Keywords' },
    ],
    features: ['Technical SEO & Core Web Vitals', 'On-Page Architecture', 'Authority Link Building', 'Keyword Intelligence', 'Monthly Performance Telemetry'],
    whatWeBuild: [
      { title: 'Technical Architecture Optimization', description: 'Eliminating crawl errors, improving site speed, and configuring structured JSON-LD schemas.', items: ['Robots.txt & Sitemap Optimization', 'Canonical URL Architecture', 'Page Speed Optimization', 'Schema Markup'] },
      { title: 'On-Page Content Strategy', description: 'Targeting high-intent commercial keywords that drive relevant corporate inquiries.', items: ['Keyword Mapping', 'Meta Title & Description Engineering', 'Internal Linking Structures', 'Content Auditing'] },
    ],
    capabilities: [
      { title: 'Technical SEO Hardening', description: 'Resolving indexation issues, duplicate content, and slow server response times.' },
      { title: 'Data-Backed Reporting', description: 'Transparent monthly Google Search Console and analytics ranking reports.' },
    ],
    approach: [
      { step: '01', title: 'Technical SEO Audit', description: 'Full crawl and health audit identifying technical blockers.' },
      { step: '02', title: 'Keyword & Competitor Research', description: 'Mapping target keywords by commercial search intent.' },
      { step: '03', title: 'On-Page Optimization', description: 'Upgrading meta tags, internal links, and structured data.' },
      { step: '04', title: 'Monitoring & Scaling', description: 'Tracking keyword movements and expanding topical authority.' },
    ],
    technologies: ['Google Search Console', 'Lighthouse', 'JSON-LD', 'Next.js SEO', 'Schema.org'],
    relatedWorkSlugs: ['retail-pos', 'education-erp'],
    faqs: [
      { question: 'How long does it take to see SEO ranking improvements?', answer: 'Technical fixes often produce ranking improvements within 4 to 8 weeks, with compounding organic growth occurring over 3 to 6 months.' },
    ],
  },
  {
    slug: 'google-ads',
    aliases: ['search-ppc'],
    name: 'Google Ads & Search PPC',
    category: 'marketing',
    headline: 'High-Intent Google Search, Performance Max & Display Lead Campaigns',
    description: 'Precision Google Search campaigns, negative keyword hardening, and conversion tracking engineered for maximum return on ad spend.',
    iconName: 'Megaphone',
    emoji: '🎯',
    image: '/images/3d-digital-growth.jpg',
    accent: '#f59e0b',
    badge: 'GROWTH VERTICAL 02',
    specs: [
      { label: 'TARGET ROAS', value: '3.5x - 6.0x' },
      { label: 'TRACKING', value: 'Server-Side CAPI' },
      { label: 'LEAD QUALITY', value: 'Verified Intent' },
    ],
    features: ['High-Intent Search Campaigns', 'Performance Max Optimization', 'Negative Keyword Hardening', 'Conversion Tracking Pixels', 'ROAS Maximization'],
    whatWeBuild: [
      { title: 'High-Intent Search Campaigns', description: 'Targeting users actively searching for your exact software and services.', items: ['Exact & Phrase Match Targeting', 'Compelling Ad Copywriting', 'Ad Extensions & Sitelinks', 'Negative Keyword Lists'] },
    ],
    capabilities: [
      { title: 'Strict Budget Efficiency', description: 'Preventing wasted spend through aggressive negative keyword management.' },
      { title: 'Conversion Tracking Setup', description: 'Accurate tracking of phone calls, form submissions, and purchases.' },
    ],
    approach: [
      { step: '01', title: 'Audience & Search Term Analysis', description: 'Identifying commercial queries with clear buying intent.' },
      { step: '02', title: 'Campaign Architecture & Copy', description: 'Writing high-CTR ads and setting up conversion pixels.' },
      { step: '03', title: 'Bid & Quality Score Optimization', description: 'Managing CPC bids to maximize impressions at lowest cost.' },
      { step: '04', title: 'Continuous Scaling', description: 'Reinvesting budget into top-performing keywords and ad sets.' },
    ],
    technologies: ['Google Ads', 'Google Tag Manager', 'Server CAPI', 'Analytics 4'],
    relatedWorkSlugs: ['retail-pos', 'hospitality-erp'],
    faqs: [
      { question: 'Do you manage our ad spend directly?', answer: 'You pay Google directly for ad spend through your own billing account. We charge a transparent campaign management fee.' },
    ],
  },
  {
    slug: 'facebook-meta-ads',
    aliases: ['meta-advertising'],
    name: 'Meta & Instagram Advertising',
    category: 'marketing',
    headline: 'Creative-Led Facebook & Instagram Ad Funnels for Customer Acquisition',
    description: 'Dynamic creative testing, lookalike audience acquisition, and conversion API funnels engineered to convert cold prospects into loyal clients.',
    iconName: 'Layers',
    emoji: '📸',
    image: '/images/3d-digital-growth.jpg',
    accent: '#ec4899',
    badge: 'GROWTH VERTICAL 03',
    specs: [
      { label: 'CREATIVE VELOCITY', value: 'Multi-Variant' },
      { label: 'TRACKING', value: 'Meta CAPI Sync' },
      { label: 'AUDIENCES', value: 'Custom & Lookalike' },
    ],
    features: ['Dynamic Creative Testing', 'Lookalike & Custom Audiences', 'Funnel Retargeting Sequences', 'CAPI Conversion Tracking', 'Creative Velocity'],
    whatWeBuild: [
      { title: 'Direct-Response Funnels', description: 'Engaging ad campaigns designed to capture customer interest and generate qualified leads.', items: ['Visual Video & Graphic Ads', 'High-Converting Landing Pages', 'Lead Form Integration', 'Retargeting Audiences'] },
    ],
    capabilities: [
      { title: 'Meta Conversion API (CAPI)', description: 'Server-to-server tracking that bypasses browser ad-blockers for accurate attribution.' },
      { title: 'Dynamic Retargeting', description: 'Showing relevant ads to visitors based on the specific products they viewed.' },
    ],
    approach: [
      { step: '01', title: 'Creative Strategy & Hook Mapping', description: 'Developing visual concepts and compelling ad copy angles.' },
      { step: '02', title: 'Tracking & Pixel Verification', description: 'Setting up Meta CAPI and verified conversion events.' },
      { step: '03', title: 'Testing & Winner Identification', description: 'Testing multiple creatives to isolate top-performing ads.' },
      { step: '04', title: 'Scaling Profitable Sets', description: 'Scaling budget on winning creative assets and audiences.' },
    ],
    technologies: ['Meta Ads Manager', 'Meta Pixel', 'Conversions API', 'Figma'],
    relatedWorkSlugs: ['retail-pos', 'hospitality-erp'],
    faqs: [
      { question: 'Who creates the ad graphics and videos?', answer: 'Our creative team designs all ad graphics, video motion assets, and write the persuasive copy.' },
    ],
  },
  {
    slug: 'branding-graphic-design',
    aliases: ['branding'],
    name: 'Branding & Graphic Design',
    category: 'marketing',
    headline: 'Distinctive Visual Identity Systems, Brand Guidelines & Marketing Assets',
    description: 'Comprehensive brand identity systems, typography scales, vector iconography, and high-impact marketing collateral for modern enterprises.',
    iconName: 'Palette',
    emoji: '🎨',
    image: '/hero_launch_artwork.png',
    accent: '#8b5cf6',
    badge: 'GROWTH VERTICAL 04',
    specs: [
      { label: 'ASSET QUALITY', value: 'Infinite Vector' },
      { label: 'DESIGN TOKENS', value: 'Semantic System' },
      { label: 'DOCUMENTATION', value: 'Full Brand Book' },
    ],
    features: ['Complete Brand Guidelines', 'Logo & Iconography Suites', 'Design Systems & Typography', 'Marketing Collateral', 'Vector Asset Libraries'],
    whatWeBuild: [
      { title: 'Corporate Visual Identity', description: 'Logos, color palettes, and typographic hierarchies that convey professional authority.', items: ['Primary & Secondary Logos', 'Color Palette Systems', 'Custom Typography Pairing', 'Brand Application Rules'] },
    ],
    capabilities: [
      { title: 'Vector Asset Precision', description: 'Pixel-perfect vector designs scalable from mobile app icons to large outdoor banners.' },
      { title: 'Consistent Brand Guidelines', description: 'Comprehensive documentation so your internal team applies branding consistently.' },
    ],
    approach: [
      { step: '01', title: 'Brand Discovery & Positioning', description: 'Uncovering brand values, target audience perception, and aesthetic direction.' },
      { step: '02', title: 'Concept Exploration', description: 'Developing distinct logo and visual concepts for stakeholder review.' },
      { step: '03', title: 'Refinement & Guidelines', description: 'Polishing selected concepts into complete color, typography, and logo systems.' },
      { step: '04', title: 'Asset Pack Delivery', description: 'Exporting vector SVG, PDF, and high-resolution web formats with documentation.' },
    ],
    technologies: ['Figma', 'Adobe Illustrator', 'Vector SVG', 'Brand Tokens'],
    relatedWorkSlugs: ['education-erp', 'healthcare-emr'],
    faqs: [
      { question: 'What file formats are delivered for our logo and brand assets?', answer: 'We deliver full vector source files (.AI, .SVG, .PDF) and optimized raster files (.PNG, .WebP) in all color variations.' },
    ],
  },
  {
    slug: 'whatsapp-marketing',
    aliases: ['whatsapp-automation'],
    name: 'WhatsApp Marketing & Automation',
    category: 'marketing',
    headline: 'Official WhatsApp Business API, Automated Broadcasts & Customer Support Bots',
    description: 'Official WhatsApp Business API integration, automated transactional updates, customer support bots, and verified payment link dispatch.',
    iconName: 'MessageCircle',
    emoji: '💬',
    image: '/images/3d-digital-growth.jpg',
    accent: '#10b981',
    badge: 'GROWTH VERTICAL 05',
    specs: [
      { label: 'DELIVERABILITY', value: '99.8% Rate' },
      { label: 'API TYPE', value: 'Official Meta API' },
      { label: 'INTERACTION', value: 'Automated Bots' },
    ],
    features: ['WhatsApp Business API', 'Automated Lead Bots', 'Transactional Broadcasts', 'Payment Link Integration', 'CRM Webhook Sync'],
    whatWeBuild: [
      { title: 'Transactional Messaging Systems', description: 'Sending order confirmations, e-invoices, and delivery alerts directly via WhatsApp.', items: ['Automated PDF Invoice Dispatch', 'Payment Link Reminders', 'Appointment Confirmations', 'Delivery Status Alerts'] },
    ],
    capabilities: [
      { title: 'Official Meta Business Verification', description: 'Helping your company obtain the official green badge and high-tier messaging quotas.' },
      { title: 'Interactive Chatbot Flows', description: 'Menu-driven chatbot flows that guide prospects and collect inquiries 24/7.' },
    ],
    approach: [
      { step: '01', title: 'API Account & Number Setup', description: 'Setting up official Meta WhatsApp Business API accounts and verified templates.' },
      { step: '02', title: 'Workflow & Bot Architecture', description: 'Designing interactive bot decision trees and message copy.' },
      { step: '03', title: 'Webhook & Backend Integration', description: 'Connecting messaging triggers directly to your existing database and ERP.' },
      { step: '04', title: 'Testing & Launch', description: 'Validating message deliverability, opt-out compliance, and staff handoff.' },
    ],
    technologies: ['WhatsApp Business API', 'Meta Cloud API', 'Webhooks', 'Node.js'],
    relatedWorkSlugs: ['retail-pos', 'hospitality-erp'],
    faqs: [
      { question: 'Does WhatsApp marketing comply with privacy regulations?', answer: 'Yes. We build opt-in collection and opt-out workflows that comply strictly with Meta policies and telecom regulations.' },
    ],
  },
  {
    slug: 'email-marketing',
    aliases: ['email-automation'],
    name: 'Email Marketing & Lead Nurture',
    category: 'marketing',
    headline: 'Automated Drip Workflows, Transactional Updates & Deliverability Optimization',
    description: 'High-deliverability automated email sequences, transactional updates, newsletter engines, and segmentation workflows that build long-term client loyalty.',
    iconName: 'Mail',
    emoji: '✉️',
    image: '/images/3d-digital-growth.jpg',
    accent: '#3b82f6',
    badge: 'GROWTH VERTICAL 06',
    specs: [
      { label: 'AUTHENTICATION', value: 'DKIM / SPF / DMARC' },
      { label: 'DELIVERABILITY', value: 'Inbox Guaranteed' },
      { label: 'SEGMENTATION', value: 'Dynamic Tagging' },
    ],
    features: ['Automated Drip Workflows', 'DKIM / SPF / DMARC Deliverability', 'Dynamic Segmentation', 'A/B Subject Testing', 'Open & CTR Analytics'],
    whatWeBuild: [
      { title: 'Automated Customer Journeys', description: 'Sequences that welcome new customers, nurture prospective leads, and re-engage inactive accounts.', items: ['Welcome Onboarding Drips', 'Quote & Proposal Follow-Ups', 'Product Feature Highlights', 'Renewal & Expiry Reminders'] },
    ],
    capabilities: [
      { title: 'Domain Deliverability Hardening', description: 'Configuring SPF, DKIM, DMARC, and custom return-path records to avoid the spam folder.' },
      { title: 'Responsive Email Templates', description: 'Mobile-tested HTML email templates that render crisply across Outlook, Apple Mail, and Gmail.' },
    ],
    approach: [
      { step: '01', title: 'DNS & Authentication Audit', description: 'Configuring SPF, DKIM, and DMARC records for pristine domain reputation.' },
      { step: '02', title: 'Template Design & Copywriting', description: 'Designing branded, responsive templates and writing persuasive email copy.' },
      { step: '03', title: 'Automated Workflow Configuration', description: 'Building conditional logic triggers based on user actions and tags.' },
      { step: '04', title: 'Testing & Deliverability Monitoring', description: 'A/B testing subject lines and monitoring open rates, click-throughs, and spam metrics.' },
    ],
    technologies: ['Transactional SMTP', 'DKIM & SPF', 'HTML5 Email', 'Analytics'],
    relatedWorkSlugs: ['education-erp', 'healthcare-emr'],
    faqs: [
      { question: 'How do you prevent our marketing emails from going into spam?', answer: 'We authenticate your sending domain with strict SPF, DKIM, and DMARC DNS records, warm up new IPs, and maintain clean subscriber lists.' },
    ],
  },
  {
    slug: 'social-media-marketing',
    aliases: ['social-media-management'],
    name: 'Social Media Marketing',
    category: 'marketing',
    headline: 'Strategic Social Content, Brand Authority & Audience Acquisition',
    description: 'End-to-end strategic content creation, brand building, and community management across LinkedIn, Instagram, X, and YouTube.',
    iconName: 'Share2',
    emoji: '📲',
    image: '/images/3d-digital-growth.jpg',
    accent: '#06b6d4',
    badge: 'GROWTH VERTICAL 07',
    specs: [
      { label: 'CHANNELS', value: 'LinkedIn, Meta, X' },
      { label: 'FOCUS', value: 'B2B Brand Authority' },
      { label: 'CONTENT', value: 'High-Value Insights' },
    ],
    features: ['Multi-Channel Strategy', 'High-Converting Creative Assets', 'Community Management', 'Audience Retargeting', 'Growth Analytics'],
    whatWeBuild: [
      { title: 'Corporate Social Presence', description: 'Establishing consistent authority and thought leadership across primary B2B and consumer social platforms.', items: ['LinkedIn Thought Leadership', 'Instagram Brand Narrative', 'Product Announcement Graphics', 'Community Engagement'] },
    ],
    capabilities: [
      { title: 'Consistent Editorial Calendars', description: 'Structured monthly publishing schedules delivering consistent brand presence.' },
      { title: 'Engaging Visual Assets', description: 'Infographics, carousel slides, and short-form video content designed for high shareability.' },
    ],
    approach: [
      { step: '01', title: 'Audience & Channel Alignment', description: 'Selecting the most effective channels where your ideal decision-makers congregate.' },
      { step: '02', title: 'Content Pillar Definition', description: 'Establishing topic pillars covering case studies, technical tips, and product value.' },
      { step: '03', title: 'Design & Publishing', description: 'Designing assets, writing captions, and scheduling posts for optimal engagement times.' },
      { step: '04', title: 'Community & Performance Review', description: 'Responding to inbound comments and analyzing follower growth and engagement.' },
    ],
    technologies: ['LinkedIn', 'Instagram', 'Figma', 'Buffer / Hootsuite'],
    relatedWorkSlugs: ['retail-pos', 'education-erp'],
    faqs: [
      { question: 'Which social channels are best for B2B technology businesses?', answer: 'LinkedIn and YouTube typically deliver the highest ROI for B2B technology and enterprise software through thought leadership and technical demos.' },
    ],
  },
];

// Unified list of all services
export const services: Service[] = [...coreServices, ...marketingServices];

// Categorized convenience exports
export const technologyServices: Service[] = coreServices;

// Lookup helper supporting canonical slug and historical aliases
export function getServiceBySlug(slug: string): Service | undefined {
  if (!slug) return undefined;
  const normalized = slug.toLowerCase().trim();
  return services.find(
    (s) => s.slug === normalized || (s.aliases && s.aliases.includes(normalized))
  );
}
