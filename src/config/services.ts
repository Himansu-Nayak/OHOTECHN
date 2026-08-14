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
    slug: 'website-development',
    name: 'Website Development',
    category: 'technology',
    description:
      'Responsive, SEO-optimized websites and web applications built with cutting-edge frameworks.',
    iconName: 'Globe',
    emoji: '🌐',
    features: ['Corporate Websites', 'Landing Pages', 'Web Applications', 'CMS Development', 'Performance Optimization'],
  },
  {
    slug: 'android-app-development',
    name: 'Android App Development',
    category: 'technology',
    description:
      'Native and cross-platform Android applications with Material Design and Play Store deployment.',
    iconName: 'Smartphone',
    emoji: '🤖',
    features: ['Native Android (Kotlin)', 'Cross-Platform (Flutter/React Native)', 'UI/UX Design', 'Play Store Deployment', 'App Maintenance'],
  },
  {
    slug: 'ios-app-development',
    name: 'iOS App Development',
    category: 'technology',
    description:
      "Elegant, high-performance iOS applications following Apple's Human Interface Guidelines.",
    iconName: 'Tablet',
    emoji: '📱',
    features: ['Native iOS (Swift)', 'Cross-Platform', 'Apple Watch & iPad', 'App Store Deployment', 'Push Notifications'],
  },
  {
    slug: 'custom-software-development',
    name: 'Custom Software Development',
    category: 'technology',
    description:
      'Tailor-made software solutions designed to address your unique business challenges and workflows.',
    iconName: 'Wrench',
    emoji: '🛠️',
    features: ['Business Analysis', 'Custom Architecture', 'Third-Party Integrations', 'Data Migration', 'Ongoing Support'],
  },
  {
    slug: 'erp-solutions',
    name: 'ERP Solutions',
    category: 'technology',
    description:
      'Enterprise Resource Planning systems that unify finance, HR, operations, and supply chain management.',
    iconName: 'LayoutGrid',
    emoji: '⚙️',
    features: ['Finance & Accounting', 'HR & Payroll', 'Inventory & SCM', 'CRM Integration', 'Custom Modules'],
  },
  {
    slug: 'ui-ux-design',
    name: 'UI/UX Design',
    category: 'technology',
    description:
      'User-centered design that converts visitors into customers through intuitive, beautiful interfaces.',
    iconName: 'Palette',
    emoji: '🎨',
    features: ['User Research', 'Wireframing & Prototyping', 'Visual Design', 'Design Systems', 'Usability Testing'],
  },
  {
    slug: 'api-integration',
    name: 'API Integration',
    category: 'technology',
    description:
      'Seamless integration with payment gateways, CRMs, ERPs, and third-party APIs.',
    iconName: 'Plug',
    emoji: '🔌',
    features: ['RESTful APIs', 'Payment Gateways', 'Social Login', 'SMS & Email APIs', 'Custom Middleware'],
  },

  // ── Digital Marketing Services ───────────────────────────
  {
    slug: 'seo',
    name: 'SEO',
    category: 'marketing',
    description:
      'Data-driven search engine optimization to boost your organic visibility and drive qualified traffic.',
    iconName: 'Search',
    emoji: '🔍',
    features: ['Technical SEO Audit', 'On-Page Optimization', 'Link Building', 'Content Strategy', 'Analytics & Reporting'],
  },
  {
    slug: 'social-media-marketing',
    name: 'Social Media Marketing',
    category: 'marketing',
    description:
      'Strategic social media campaigns that build brand awareness and engage your target audience.',
    iconName: 'Share2',
    emoji: '📢',
    features: ['Content Creation', 'Community Management', 'Paid Social Ads', 'Influencer Outreach', 'Performance Analytics'],
  },
  {
    slug: 'google-ads',
    name: 'Google Ads',
    category: 'marketing',
    description:
      'ROI-focused Google Ads campaigns including Search, Display, Shopping, and YouTube advertising.',
    iconName: 'Target',
    emoji: '🎯',
    features: ['Campaign Setup', 'Keyword Research', 'Ad Copy & Creative', 'Bid Management', 'Conversion Tracking'],
  },
  {
    slug: 'facebook-meta-ads',
    name: 'Facebook & Meta Ads',
    category: 'marketing',
    description:
      'Targeted advertising across Facebook, Instagram, and the Meta ecosystem for maximum reach.',
    iconName: 'Megaphone',
    emoji: '🚀',
    features: ['Audience Targeting', 'Creative Design', 'A/B Testing', 'Retargeting', 'Lead Generation Ads'],
  },
  {
    slug: 'branding-graphic-design',
    name: 'Branding & Graphic Design',
    category: 'marketing',
    description:
      'Cohesive brand identities and visual assets that set you apart from the competition.',
    iconName: 'PenTool',
    emoji: '🖌️',
    features: ['Logo Design', 'Brand Guidelines', 'Marketing Collateral', 'Social Media Graphics', 'Packaging Design'],
  },
  {
    slug: 'whatsapp-marketing',
    name: 'WhatsApp Marketing',
    category: 'marketing',
    description:
      'Engage customers directly with WhatsApp Business API campaigns, broadcasts, and chatbots.',
    iconName: 'MessageCircle',
    emoji: '💬',
    features: ['Broadcast Campaigns', 'Chatbot Development', 'Catalogue Integration', 'Automated Replies', 'Analytics Dashboard'],
  },
  {
    slug: 'email-marketing',
    name: 'Email Marketing',
    category: 'marketing',
    description:
      'High-converting email campaigns with segmentation, automation, and detailed performance tracking.',
    iconName: 'Mail',
    emoji: '✉️',
    features: ['Campaign Design', 'List Segmentation', 'Marketing Automation', 'A/B Testing', 'Deliverability Optimization'],
  },
];

export const technologyServices = services.filter((s) => s.category === 'technology');
export const marketingServices = services.filter((s) => s.category === 'marketing');
