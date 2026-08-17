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
      'Full-cycle software development from ideation to deployment, using modern tech stacks and agile methodologies.',
    iconName: 'Code2',
    emoji: '💻',
    features: ['Requirement Analysis', 'Architecture Design', 'Agile Development', 'Testing & QA', 'Deployment & Support'],
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
      'Responsive, SEO-optimized websites and web applications built with cutting-edge frameworks.',
    iconName: 'Globe',
    emoji: '🌐',
    features: ['Responsive Design', 'SEO Optimization', 'CMS Integration', 'Performance Tuning', 'Security Audit'],
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

  // ── Digital Growth Services ──────────────────────────────
  {
    slug: 'seo',
    name: 'Search Engine Optimization (SEO)',
    category: 'marketing',
    description:
      'Data-driven SEO strategies to rank higher on search engines, drive organic traffic, and generate qualified leads.',
    iconName: 'Search',
    emoji: '🔍',
    features: ['Technical SEO', 'On-Page Optimization', 'Link Building', 'Keyword Strategy', 'Monthly Analytics'],
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
