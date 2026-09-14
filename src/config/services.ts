export type ServiceCategory = 'technology' | 'marketing';

export type Service = {
  slug: string;
  name: string;
  category: ServiceCategory;
  description: string;
  iconName: string;
  emoji: string;
  features: string[];
};

export const services: Service[] = [
  // ── Technology Services ──────────────────────────────────
  {
    slug: 'software-development',
    name: 'Software Development',
    category: 'technology',
    description:
      'Full-cycle enterprise software development from system architecture to cloud deployment, using Java Spring Boot, Node.js, React, Next.js, PostgreSQL, and scalable microservices.',
    iconName: 'Code2',
    emoji: '💻',
    features: [
      'Java Spring Boot & Node.js Microservices',
      'React, Next.js & TypeScript Architecture',
      'PostgreSQL, MongoDB & Redis Data Engineering',
      'RESTful & GraphQL API Integration',
      'Docker, Cloud Infrastructure & CI/CD Pipelines',
      'Automated QA Testing & Enterprise Security SLA',
    ],
  },
  {
    slug: 'whatsapp-billing',
    name: 'WhatsApp Billing & Invoicing',
    category: 'technology',
    description:
      'Automated e-Invoicing, e-Way bills, instant WhatsApp bill sharing, and payment link dispatch for retail and wholesale enterprise.',
    iconName: 'MessageCircle',
    emoji: '💬',
    features: ['Instant WhatsApp Bills', 'e-Invoicing & e-Way Automation', 'UPI Payment Links', 'Automated GST Reports'],
  },
  {
    slug: 'mobile-business-apps',
    name: 'Mobile Apps Suite (Owner, Sales & Delivery)',
    category: 'technology',
    description:
      'Integrated mobile app ecosystem: Owner Analytics App, Field Sales Order App, and Driver Delivery Tracking App.',
    iconName: 'Smartphone',
    emoji: '📱',
    features: ['Owner Live Analytics App', 'Salesman Order App', 'Driver Dispatch Tracking', 'Customer Self-Ordering App'],
  },
  {
    slug: 'connected-banking',
    name: 'Connected Banking & Auto Reconciliation',
    category: 'technology',
    description:
      'Direct API integration with major banks (ICICI, HDFC, SBI) for instant ledger payout reconciliation and automated bank statements.',
    iconName: 'Plug',
    emoji: '🏦',
    features: ['Direct Bank API Sync', 'Auto Bank Reconciliation', 'One-Click Vendor Payouts', 'Financial Audit Trail'],
  },
  {
    slug: 'warehouse-management',
    name: 'Multi-Warehouse & Batch Inventory',
    category: 'technology',
    description:
      'Advanced multi-branch inventory tracking with batch numbers, expiry dates, serial tracking, and barcode scanning.',
    iconName: 'LayoutGrid',
    emoji: '📦',
    features: ['Batch & Expiry Tracking', 'Barcode Scanner Sync', 'Inter-Branch Stock Transfer', 'Automated Reorder Alerts'],
  },
  {
    slug: 'education-continuum-erp',
    name: 'Vocational Education & e-Governance ERP',
    category: 'technology',
    description:
      'Transformational digital solutions for Vocational Education and Skill Development—e-Learning platforms, Digital Assessments, and e-Governance portals.',
    iconName: 'Globe',
    emoji: '🎓',
    features: ['Vocational Skill Portals', 'Digital Assessment Engine', 'e-Governance Portals', 'Employability & Certification Track'],
  },
  {
    slug: 'website-development',
    name: 'Website Development',
    category: 'technology',
    description:
      'High-performance, responsive web applications and corporate portals built with React, Next.js, TypeScript, and modern UI engineering.',
    iconName: 'Globe',
    emoji: '🌐',
    features: [
      'React & Next.js Web App Architecture',
      'TypeScript & Tailwind CSS Design Systems',
      'SEO & Core Web Vitals Optimization',
      'Server-Side Rendering (SSR) & API Integration',
      'Cloud Hosting, Security & Performance Tuning',
    ],
  },
  {
    slug: 'android-app-development',
    name: 'Android App Development',
    category: 'technology',
    description:
      'Native and cross-platform Android applications designed for high performance and intuitive user experience.',
    iconName: 'Smartphone',
    emoji: '📱',
    features: ['Native Android (Kotlin)', 'Flutter / React Native', 'Offline Storage', 'Push Notifications', 'Play Store Deployment'],
  },
  {
    slug: 'ios-app-development',
    name: 'iOS App Development',
    category: 'technology',
    description:
      'Native Swift and SwiftUI iOS applications designed for Apple platforms with exceptional performance and fluid interactive animations.',
    iconName: 'Smartphone',
    emoji: '🍎',
    features: ['Native Swift & SwiftUI', 'Apple CoreData & CloudKit', 'StoreKit In-App Purchases', 'Apple Health & CoreML Sync', 'App Store Review & Release'],
  },
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    category: 'technology',
    description:
      'Bespoke software engineered to solve exact operational workflows, eliminate manual friction, and scale with high concurrency.',
    iconName: 'Code2',
    emoji: '⚡',
    features: ['Tailored Business Logic', 'Event-Driven Architecture', 'Role-Based Access Control', 'Dedicated Database Topology', 'Comprehensive SLA Support'],
  },
  {
    slug: 'cloud-infrastructure',
    name: 'Cloud & DevOps Infrastructure',
    category: 'technology',
    description:
      'Enterprise AWS, Docker, Kubernetes, and Terraform infrastructure engineering with high availability, automated failover, and zero downtime.',
    iconName: 'Cloud',
    emoji: '☁️',
    features: ['AWS / Cloudflare Edge Setup', 'Docker & Kubernetes Clustering', 'Terraform Infrastructure as Code', 'Automated CI/CD Pipelines', '24/7 Telemetry & DDoS Shield'],
  },
  {
    slug: 'erp-solutions',
    name: 'ERP Solutions',
    category: 'technology',
    description:
      'Custom ERP systems to streamline business operations, supply chain, finance, and human resources.',
    iconName: 'Wrench',
    emoji: '⚙️',
    features: ['Custom ERP Modules', 'Data Migration', 'Role-Based Access', 'Real-Time Analytics', 'Third-Party Integration'],
  },
  {
    slug: 'api-integration',
    name: 'API Integration Services',
    category: 'technology',
    description:
      'Seamless API integration to connect your software with third-party platforms, payment gateways, and cloud services.',
    iconName: 'Plug',
    emoji: '🔌',
    features: ['RESTful & GraphQL APIs', 'Payment Gateway Sync', 'CRM & ERP Connectors', 'Webhook Setup', 'API Security'],
  },
  {
    slug: 'ai-ml-solutions',
    name: 'Neural AI & Tensor Systems',
    category: 'technology',
    description:
      'Custom fine-tuned large language models, enterprise vector similarity databases, and real-time predictive telemetry pipelines for business intelligence and process automation.',
    iconName: 'Cpu',
    emoji: '🧠',
    features: ['Custom LLM Fine-Tuning & Prompt Shields', 'pgvector & HNSW Vector Search', 'Streaming Inference Edge Proxies', 'Predictive Telemetry & Real-Time Analytics'],
  },
  {
    slug: 'web-development',
    name: 'Enterprise Web Platforms',
    category: 'technology',
    description:
      'Next-generation high-concurrency web engines built with React 19, Next.js App Router, Turbopack, and serverless edge functions for global low-latency performance.',
    iconName: 'Layers',
    emoji: '🌐',
    features: ['React 19 & Next.js 16 App Router', 'Turbopack Zero-Lag Compilation', 'Tailwind CSS 4 Precision Styling', 'Streaming SSR & Global Edge CDN'],
  },
  {
    slug: 'mobile-apps',
    name: 'Native Mobile Engineering',
    category: 'technology',
    description:
      'Fluid 120 FPS iOS and Android ecosystems engineered with native Swift, Kotlin Multiplatform, and resilient offline synchronization.',
    iconName: 'Smartphone',
    emoji: '📱',
    features: ['Native Swift & SwiftUI (iOS)', 'Kotlin Multiplatform (Android)', 'Offline-First SQLite Sync Engine', 'Biometric Security & Push Telemetry'],
  },
  {
    slug: 'erp-systems',
    name: 'Distributed ERP & Ledger',
    category: 'technology',
    description:
      'Mission-critical enterprise resource planning systems with cryptographic audit trails, multi-branch inventory coordination, and real-time financial ledger synchronization.',
    iconName: 'Database',
    emoji: '📊',
    features: ['Multi-Branch Inventory & Warehousing', 'Immutable Audit Trails & Cryptographic RBAC', 'Connected Banking & Auto-Reconciliation', 'High-Throughput Concurrent Processing'],
  },

  // ── Digital Growth Services ──────────────────────────────
  {
    slug: 'seo',
    name: 'Search Engine Optimization (SEO)',
    category: 'marketing',
    description:
      'Data-driven SEO strategies to rank higher on search engines, drive organic traffic, and generate qualified leads.',
    iconName: 'Search',
    emoji: '🔍',
    features: ['Technical SEO & Core Web Vitals', 'On-Page Architecture', 'Authority Link Building', 'Keyword Intelligence', 'Monthly Performance Telemetry'],
  },
  {
    slug: 'social-media-marketing',
    name: 'Social Media Marketing',
    category: 'marketing',
    description:
      'Strategic social content, brand narrative development, and audience acquisition across LinkedIn, Instagram, X, and YouTube.',
    iconName: 'Share2',
    emoji: '📲',
    features: ['Multi-Channel Strategy', 'High-Converting Creative Assets', 'Community Management', 'Audience Retargeting', 'Growth Analytics'],
  },
  {
    slug: 'google-ads',
    name: 'Google Ads & Search PPC',
    category: 'marketing',
    description:
      'Precision Google Search, Performance Max, and Display ad campaigns architected for maximum return on ad spend (ROAS).',
    iconName: 'Megaphone',
    emoji: '🎯',
    features: ['High-Intent Search Campaigns', 'Performance Max Optimization', 'Negative Keyword Hardening', 'Conversion Tracking Pixels', 'ROAS Maximization'],
  },
  {
    slug: 'facebook-meta-ads',
    name: 'Meta & Instagram Advertising',
    category: 'marketing',
    description:
      'Creative-led Facebook and Instagram ad funnels engineered to convert cold audiences into loyal enterprise clients.',
    iconName: 'Layers',
    emoji: '📸',
    features: ['Dynamic Creative Testing', 'Lookalike & Custom Audiences', 'Funnel Retargeting Sequences', 'CAPI Conversion Tracking', 'Creative Velocity'],
  },
  {
    slug: 'branding-graphic-design',
    name: 'Branding & Graphic Design',
    category: 'marketing',
    description:
      'Visual identity systems, design tokens, brand guidelines, and high-impact digital marketing assets.',
    iconName: 'Palette',
    emoji: '🎨',
    features: ['Complete Brand Guidelines', 'Logo & Iconography Suites', 'Design Systems & Typography', 'Marketing Collateral', 'Vector Asset Libraries'],
  },
  {
    slug: 'whatsapp-marketing',
    name: 'WhatsApp Marketing & Automation',
    category: 'marketing',
    description:
      'Official WhatsApp Business API integration, broadcast campaigns, automated customer chatbots, and instant lead notification bots.',
    iconName: 'MessageCircle',
    emoji: '💬',
    features: ['WhatsApp Business API', 'Automated Lead Bots', 'Transactional Broadcasts', 'Payment Link Integration', 'CRM Webhook Sync'],
  },
  {
    slug: 'email-marketing',
    name: 'Email Marketing & Lead Nurture',
    category: 'marketing',
    description:
      'High-deliverability automated email sequences, transactional updates, newsletter engines, and segmentation workflows.',
    iconName: 'Mail',
    emoji: '✉️',
    features: ['Automated Drip Workflows', 'DKIM / SPF / DMARC Deliverability', 'Dynamic Segmentation', 'A/B Subject Testing', 'Open & CTR Analytics'],
  },
  {
    slug: 'digital-marketing',
    name: 'Digital Marketing & Ads',
    category: 'marketing',
    description:
      'Targeted PPC campaigns, Google & Meta ads, and conversion optimization to scale your online presence.',
    iconName: 'Megaphone',
    emoji: '📢',
    features: ['Google Search Ads', 'Meta Ad Campaigns', 'Retargeting', 'Conversion Rate Optimization', 'ROI Reporting'],
  },
  {
    slug: 'social-media-management',
    name: 'Social Media Management',
    category: 'marketing',
    description:
      'End-to-end social media strategy, content creation, community engagement, and brand building.',
    iconName: 'Share2',
    emoji: '📲',
    features: ['Content Planning', 'Graphic & Video Production', 'Community Moderation', 'Audience Insights', 'Influencer Outreach'],
  },
  {
    slug: 'content-planning',
    name: 'Content Planning & Strategy',
    category: 'marketing',
    description:
      'Strategic editorial calendar creation, content mapping, target audience research, and multi-channel publishing strategy.',
    iconName: 'Calendar',
    emoji: '📅',
    features: ['Editorial Content Calendar', 'Audience Segmentation', 'Brand Voice Guidelines', 'Publishing Workflow', 'Performance Analytics'],
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    category: 'marketing',
    description:
      'Human-centered design systems, wireframing, and interactive prototyping for web and mobile products.',
    iconName: 'Palette',
    emoji: '🎨',
    features: ['User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing', 'Design Audit'],
  },
];

export const technologyServices = services.filter((s) => s.category === 'technology');
export const marketingServices = services.filter((s) => s.category === 'marketing');
